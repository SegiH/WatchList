# WatchList
WatchList application is a multi-user app that lets you track the movies and TV that you watch, how many times you watched them and when you watched them. You can also rate movies or shows.

Requirements: npm, SQL Server database

This app has the ability to search IMDB for a movie or TV show within the API if you provide a RapidAPI IMDB key on the backend service. See the README on my WatchList-Backend repo for details.

This app can be built as a web app, an Android app or an iOS app.

# Sections
The application has 5 different sections:

WatchList: These are the records where you track each time you watch a movie, tv show or special
WatchListItems: These are the records that contain the movie, TV show or special which you only add once and then add a record that references the WatchListItem
WatchListQueue: These are records of a movie, tv show or special that you want to watch
IMDB Search: If enabled, (see below) the IMDB search tab
WatchList Stats: Stats of the movies and shows that you have watched over time

# Setting up WatchList
1. Create database with the name WatchList in SQL Server.
1. Edit SQL\Setup.sql and set the master key encryption password (write down this password in case you forget it!!)
1. Run the SQL script SQL\Setup.sql on the database WatchList as a user with db_creator permission. All of the commands should completed without any errors.
1. Create user account: Edit SQL\CreateUser.sql and set the username, realname and password 
1. Run the SQL script SQL\CreateUser.sql
1. If you ever want to change a users' password, use SQL\SetPassword.sql
1. Set the following encironment variables:
   a. Public_URL - The URL that you will use to access WatchList ex. https://watchlist.mysite.com
   b. WatchList_User - Database username
   c. WatchList_Password - Database password
   d. WatchList_Host - Database host name
   e. WatchList_DB - Database name
   f. Secret - Secret random letters and string, up to 15 characters. 
   g. RAPIDAPI_KEY - (Optional) If you want to be able to search IMDB, you need a RapidAPI key (see below);
1. Run `npm deploy` to build and deploy WatchList to a folder called WatchList-Buils
1. cd WatchList-Build
1. `node watchlist.js`
1. Open http://localhost in your browser and log into WatchList

## Build for Android or iOS
1. Run `npm build` to build and deploy WatchList
1. ionic cap add android (optional: if you want to build for ios instead, use ios)
1. ionic cap sync android (optional: if you want to build for ios instead, use ios)
1. ionic cap open android (optional: if you want to build for ios instead, use ios)
1. Open Android project in Android Studio for Android or XCode for iOS  (optional)

# RapidAPI
WatchList will allow you to search for a movie or tv show on IMDB.com. To do this, you need to create a free RAPIDAPI Key. 

Note: apidAPI allows you 100 free searches per month. In order for this API to work, you have to "subscribe" by adding your credit card with RapidAPI. It appears to work similarly to Amazon where they won't charge you if you do not go over your allotted API usage. If you do not add a credit card, the API will return an "Unsubscribed" error when you try to use it. I have never been charged for my usage. Once you have used 100 searches, I receive an error that I have exceeded my daily usage.

a. Visit [RapidAPI](rapidapi.com) and create a free account.
     b. Click on "My APIs" at the top right
     c. Click on "Add New API" at the top right
     d. Name your API, give it a description and select a category. For "Specify Using" make sure UI is selected
     e. Click on "Add API" button to save it
     f. On the next page, enter a short description and click on Save
     g. Click on the down arrow next to your application name and select Security underneath the sub menu
     h. Click on the eye icon to show your API key and copy it to the clipboard.
     i. Add a variable in the compose file RAPIDAPIKEY=APIKEY

## Screenshots

Watchlist Login
![Watchlist Login](https://github.com/SegiH/WatchList/blob/main/screenshots/login.png?raw=true)

Watchlist (movies and shows you have watched)
![Watchlist](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist.png?raw=true)

Watchlist Items (list of movies and TV shows)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-items.png?raw=true)

Watchlist Queue (Movies or TV shows that you want to watch later)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-queue.png?raw=true)

IMDB Search
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/imdb-search.png?raw=true)

WatchList Stats
![Watchlist Stats](https://github.com/SegiH/WatchList/blob/main/screenshots/watchliststats.png?raw=true)