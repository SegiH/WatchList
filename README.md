# WatchList
WatchList is a multi-user app that lets you track the movies and TV that you watch.

You can track how many times you watched something, where you watched it and when you watched it. You can also rate movies or shows and get recommendations based on the movie or show you are looking at.

It is possible to search IMDB for a movie or TV show.

WatchList uses a SQLite3 database to store your logged movie and TV shows.

WatchList can be run as a web app. If you use Google Chrome or Edge, you can also install WatchList as a desktop application by installing it as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA) where it runs on a desktop or mobile device and looks like a native desktop application. See INSTALL.MD for details.

Docker is also supported. See INSTALL.MD for details.

# WatchList explanation

WatchList - WatchList is used to refer to the log that you add to record a movie or TV show that you have watched. You would usually add the date you started watching it, when you finished watching it, where you watched it and your rating of the movie/show.

WatchList Item - The record of the movie or TV show. You would only add a WatchListItem once to add a specific movie/tv show or special. The WatchListItem includes information like the name of the movie/show, type (movie/TV show/special), link to IMDB and image from IMDB. By default WatchList Items are hidden and you only see WatchList which shows what you have watched. You can show WatchList items by clicking on the Settings gear and enabling "Show WLI"

# Tips
There are different options available in WatchList. Some of options are only available in certain tabs.

These options are available at the bar at the top of WatchList:

Still Watching - When you add a WatchList, if you do not enter an end date, WatchList will consider that record to be "still watching" whih means that you are still watching that movie/show. When "Still Watching" is enabled, you will only see movies or shows that do not have an end date. Turn this off to see everything that you have already watched. This is available in the WatchList tab

Source - You can filter WatchList by the source where you watched the movie or show at (lke Netflix, Amazon etc) by clicking on the Settings and selecting from the Source dropdown.

Type - You can also filter by Type by clicking on the Settings and selecting from the Type dropdown.

Sort By - Sort WatchList or WatchList items

Sort Order - Sort direction which is ascending or descending


These options are available in Settings:

Dark Mode - Toggle dark or light mode. This is on by default.

Show WLI - When you add a movie or show, it will be added as a WatchList Item record. The WatchList Item is hidden by default but can be show by enabling this toggle.

Archived - If you add a WatchList record and decide not to continue watching the movie or TV show, you can archive that WatchList record. The WatchList record will not be visible any more in WatchList. If you want to find it again, enable the "Archived" toggle.

Auto Add - After you add a WatchListItem, if you want to immediately add a WatchList record to record when you watched a movie or show, enable this feature. If it is off, you will need to click on the plus sign in WatchList to add a new record.

Missing Images (Only available in Items) - If you add a WatchList Item record for a movie or TV show and the image does not display, enable "Show WLI", click on Items, then enable "Missing Images" to see WatchListItems with missing images.

# Demo Mode
You can test out WatchList in demo mode without any setup. Adding and saving is currently disabled in demo mode.

1. Check out the code and go to the root directory of the project in a command prompt
1. Rename `watchlistdb.sqlite.demo` to `watchlistdb.sqlite`
1. `npm install`
1. `npm run build`
1. `npm run start`
1. Visit `http://localhost:3000` in your browser and log in with demo as the username and password.

# Installation
Installation instructions can be found in INSTALL.md

# WatchList sections
The application has 5 different sections:

WatchList: These are the records where you add a record any time you watch something.

WatchListItems: These are the records that contain the movie, TV show or special which you only add once and then add a record in WatchList where you select the WatchListItem

IMDB Search: Search IMDB and add the result in WatchList

WatchList Stats: Stats of the movies and shows that you have watched over time

Admin: If you are an administrator, you will have access to the admin section where you can manage users, add sources and add types.;


# Screenshots
### Main WatchList
![WatchList](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/Watchlist.png?raw=true)

### View a WatchList record
![View a WatchList](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-ViewItem.png?raw=true)

### Edit a WatchList record
![WatchList Edit](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-EditItem.png?raw=true)

### Add a WatchList record
![WatchList Add](https://github.com/SegiH/WatchList-NextJS/blob/main/screenshots/WatchList-AddItem.png?raw=true)

### WatchList Stats Video
![WatchList Stats Video](https://github.com/SegiH/WatchList/blob/main/screenshots/WatchListStats.mp4?raw=true)

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