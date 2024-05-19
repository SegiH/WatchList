# WatchList
WatchList is a multi-user app that lets you track the movies and TV that you watch.

You can track how many times you watched something, where you watched it and when you watched it. You can also rate movies or shows and get recommendations based on the movie or show you are looking at.

WatchList can be run as a web app. You can also run WatchList as a desktop application (Windows, Mac and Linux). Running WatchList as a desktop app is not currently working but will be fixed in a future release. 

It is possible to search IMDB for a movie or TV show.

WatchList uses a SQLite3 database to store your logged movie and TV shows.

If you use Google Chrome, Watchlist can be run as a [Progressive Web Application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA) where it runs on a desktop or mobile device and looks like a native application. See INSTALL.MD for details.

# WatchList explanation

WatchList - WatchList is used to refer to the log that you add to record a movie or TV show that you have watched. You would usually add the date you started watching it, when you finished watching it, where you watched it and your rating of the movie/show.

WatchList Item - The record of the movie or TV show. You would only add a WatchListItem once to add a movie/tv show or special. The WatchListItem includes information like the name of the movie/show, type (movie/TV show/special), link to IMDB and image from IMDB. By default WatchList Items are hidden and you only see WatchList which shows what you have watched. You can show WatchList items by clicking on the Settings gear and enabling "Show WLI"

# Tips
When you add a WatchList, if you do not enter an end date, WatchList will consider that record to be "still watching". Yoou can hide or show what you are still watching by clicking on the Settings Gear and turn on "Still Watching".

If you add a WatchList record and decide not to continue watching the movie or TV show, you can archive that WatchList record. The WatchList record will not be visible any more in WatcHList. If you want to find it again, click on the Settings gear and enabling the "Archived" option to show archived WatchList records.

You can filter WatchList by the source where you watched the movie or show at (lke Netflix, Amazon etc) by clicking on the Settings and selecting from the Source dropdown.

You can also filter by Type by clicking on the Settings and selecting from the Type dropdown.

Sorting options are also available in the Settings icon.

If you add a WatchList Item record for a movie or TV show and the image does not display, enable "Show WLI" in the Settings gear, click on Items, then click on Settings gear again and enable "Missing Images".

When you click on the search icon, WatchList Items will be searched by default. If you want to search IMDB instead, click the IMDB checkbox.




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

![Search](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Search.jpg?raw=true)

![WatchList](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList.jpg?raw=true)

![View a WatchList](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList-ViewItem.jpg?raw=true)

![WatchList Edit](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchListItems-EditItem.jpg?raw=true)

![WatchList Add](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/WatchList-AddItem.jpg?raw=true)

![WatchList Stats](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Stats.jpg?raw=true)

![Settings - WatchList](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Settings-WatchList.jpg?raw=true)

![Admin - Manage Users](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageUsers.jpg?raw=true)

![Admin - Manage Sources](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageSources.jpg?raw=true)

![Admin - Manage Types](https://github.com/SegiH/WatchList/blob/main/Web/screenshots/Admin-ManageTypes.jpg?raw=true)