# WatchList
WatchList application is a multi-user app that lets you track movies and TV

Requirements: npm, WatchList-Backend service (See my other repo)

This app has the ability to search IMDB for a movie or TV show within the API if you provide a RapidAPI IMDB key on the backend service. See the README on my WatchList-Backend repo for details.

This app can be built as a web app or an Android or iOS app.

## Build web application
Run these commands the build the web application

1. npm install
1. ionic build
1. Move contents of build to web server

## Logging in
Log into the web application using the username, password and backend URL created on WatchList-Backend.

## Test the web app
If you want to try out the app, run these commands:
1. npm install
1. ionic serve
1. Open http://localhost:8100 in your browser if it doesn't open automatically. Google Chrome/Edge will not work when accessing a site over http if the backend URL address uses https. Use  This only applies when testing the web app.

## Build for Android or iOS
1. Build web app following instructions above
1. ionic cap add android (optional: if you want to build for ios instead, use ios)
1. ionic cap sync android (optional: if you want to build for ios instead, use ios)
1. ionic cap open android (optional: if you want to build for ios instead, use ios)
1. Open Android project in Android Studio for Android or XCode for iOS  (optional)

## Screenshots

Watchlist (movies and shows you have watched)
![Watchlist](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist.png?raw=true)

Watchlist Items (list of movies and TV shows)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-items.png?raw=true)

Watchlist Queue (Movies or TV shows that you want to watch later)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-queue.png?raw=true)

IMDB Search
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/imdb-search.png?raw=true)
