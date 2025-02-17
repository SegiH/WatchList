<# If you have a zip file named watchlist.zip in the same location as this script, this script will use that.
# If you have a Directory named WatchList but do not have watchlist.zip in the same location as this script, yo u can use the parameter --use-existing to redeploy WatchList using the WatchList directory.
# If you do not have a zip file named watchlist.zip and do not have a directory named WatchList in the current  directory, the latest code will be pulled from Github and used to build this app
#>
$COMPOSE_SCRIPT="C:\Users\JohnDoe\docker-compose.yml"
#$CONFIG_FILE="C:\Users\JohnDoe\default.json"
$ENV_FILE="C:\Users\JohnDoe\.env"
$DB_FILE="C:\Users\JohnDoe\database.json"
$DOCKER_COMMANDS='docker stop WatchList','docker rm WatchList'

# DO NOT CHANGE ANYTHING BELOW THIS LINE
$DESTINATION_DIR="WatchList"
$ZIP_FILE="watchlist.zip"
$USE_EXISTING_PARAM="--use-existing"
$REPO_URL="https://github.com/SegiH/WatchList"

$COMPOSE_SCRIPT_EXISTS = Test-Path $COMPOSE_SCRIPT
$ENV_FILE_EXISTS = Test-Path $ENV_FILE
#$CONFIG_FILE_EXISTS = Test-Path $CONFIG_FILE
$DB_FILE_EXISTS = Test-Path $DB_FILE
$DESTINATION_DIR_EXISTS=Test-Path $DESTINATION_DIR
$ZIP_FILE_EXISTS=Test-Path $ZIP_FILE

# Validate that these 3 variables are set
if ( ! $COMPOSE_SCRIPT_EXISTS) {
     throw "$COMPOSE_SCRIPT was not found!”
}

#if ( ! $CONFIG_FILE_EXISTS) {
#     throw "$CONFIG_FILE was not found!”
#}

if ( ! $ENV_FILE_EXISTS) {
     throw "$ENV_FILE_EXISTS was not found!”
}

if ( ! $DB_FILE_EXISTS) {
     throw "$DB_FILE was not found!”
}

$command_line_param = $args[0]

# The only command line parameter allowed is in USE_EXISTING_PARAM
if ($command_line_param -ne $null -and $command_line_param -ne $USE_EXISTING_PARAM) {
     throw "An invalid parameter was provided”
}

# If USE_EXISTING_PARAM was passed and destination dir was not found
if ($command_line_param -eq $USE_EXISTING_PARAM -and $DESTINATION_DIR_EXISTS -eq $False) {
     throw "$DESTINATION_DIR directory not found”
}

# If watchlist.zip was found and WatchList directory exists, user has to rename either the zip file or directory
if ($ZIP_FILE_EXISTS -eq $True -and $DESTINATION_DIR_EXISTS -eq $True) {
     throw "$ZIP_FILE and $DESTINATION_DIR directory were both found! Rename $ZIP_FILE or $DESTINATION_DIR directory”
}

# If watchlist.zip was found and USE_EXISTING_PARAM was passed, display error. You can't have both
if ($ZIP_FILE_EXISTS -eq $True -and $command_line_param -eq $USE_EXISTING_PARAM) {
     throw "$ZIP_FILE and $USE_EXISTING_PARAM was passed. Either rename $ZIP_FILE or remove the parameter $USE_EXISTING_PARAM”
}

# If watchlist.zip doesn't exist but WatchList directory does and USE_EXISTING_PARAM was not passed, force user  to remove it since cloning Github repo will create this directory
if ($DESTINATION_DIR_EXISTS -eq $True -and $command_line_param -ne $USE_EXISTING_PARAM) {
     throw "$DESTINATION_DIR directory exists. Remove it”
}

if ($ZIP_FILE_EXISTS -eq $True) {
     Expand-Archive -LiteralPath $ZIP_FILE -DestinationPath $DESTINATION_DIR
} elseif ($command_line_param -ne $USE_EXISTING_PARAM) {
     $cloneCmd="git clone $REPO_URL $DESTINATION_DIR"

     Invoke-Expression $cloneCmd
}

Set-Location $DESTINATION_DIR

Copy-Item -Path $COMPOSE_SCRIPT -Destination $DESTINATION_DIR

Copy-Item -Path $ENV_FILE -Destination $DESTINATION_DIR

#Copy-Item -Path $CONFIG_FILE -Destination $DESTINATION_DIR\config

Copy-Item -Path $DB_FILE -Destination $DESTINATION_DIR

Copy-Item -Path Docker\Dockerfile -Destination .

# Run docker build command
$buildCmd="docker build . -t watchlist"
Invoke-Expression $buildCmd

ForEach ($current_cmd in $DOCKER_COMMANDS) {
     Invoke-Expression $current_cmd
}

if ($command_line_param -ne $USE_EXISTING_PARAM) {
     Remove-Item $DESTINATION_DIR
}