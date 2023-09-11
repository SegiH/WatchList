# WatchList
WatchList is a multi-user app that lets you track the movies and TV that you watch, how many times you watched them and when you watched them. You can also rate movies or shows.

Requirements: Web Server to run the WatchList web app

It is possible to search IMDB for a movie or TV show if you provide a RapidAPI IMDB key. See INSTALL.MD for details.

WatchList can be run as a web app or a desktop application (Windows, MAC and Linux)

WatchList uses a SQLite3 database format by default. It can also be configured to connect to Microsoft SQL Server instead of SQLite3.

# WatchList sections
The application has 5 different sections:

WatchList: These are the records where you add a record any time you watch something.

WatchListItems: These are the records that contain the movie, TV show or special which you only add once and then add a record in WatchList where you select the WatchListItem

IMDB Search: If you have a RAPIDAPI key, you can search and add movies and TV shows by searching IMDB

WatchList Stats: Stats of the movies and shows that you have watched over time

Admin: If you are an administrator, you will have access to the admin section where you can manage users;


# Logging in
When you log into WatchList, you will need to enter the WatchList backend URL that you will be logging into. 

Once you have logged into WatchList, you should not have to enter the backend url again on subsequent logins unless you need to change the WatchList URL. The last WatchList instance URL that was used is saved and automatically populated into this URL field. 