# WatchList
WatchList is a multi-user app that lets you track the movies and TV shows that you watch.

You can use this app to track how many times you watched something, where you watched it and when you watched it. You can also rate movies or shows and get recommendations based on the movie or show you are looking at.

After adding information for a while, WatchList will generate statistics to show you trends for favorite movies and tv shows and more.

It is possible to add a WatchList record by searching IMDB if you provide an API key. More info is available in INSTALL.md.

Watchlist uses caching so movie or TV shows images are saved locally and will not be downloaded again, unless you clear your browser cache.

WatchList uses a JSON database to store your logged movie and TV shows.

WatchList can be run as a web app. If you use Google Chrome or Edge, you can also install WatchList as a desktop application by installing it as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA) where it runs on a desktop or mobile device and looks like a native desktop application. See INSTALL.MD for details.

Docker is also supported. See INSTALL.MD for details.

# Demo Mode
You can test out WatchList in demo mode without any setup. Adding and saving is currently disabled in demo mode.

1. Check out the code and go to the root directory of the project in a command prompt
1. Run the following commands:
1. `npm install`
1. `npm run build`
1. `npm run start`
1. Visit `http://localhost:3000` in your browser and log in with demo as the username and password.

# Installation
Installation instructions and more detailed information can be found in INSTALL.md

# Screenshots
### Main WatchList
![WatchList](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Watchlist.png?raw=true)

### View a WatchList record
![View a WatchList](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-ViewItem.png?raw=true)

### Edit a WatchList record
![WatchList Edit](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-EditItem.png?raw=true)

### Add a WatchList record
![WatchList Add](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-AddItem.png?raw=true)

### WatchList Stats Summary
![WatchList Stats Summary](https://github.com/SegiH/WatchList/blob/main/screenshots/StatsSummary.png?raw=true)

### WatchList Stats Total Movies Watched
![WatchList Stats Total Movies Watched](https://github.com/SegiH/WatchList/blob/main/screenshots/TotalMoviesWatchedChart.png?raw=true)

### WatchList Stats Total TV Shows Watched
![WatchList Stats Total TV Shows Watched](https://github.com/SegiH/WatchList/blob/main/screenshots/TotalTVShowsWatchedChart.png?raw=true)

### WatchList Stats Total TV Seasons Watched
![WatchList Stats Total TV Seasons Watched](https://github.com/SegiH/WatchList/blob/main/screenshots/TVSeasonsWatchedChart.png?raw=true)

### Search
![Search](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Search.png?raw=true)

### Settings
![Settings - WatchList](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Settings-WatchList.png?raw=true)

### Admin Console - Manage Users
![Admin - Manage Users](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Admin-ManageUsers.png?raw=true)

### Admin Console - Manage Sources
![Admin - Manage Sources](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Admin-ManageSources.png?raw=true)

### Admin Console - Manage Types
![Admin - Manage Types](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Admin-ManageTypes.png?raw=true)