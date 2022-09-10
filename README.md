# WatchList
WatchList application that lets you track movies and TV

Requirements: WatchList-Backend service (See my other repo)

This app has the ability to search IMDB for a movie or TV show within the API if you provide a RapidAPI IMDB key on the backend service. See the README on my WatchList-Backend repo for details.

This app can be built as a web app or an Android or iOS app.

1. npm install
1. ionic build
1. Move contents of build to web server
1. ionic cap add android (optional: if you want to build for ios instead, use ios)
1. ionic cap sync
1. ionic cap open android (optional: if you want to build for ios instead, use ios)
1. Open Android project in Android Studio for Android or XCode for iOS

## Screenshots

Watchlist (movies and shows you have watched)
![Watchlist](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist.png?raw=true)

Watchlist Items (list of movies and TV shows)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-items.png?raw=true)

Watchlist Queue (Movies or TV shows that you want to watch later)
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/watchlist-queue.png?raw=true)

IMDB Search
![Watchlist Items](https://github.com/SegiH/WatchList/blob/main/screenshots/imdb-search.png?raw=true)