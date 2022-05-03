# WatchList
WatchList application that lets you track movies and TV

Requirements: WatchList-Backend service (See my other repo)

This app has the ability to search IMDB for a movie or TV show within the API if you provide a RapidAPI IMDB key on the backend service. See the README on my WatchList-Backend repo for details.

1. npm install
1. ionic build
1. Move contents of build to web server
1. ionic cap add ios (optional if you want to build for ios)
1. ionic cap sync
1. Open Android project in Android Studio or iOS project in XCode

KNOWN ISSUES:

After updating the web app, the browser cache may need to be cleared before the app reloads properly without using the cached copy.