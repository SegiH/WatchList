WatchList can be set up to run as a web application with or without Docker.

It has 2 parts to it: The web application and a backend service that needs to be installed separately from the web application which interacts with the database.

# Setup

## Quick Setup

If you want to start using WatchList as quickly as possible, you can use the release builds from [Github](https://github.com/SegiH/WatchList) which will use SQLite as the database.

1. Download the WatchList-Web.zip version and install it on your web server (Apache and Nginx tested) or download one of the Electron based builds for your operating system (Windows, Mac and Linux supported).
1. Download the WatchList-Backend.zip.
1. Follow the instructions below under the heading "Setup WatchList Backend (Complete this step if you are NOT using Docker)".
1. Run the backend service with Node on your server. It should be running on port 8080.
1. Follow the instructions below under the heading "Logging in for the first time".


# RapidAPI
WatchList has the ability to let you to search for a movie or tv show on IMDB.com. To do this, you need to create a free RAPIDAPI Key. 

Note: RapidAPI allows you 100 free searches per month. In order for this API to work, you have to "subscribe" by adding your credit card with RapidAPI. It appears to work similarly to Amazon where they won't charge you if you do not go over your allotted API usage. If you do not add a credit card, the API will return an "Unsubscribed" error when you try to use it. I have never been charged for my usage. Once you have used 100 searches, you will receive an error that you have exceeded your daily usage.

a. Visit [RapidAPI](rapidapi.com) and create a free account.
     b. Click on "My APIs" at the top right
     c. Click on "Add New API" at the top right
     d. Name your API, give it a description and select a category. For "Specify Using" make sure UI is selected
     e. Click on "Add API" button to save it
     f. On the next page, enter a short description and click on Save
     g. Click on the down arrow next to your application name and select Security underneath the sub menu
     h. Click on the eye icon to show your API key and copy it to the clipboard.
     i. Add a variable in the compose file RAPIDAPIKEY=APIKEY

If you do not want to create a RapidAPI account, you don't have to but when you want to add a movie or TV show, you will have to manually enter the name, IMDB link, link to the poster image and type.


## Setting up WatchList database for SQL Server (Optional: Skip this step if you want to use the default SQLite3 database)
1. Create database with the name WatchList in SQL Server.
1. Edit setup\SQL\Setup.sql and set the master key encryption password (write down this password in case you forget it!!)
1. Run the SQL script SQL\Setup.sql on the database WatchList as a user with db_creator permission. All of the commands should complete without any errors.
1. Create user account: Edit setup\SQL\CreateUser.sql and set the username, realname and password 
1. Run the SQL script setup\SQL\CreateUser.sql
1. If you ever want to change a users' password, use the SQL at setup\SQL\SetPassword.sql

## Set up WatchList Backend for Docker (Optional: Skip this step if you are not using Docker).
1. Go to the API directory
1. Edit config\default.json and fill in the following values:
   - If you plan on using SQL Server as the database, fill in the "SQLServer" section or leave it blank otherwise
   - CORS: **THIS IS VERY IMPORTANT. YOU WILL NOT BE ABLE TO LOG IN IF THIS IS NOT SET CORRECTLY** Enter the address where you will host the WatchList Web app like this: `["http://localhost:8080","https://watchlist.mysite.com"]` where you add each URL with double quotes around it and separated by a comma.
   - Port: If you want to run the backend on a different port, change the default port here.
   - Secret: Enter a random string of letters and numbers. This can be any random string.
   - RapidAPIKey: Your RapidAPIKey if you have one. Leave blank otherwise
1. Copy `watchlistbackend.js` to `docker files\docker`
1. Copy `config` folder to `docker file\docker`
1. Build the backend image: `docker build docker/ -t watchlistbackend:latest`
1. Edit `watchlistbackend-compose.yml`
   - Replace NETWORKNAME with your own Docker network name
   - If you use a reverse proxy:
   - Make sure to allow GET, OPTIONS and PUT
   - Allow CORS header for the following URLS: http://localhost, http://localhost:8080 and the public URL that this WatchList backend service will be accessible at.
1. Build the backend container `docker-compose -f watchlistbackend-compose.yml up -d`
1. Check the status of your Docker container `docker logs WatchList`. It should say `Running on http://0.0.0.0:8080`

## Setup WatchList Backend (Complete this step if you are NOT using Docker)
1. cd to the API directory
1. Edit config\default.json and set the following values:
   - If you plan on using SQL Server as the database, fill in the "SQLServer" section or leave it blank otherwise.
   - If you want to use the default SQLite database, fill in the username, password and database name in the "SQLite" section.
   - CORS: **THIS IS VERY IMPORTANT. YOU WILL NOT BE ABLE TO LOG IN IF THIS IS NOT SET CORRECTLY** Enter the address where you will host the WatchList Web app like this: `["http://localhost:8080","https://watchlist.mysite.com"]` where you add each URL with double quotes around it and separated by a comma.
   - Port: If you want to run the backend on a different port, change the default port here.
   - Secret: Enter a random string of letters and numbers. This can be any random string.
   - RapidAPIKey: Your RapidAPIKey if you have one. Leave blank otherwise
1. Run `npm install`
1. Run `node watchlistbackend.js`
1. You should see the message `Running on http://YOURIP:8080`

## Build WatchList Web app
1. cd to the Web directory
1. Run `npm install`
1. Run `npm run build`
1. cd dist
1. You should have the following files/folders in the dist folder. If any of these files/folders are missing copy them from Web/public
   - assets
   - bundle.js
   - favicon.ico
   - index.html
   - maskable.png
   - manifest.json
   - service-worker.js
   
1. Open index.html. If you see `<script src="/dist/bundle.js">`, change it to `<script src="./bundle.js">`.
1. Copy the contents of the dist to your web server

## Build WatchList Desktop app using Electron
1. Open a command prompt and go to the Web directory
1. Build the web app using the instructions above.
1. Build the Desktop app for your OS:
   - Windows: Open a command prompt and run `build-desktop-app.bat`.
   - Linux: Open Terminal and run `build-desktop-app-linux.sh`.
   - Mac: Open Terminal and run `build-desktop-app-mac.sh`.
1. When you run the app, you should see the WatchList login screen. If you see a blank screen, there is an easy way to fix this by editing index.html:
   - Windows
      1. Open to the folder where the WatchList app is located. You should see watchlist.exe
      1. Index.html is located at resources\app\index.html
   - Linux
      1. Open Terminal and go to the directory where the WatchList app is located.  You should see watchlist.
      1. Index.html is located at resources/app/index.html
   - Mac:
      1. Open Terminal and go to the directory where the WatchList app is located. You should see watchlist.app.
      1. Index.html is located at watchlist.app/Contents/Resources/app/index.html
1. Make sure that the line that loads `bundle.js` reads `<script src="./bundle.js">` not `<script src="/dist/bundle.js">` .
1. Re-run watchlist after saving index.html

## Logging in for the first time
1. Open a browser and enter the URL `http://YOURIP:8080/Setup` to create an admin account
1. Enter the following fields:
   - Backend URL: The URL of the backend service
   - Name: Name of the new admin
   - Username: New user name
   - Password: Password that is complex. The password requirements are:1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum.
1. Create the new account. You should see a message that the account creation was successfull. You should now be redirected back to the Login page. If not go to `http://YOURIP:8080/Login`.
1. Login using the credentials that you created above.