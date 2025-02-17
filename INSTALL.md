WatchList can be run as a regular web application, a Progressive Web Application (PWA) or in a Docker container.

Requirements: Node 18.19.1 or higher

# Installation
1. Download the latest release from the releases and extract the zip
1. Edit .env and set SECRET. It needs to be a long, secure password that will be used to encrypt your database. If you lose this secret, there is no way to recover it and you will not be able to use your WatchList database.
1. Optional: See "Searching IMDB" to enable searching IMDB or "Recommendations" to get movie & TV show recommendations.
1. Optional: Edit WatchListSources and WatchListTypes as needed if you want to remove any existing sources and types.
1. Run `node server.js` to start the server.
1. See "Setup up admin user account" below.

# Build from source
1. Check out the source from Github and go to the root directory of the project.
1. Edit .env and set SECRET. It needs to be a long, secure password that will be used to encrypt your database. If you lose this secret, there is no way to recover it and you will not be able to use your WatchList database.
1. Optional: See "Searching IMDB" to enable searching IMDB or "Recommendations" to get movie & TV show recommendations.
1. Optional: Edit WatchListSources and WatchListTypes as needed if you want to remove any existing sources and types.
1. Run `npm install`
1. Run `npm run build`
1. If you use Windows run `npm run deploy-windows`, otherwise run `npm run deploy-unix`
1. Go to the standalone directory `cd .next/standalone`
1. Run `node server.js`
1. See "Setup up admin user account" below.

# Docker
1. Edit database.json and look for "SetupComplete" and make sure it is set to true. If not, see "Setup up admin user account" below.
1. If you downloaded WatchList from the releases section of GitHub, download [Docker/Dockerfile](https://github.com/SegiH/WatchList/blob/main/Docker/Dockerfile) from the [WatchList repo](https://github.com/SegiH/WatchList).
1. Build the Docker image using the Dockerfile: `docker buildx build . -t watchlist`
1. If you downloaded WatchList from the releases section of GitHub, download [docker-compose.yml](https://github.com/SegiH/WatchList/blob/main/Docker/docker-compose.yml) from the [WatchList repo](https://github.com/SegiH/WatchList).
1. Edit docker-compose.yml and update the volume path to database.json as needed and your network name to match your Docker network. You can create a docker network if you haven't done so already with the command `docker network create YourNetworkName`.
1. Build the Docker container: `docker-compose up -d`.

# Setup up admin user account
1. Visit [http://localhost:3000](http://localhost:3000) in your browser. You should see the Setup page to set up a new account. This account will automatically be created as a WatchList admin account.
1. Enter the following fields:
   - Name: Name for the new admin account
   - Username: New user name
   - Password: Password that is complex. The password requirements are: 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum.
1. Once you click on "Create the new account", you should see a message that says that the account creation was successfull. You should now be redirected back to the Login page at /Login.
1. Login using the credentials that you created above.
1. After completing this setup up, you should have a file name database.json. This is your WatchList database. Make sure to back up this file from time to time.

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
1. Edit .env and set RAPIDAPIKEY with this API key.

## Recommendations
You can get recommendations from a movie or TV show. This requires an api key from themoviedb.com which is completely free and does not require you to add a credit card.

1. Visit [TheMovieDB](https://www.themoviedb.org) and create a free account.
1. Click on the avatar icon at the top right and go to settings
1. Click on API
1. Copy the "API Read Access Token"
1. Edit .env and set RECOMMENDATIONSAPIKEY with this API key.

## Progressive Web Application (PWA).
WatchList can be used as a desktop application by installing it as a PWA.

Google Chrome: Click on the icon that looks like a monitor with a down arrow in it in the right side of the address bar.
Microsoft Edge: Click on the L shape with a plus in it in the right side of the address bar.
Mozilla Firefox: Firefox does not support PWAs and you will need to use one of the 2 browsers above to install WatchList as a PWA.

## Resetting Admin password
If you cannot log into WatchList with the admin account, you can reset the password for the admin account directly in the database.
1. Edit database.json
1. Go to the Users section
1. Expand the first user account with UserID 1
1. Change the password to "U2FsdGVkX18kOsqQBr1pTD01Xl7T+aPG7EQCl14pzLc="
1. Log into WatchList with the password "watchlist" without quotes.
1. Go to the admin section and change your password.

## Known Issues:

If you search for a movie or show that is pretty new, you may not be able to find it when searching and will have to add a WatchList Item manually. This happens because RapidAPI does not have new movies or shows in their database right away.