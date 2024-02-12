# WatchList
WatchList is a multi-user app that lets you track the movies and TV that you watch.

You can track how many times you watched something, where you watched it and when you watched it. You can also rate movies or shows and get recommendations based on the movie or show you are looking at.

WatchList can be run as a web app. You can also run WatchList as a desktop application (Windows, Mac and Linux). Running WatchList as a desktop app is not currently working but will be fixed in a future release. 

It is possible to search IMDB for a movie or TV show.

WatchList uses a SQLite3 database format by default. It can also be configured to connect to Microsoft SQL Server instead of SQLite3.

If you use Google Chrome, Watchlist can be run as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA) where it runs on a desktop or mobile device and looks like a native application. See INSTALL.MD for details.

# Demo Mode
You can test out WatchList in demo mode without any setup. Adding and saving is currently disabled in demo mode.

1. Check out the code and go to the root directory of the project in a command prompt
1. Rename `watchlistdb.sqlite.demo` to `watchlistdb.sqlite`
1. `npm install`
1. `npm run build`
1. `npm run start`
1. Visit `http://localhost:3000` in your browser and log in with demo as the username and password.

# Installation
Installation instructions have been moved to INSTALL.md

# WatchList sections
The application has 5 different sections:

WatchList: These are the records where you add a record any time you watch something.

WatchListItems: These are the records that contain the movie, TV show or special which you only add once and then add a record in WatchList where you select the WatchListItem

IMDB Search: Search IMDB and add the result in WatchList

WatchList Stats: Stats of the movies and shows that you have watched over time

Admin: If you are an administrator, you will have access to the admin section where you can manage users, add sources and add types.;


# Screenshots

![WatchList List](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList-Main.jpg?raw=true)

![WatchList Main](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList-ViewItem.jpg?raw=true)

![WatchList Edit](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-EditItem.jpg?raw=true)

![WatchList Add](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList-Add-Item.jpg?raw=true)

![WatchList List](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-Main.jpg?raw=true)

![WatchList Main](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-ViewItem.jpg?raw=true)

![WatchList Edit](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-EditItem.jpg?raw=true)

![WatchList Add](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-Add.jpg?raw=true)

![IMDB Search](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/IMDBSearch.jpg?raw=true)

![WatchList Stats - Most Watched Sources](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Stats-MostWatchSources.jpg?raw=true)

![WatchList Stats - Top Rated](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Stats-TopRated.jpg?raw=true)

![WatchList Stats - Top 10 Movies](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Stats-Top10Movies.jpg?raw=true)

![WatchList Stats - Top 10 TV Shows](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Stats-Top10Shows.jpg?raw=true)

![Admin - Manage Users](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageUsers.jpg?raw=true)

![Admin - Manage Sources](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageSources.jpg?raw=true)

![Admin - Manage Types](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageTypes.jpg?raw=true)

![Settings - WatchList](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Settings-WatchList.jpg?raw=true)

![Settings - WatchList Items](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Settings-WatchListItems.jpg?raw=true)