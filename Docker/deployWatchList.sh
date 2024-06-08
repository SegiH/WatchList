#!/bin/bash 
 
 # If you have a zip file named watchlist.zip in the same location as this script, this script will use that.
 # If you have a Directory named WatchList but do not have watchlist.zip in the same location as this script, you can use the parameter --use-existing to redeploy WatchList using the WatchList directory.
 # If you do not have a zip file named watchlist.zip and do not have a directory named WatchList in the current directory, the latest code will be pulled from Github and used to build this app
 COMPOSE_SCRIPT=/home/JohnDoe/secure-files/WatchList/docker-compose.yml
 CONFIG_FILE=/home/JohnDoe/WatchList/config/default.json
 DB_FILE=/home/JohnDoe/WatchListDB/watchlistdb.sqlite
 
 DOCKER_COMMANDS=( "docker stop WatchList WatchList_unsecured" "docker rm WatchList WatchList_unsecured" )
 
 # DO NOT CHANGE ANYTHING BELOW THIS LINE
 DESTINATION_DIR=/home/segi/WatchList
 ZIP_FILE=watchlist.zip
 USE_EXISTING_PARAM="--use-existing"
 REPO_URL=https://github.com/SegiH/WatchList
 
 # Validate that these 3 variables are set
 if [ ! -f $COMPOSE_SCRIPT ]; then
      echo "${COMPOSE_SCRIPT} was not found!"
      exit 1
 fi   
 
 if [ ! -f $CONFIG_FILE ]; then
      echo "${CONFIG_FILE} was not found!"
      exit 1
 fi
 
 if [ ! -f $DB_FILE ]; then
      echo "${DB_FILE} was not found!"
      exit 1
 fi
 
 # The only command line parameter allowed is in USE_EXISTING_PARAM
 if [[ "$1" != "" ]] && [[ "$1" != "$USE_EXISTING_PARAM" ]]; then
      echo "An invalid parameter was provided"
      exit 1
 fi
 
 # If USE_EXISTING_PARAM was passed and destination dir was not found
 if [[ "$1" = "$USE_EXISTING_PARAM" ]] && ! [[ -d $DESTINATION_DIR ]]; then
      echo "${DESTINATION_DIR} directory not found!"
      exit 1
 fi

 # If watchlist.zip was found and WatchList directory exists, user has to rename either the zip file or directory
 if [[ -f $ZIP_FILE ]] && [[ -d $DESTINATION_DIR ]]; then
      echo "${ZIP_FILE} and ${DESTINATION_DIR} directory were both found! Rename ${ZIP_FILE} or ${DESTINATION_DIR} directory"
      exit 1
 fi
 
 # If watchlist.zip was found and USE_EXISTING_PARAM was passed, display error. You can't have both
 if [[ -f $ZIP_FILE ]] && [[ "$1" = "$USE_EXISTING_PARAM" ]]; then
      echo "${ZIP_FILE} was found and ${USE_EXISTING_PARAM} was passed. Either rename ${ZIP_FILE} or remove the parameter ${USE_EXISTING_PARAM}"
      exit 1
 fi
 
 # If watchlist.zip doesn't exist but WatchList directory does and USE_EXISTING_PARAM was not passed, force user to remove it since cloning Github repo will create this directory
 if [[ -d $DESTINATION_DIR ]] && [[ "$1" != "$USE_EXISTING_PARAM" ]]; then
      echo "${DESTINATION_DIR} directory exists. Rename it"
      exit 1
 fi
 
 if [ -f $ZIP_FILE ]; then # If watchlist.zip file exists
       unzip $ZIP_FILE -d "$DESTINATION_DIR"
 elif [[ "$1" != "$USE_EXISTING_PARAM" ]]; then # If user did not pass USE_EXISTING_PARAM
       git clone https://github.com/SegiH/WatchList "$DESTINATION_DIR"
 fi
 
 cd $DESTINATION_DIR > /dev/null
 
 cp "$COMPOSE_SCRIPT" .
 
 cp "$CONFIG_FILE" config/
 
 cp "$DB_FILE" .

 cp Docker/Dockerfile .
 
 docker buildx build . -t watchlist
 
 for CURR_COMMAND in "${DOCKER_COMMANDS[@]}"
 do
      `${CURR_COMMAND}`
 done
 
 docker-compose up -d
 
 if [[ "$1" != "$USE_EXISTING_PARAM" ]]; then
      rm -rf $DESTINATION_DIR
 fi