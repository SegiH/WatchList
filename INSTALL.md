WatchList can be set up to run as a regular web application or a Progressive Web Application (PWA). It can be run with or without Docker.

## Set up WatchList
1. Check out the source and go to the root directory of the project.
1. Edit config\default.json and fill in the following values:
   - If you plan on using SQLite database, fill in the "SQLite" section. Create a username and password and use "WatchList" as the database name.
   - If you plan on using SQL Server as the database, fill in the "SQLServer" section
   - Secret: Create a long and secure password to encrypt your database
1. Run `npm install`
1. Run `npm run build`
1. Run `npm run start`
1. Visit http://localhost:3000 in your browser. You should see the page to set up a new account.
1. Enter the following fields:
   - Name: Name of the new admin
   - Username: New user name
   - Password: Password that is complex. The password requirements are:1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum.
1. Create the new account. You should see a message that the account creation was successfull. You should now be redirected back to the Login page. If not go to `http://YOURIP:8080/Login`.
1. Login using the credentials that you created above.

# Docker setup
1. Follow the instructions above but stop after running `npm run build`.
1. Build the Docker image: `docker buildx build . -t watchlist`.
1. Edit docker-compose.yml and update the network name to match your Docker network. You can create a docker network if you haven't done so already with the command `docker network create YourNetworkName`.
1. Build the Docker container: `docker-compose up -d`.

## PWA Files
1. If you want use WatchList as a PWA, make sure you should have the following files/folders in the build folder. If any of these files or folders are missing copy them from the public folder:
   - assets
   - favicon.ico
   - manifest.json
   - maskable.png
   - service-worker.js
1. After update WatchList, clear the browser cache in Google Chrome.

## Build WatchList Desktop app using Electron
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

## Resetting SQLite password for the admin account
If you cannot log into WatchList, you can reset the password directly in the database for the admin account that was created when you first set up WatchList.
1. Install ![SQLite](https://www.sqlite.org/) for your operating system
1. Go to the directory where the watchlist database file is located
1. `sqlite3 watchlistdb.sqlite`
1. Run `UPDATE Users SET Password='U2FsdGVkX18kOsqQBr1pTD01Xl7T+aPG7EQCl14pzLc=' WHERE UserID=1;`
1. Log into WatchList with the password "watchlist" without quotes.
1. Go to the admin section and change your password