# WatchList
WatchList application is a multi-user app that lets you track the movies and TV that you watch, how many times you watched them and when you watched them. You can also rate movies or shows.

Requirements: npm, WatchList-Backend service (See my other repo)

This app has the ability to search IMDB for a movie or TV show within the API if you provide a RapidAPI IMDB key on the backend service. See the README on my WatchList-Backend repo for details.

This app can be built as a web app, an Android app or an iOS app.

# Sections
The application has 5 different sections:

WatchList: These are the records where you track each time you watch a movie, tv show or special
WatchListItems: These are the records that contain the movie, TV show or special which you only add once and then add a record that references the WatchListItem
WatchListQueue: These are records of a movie, tv show or special that you want to watch
IMDB Search: If enabled, (see below) the IMDB search tab
WatchList Stats: Stats of the movies and shows that you have watched over time

## Build web application
Run these commands to build the web application

1. npm install
1. ionic build
1. Move contents of build to web server

## Logging in
Log into the web application using the username, password and backend URL created on WatchList-Backend.

## Build for Android or iOS
1. Build web app following instructions above
1. ionic cap add android (optional: if you want to build for ios instead, use ios)
1. ionic cap sync android (optional: if you want to build for ios instead, use ios)
1. ionic cap open android (optional: if you want to build for ios instead, use ios)
1. Open Android project in Android Studio for Android or XCode for iOS  (optional)

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