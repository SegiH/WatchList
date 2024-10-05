WatchList can be set up to run as a regular web application or a Progressive Web Application (PWA). It can also be run as a Docker container.

Requirements: Node 20.7.0+

## Setup WatchList as a web app
1. Check out the source from Github and go to the root directory of the project.
1. If you are setting up WatchList for the first time, make sure you do not already have a file in the root of your project named watchlistdb.sqlite. If it does exist, delete or rename it.
1. Edit config\default.json and fill in the following values:
   - Secret: Create a long and secure password that will be used to encrypt your database. If you lose this password, you may not be able to use your WatchList database.
1. Run `npm install`
1. Run `npm run build`
1. Run `npm run start`
1. Visit http://localhost:3000 in your browser. You should see the Setup page to set up a new account. This account will automatically be a WatchList admin account.
1. Enter the following fields:
   - Name: Name of the new admin
   - Username: New user name
   - Password: Password that is complex. The password requirements are: 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum.
1. Once you click on "Create the new account", you should see a message that says that the account creation was successfull. You should now be redirected back to the Login page at /Login.
1. Login using the credentials that you created above.

## Searching IMDB
WatchList will allow you to search for a movie or tv show on IMDB.com. To do this, you need to create a free RAPIDAPI Key. 

Note: RapidAPI allows you 1000 free searches per month. In order for this API to work, you have to "subscribe" by adding your credit card with RapidAPI. It appears to work similarly to Amazon where they won't charge you if you do not go over your allotted API usage. If you do not add a credit card, the API will return an "Unsubscribed" error when you try to use it. I have never been charged for my usage. Once you have used 1000 searches, you will receive an error that you have exceeded your daily usage.

1. Visit [RapidAPI](https://rapidapi.com) and create a free account.
1. Click on "My APIs" at the top right
1. Click on "Add New API" at the top right
1. Name your API, give it a description and select a category. For "Specify Using" make sure UI is selected
1. Click on "Add API" button to save it
1. On the next page, enter a short description and click on Save
1. Click on the down arrow next to your application name and select Security underneath the sub menu
1. Click on the eye icon to show your API key and copy it to the clipboard.
1. Paste the API key into the config\default.json file for "RapidAPIKey".

## Recommendations
You can get recommendations from a movie or TV show. This requires an api key from themoviedb.com which is completely free and does not require you to add a credit card.

1. Visit [TheMovieDB](https://www.themoviedb.org) and create a free account.
1. Click on the avatar icon at the top right and go to settings
1. Click on API
1. Copy the "API Read Access Token"
1. Paste the API key into the config\default.json file for "RecommendationsAPIKey".

## First time Docker setup
1. Follow the instructions above but do not log in at the last step`.
1. If you ran the command `npm run start` above and it is still running, stop npm.
1. Make sure that you have a file named watchlistdb.sqlite in the root of your project. If you don't, you did not complete the setup properly.
1. Follow the Manual Docker Build instructions when setting up WatchList for the first time.

## Automated Docker Build
Once WatchList has been set up in Docker fir the first time, you can easily upgrade it using a bash script for Linux/Mac or a PowerShell script for Windows that can automatically build and deploy WatchList as a Docker container.

You will need to have 3 files stored somewhere on your host where the script can access these files and complete this preparation once.

COMPOSE_SCRIPT - The path to the file docker-compose.yml (See the example in the Docker folder).
CONFIG_FILE - A copy of the file default.json that you edited above when setting up WatchList.
DB_FILE - A copy of the file watchlistdb.sqlite which should have been created automatically when setting up WatchList for the first time.

Linux: Edit `deployWatchList.sh` and make sure that the variables are configured and point to their respective files: COMPOSE_SCRIPT, CONFIG_FILE and DB_FILE point to their respective files.

Windows: Edit `deployWatchList.ps1` and make sure that the variables are configured and point to their respective files: $COMPOSE_SCRIPT, $CONFIG_FILE and $DB_FILE point to their respective files.

Once this is done, run `./deployWatchList.sh` in Linux or `powershell -file deployWatchList.ps1` in Windows

## Manual Docker Build 
1. Build the Docker image: `docker buildx build . -t watchlist`.
1. Edit docker-compose.yml and update the volume path to watchlistdb.sqlite as needed and your network name to match your Docker network. You can create a docker network if you haven't done so already with the command `docker network create YourNetworkName`.
1. Build the Docker container: `docker-compose up -d`.

## Progressive Web Application (PWA).
WatchList can be used as a desktop application by installing it as a PWA.

Google Chrome: Click on the icon that looks like a monitor with a down arrow in it in the right side of the address bar.
Microsoft Edge: Click on the L shape with a plus in it in the right side of the address bar.
Mozilla Firefox: Firefox does not support PWAs and you will need to use one of the 2 browsers above to install WatchList as a PWA.

## Resetting SQLite password for the admin account
If you cannot log into WatchList with the admin account, you can reset the password for the admin account directly in the database.
1. Install ![SQLite](https://www.sqlite.org/) for your operating system.
1. Go to your WatchList directory and located the watchlist database file watchlistdb.sqlite is located.
1. Run the command `sqlite3 watchlistdb.sqlite` to open the database.
1. Run `UPDATE Users SET Password='U2FsdGVkX18kOsqQBr1pTD01Xl7T+aPG7EQCl14pzLc=' WHERE UserID=1;` to reset the admin password.
1. Log into WatchList with the password "watchlist" without quotes.
1. Go to the admin section and change your password.

## Known Issues:

If you search for a movie or show that is pretty new, you may not be able to find it when searching and have to add a WatchList Item manually.