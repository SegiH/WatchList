import fs from "fs";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

import IUser from "../interfaces/IUser";
import ISectionChoice from "../interfaces/ISectionChoice";
import IUserOption from "../interfaces/IUserOption";
import path from "path";
import IWatchListItem from "../interfaces/IWatchListItem";

const dbFile = "./database.json";

export const defaultSources = ['Amazon', 'Hulu', 'Movie Theatre', 'Netflix', 'Plex', 'Prime', 'Web'];

const secretKey = typeof process.env.SECRET !== "undefined" ? String(process.env.SECRET) : "";
const sessionDuration = 604800000;

//const metaDataKeys = ["Actors", "Director", "Genre", "imdbRating", "imdbVotes", "Language", "Rated", "Released", "Runtime", "Total Seasons", "Writer", "Year"];

export const metaSearch = {
     "Actors": {
          Key: "Actors",
          Label: "By Actor",
          MatchType: "Partial"
     },
     "Director": {
          Key: "Director",
          Label: "By Director",
          MatchType: "Partial"
     },
     "Genre": {
          Key: "Genre",
          Label: "By Genre",
          MatchType: "Partial"
     },
     "imdbRating": {
          Key: "imdbRating",
          Label: "By IMDB Rating",
          MatchType: "Exact"
     },
     "imdbVotes": {
          Key: "imdbVotes",
          Label: "By # of IMDB Votes",
          MatchType: "Exact"
     },
     "Language": {
          Key: "Language",
          Label: "By Language",
          MatchType: "Partial"
     },
     "Rated": {
          Key: "Rated",
          Label: "By Rating",
          MatchType: "Exact"
     },
     "Released": {
          Key: "Released",
          Label: "By Release Date",
          MatchType: "Exact"
     },
     "Runtime": {
          Key: "Runtime",
          Label: "By Runtime",
          MatchType: "Exact"
     },
     "totalSeasons": {
          Key: "totalSeasons",
          Label: "By # of Seasons",
          MatchType: "Exact"
     },
     "Writer": {
          Key: "Writer",
          Label: "By Writer",
          MatchType: "Partial"
     },
     "Year": {
          Key: "Year",
          Label: "By Year",
          MatchType: "Partial"
     }
}

export const addUser = async (request: NextRequest, isNewInstance = false) => {
     const searchParams = request.nextUrl.searchParams;

     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const isAdmin = ((searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "1") || isNewInstance === true)) ? 1 : 0;

     if (userName === null) {
          return Response.json(["User Name was not provided"]);
     } else if (realName === null) {
          return Response.json(["Real name was not provided"]);
     } else if (password === null) {
          return Response.json(["Password was not provided"]);
     }
     // This action should only be performed by logged in users who are an admin when not setting up new instance
     if (!isNewInstance) {
          const isAdminResult = await isUserAdmin(request);

          if (!isAdminResult) {
               return Response.json(["ERROR", `addUser(): Access Denied`]);
          }
     }

     try {
          const db: any = await getDB();

          const usersDB = db.Users;

          const highestWatchListID = usersDB !== null && usersDB.length > 0 ? Math.max(...usersDB.map(o => o.UserID)) : null;

          usersDB.push({
               "UserID": (highestWatchListID !== null ? highestWatchListID : 0) + 1,
               "Username": encrypt(String(userName)),
               "Realname": encrypt(String(realName)),
               "Password": encrypt(String(password)),
               "Admin": isAdmin,
               "Enabled": 1
          });

          if (isNewInstance) {
               db.SetupComplete = true;
          }

          writeDB(db);

          return Response.json(["OK", usersDB.length]);
     } catch (e: any) {
          writeLog(e.message)
          return Response.json(["ERROR", e.message]);
     }
}

function assertString(value: string | undefined): asserts value is string {
     if (value == null) {
          throw new Error("RapidAPI key is missing");
     }
}

export const decrypt = (cipherText: string) => {
     const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
     const plainText = bytes.toString(CryptoJS.enc.Utf8)
     return plainText
}

export const encrypt = (plainText: string) => {
     const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
     return cipherText
}

export const fetchRapidAPIData = async (url) => {
     const rapidapi_key = await getRapidAPIKey();

     assertString(rapidapi_key);

     const headers = {
          method: "GET",
          headers: {
               "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
               "x-rapidapi-key": rapidapi_key
          }
     };

     try {
          const response = await fetch(url, headers);
          return await response.json();
     } catch (error: any) {
          throw error;
     }
}

export const getCurrentDate = () => {
     let formattedDate = new Date().toISOString().replace("T", " ").replace("Z", "");

     // Strip milliseconds
     formattedDate = formattedDate.slice(0, formattedDate.indexOf("."));

     return formattedDate;
}

export const getDB = () => {
     try {
          const filePath = path.join(process.cwd(), dbFile);

          const data = fs.readFileSync(filePath, 'utf8');

          return JSON.parse(data);
     } catch (e: any) {
          writeLog(e.message)
          return {};
     }
}

export const getIMDBDetails = async (imdb_id: string) => {
     const rapidapi_key = process.env.RAPIDAPIKEY;

     assertString(rapidapi_key);

     const url = `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${imdb_id}`;

     return fetchRapidAPIData(url);
}

export const generateMetaData = async () => {
     const db: any = await getDB();

     const watchListItemsDB = db.WatchListItems;

     const yearsValues: any = [];
     const yearArrayValues: any = []; // raw unsorted values
     const ratingsValues: any = [];
     const releaseDateValues: any = [];
     const runtimeValues: any = [];
     const genreArrayValues: any = []; // raw unsorted values
     const genreValues: any = [];
     const directorValues: any = [];
     const writerArrayValues: any = [];
     const writerValues: any = [];
     const actorArrayValues: any = [];
     const actorValues: any = [];
     const languageArrayValues: any = [];
     const languageValues: any = [];
     const imdbRatingValues: any = [];
     const imdbVotesValues: any = [];
     const totalSeasonsValues: any = [];

     watchListItemsDB.map((watchListItem: IWatchListItem) => {
          if (typeof watchListItem.IMDB_JSON !== "undefined") {
               try {
                    const WLIPayload: any = JSON.parse(watchListItem.IMDB_JSON);

                    // Map these fields so they can be used in a multi select

                    // Show rating like TV-MA
                    if (typeof WLIPayload["Rated"] !== "undefined" && ratingsValues.findIndex(obj => obj.value === WLIPayload["Rated"]) === -1) {
                         ratingsValues.push({ value: WLIPayload["Rated"], label: WLIPayload["Rated"] });
                    }

                    if (typeof WLIPayload["Released"] !== "undefined" && releaseDateValues.findIndex(obj => obj.value === WLIPayload["Released"]) === -1) {
                         releaseDateValues.push({ value: WLIPayload["Released"], label: WLIPayload["Released"] });
                    }

                    if (typeof WLIPayload["Runtime"] !== "undefined" && runtimeValues.findIndex(obj => obj.value === WLIPayload["Runtime"]) === -1) {
                         runtimeValues.push({ value: WLIPayload["Runtime"].replace("S min", " min"), label: WLIPayload["Runtime"].replace("S min", " min") });
                    }

                    if (typeof WLIPayload["Director"] !== "undefined" && directorValues.findIndex(obj => obj.value === WLIPayload["Director"]) === -1) {
                         directorValues.push({ value: WLIPayload["Director"], label: WLIPayload["Director"] });
                    }

                    if (typeof WLIPayload["imdbRating"] !== "undefined" && imdbRatingValues.findIndex(obj => obj.value === WLIPayload["imdbRating"]) === -1) {
                         imdbRatingValues.push({ value: WLIPayload["imdbRating"], label: WLIPayload["imdbRating"] });
                    }

                    if (typeof WLIPayload["imdbVotes"] !== "undefined" && imdbVotesValues.findIndex(obj => obj.value === WLIPayload["imdbVotes"]) === -1) {
                         imdbVotesValues.push({ value: WLIPayload["imdbVotes"], label: WLIPayload["imdbVotes"] });
                    }

                    if (typeof WLIPayload["totalSeasons"] !== "undefined" && totalSeasonsValues.findIndex(obj => obj.value === WLIPayload["totalSeasons"]) === -1) {
                         totalSeasonsValues.push({ value: WLIPayload["totalSeasons"], label: WLIPayload["totalSeasons"] });
                    }

                    // Do not map these values with value and label keys because they need to be processed
                    if (typeof WLIPayload["Year"] !== "undefined" && yearArrayValues.indexOf(WLIPayload["Year"]) === -1) {
                         yearArrayValues.push(WLIPayload["Year"]);
                    }

                    if (typeof WLIPayload["Genre"] !== "undefined" && genreArrayValues.indexOf(WLIPayload["Genre"]) === -1) {
                         genreArrayValues.push(WLIPayload["Genre"]);
                    }

                    if (typeof WLIPayload["Writer"] !== "undefined" && writerArrayValues.indexOf(WLIPayload["Writer"]) === -1) {
                         writerArrayValues.push(WLIPayload["Writer"]);
                    }

                    if (typeof WLIPayload["Actors"] !== "undefined" && actorArrayValues.indexOf(WLIPayload["Actors"]) === -1) {
                         actorArrayValues.push(WLIPayload["Actors"]);
                    }

                    if (typeof WLIPayload["Language"] !== "undefined" && languageArrayValues.indexOf(WLIPayload["Language"]) === -1) {
                         languageArrayValues.push(WLIPayload["Language"]);
                    }
               } catch (e: any) {
                    writeLog("error id=" + watchListItem.WatchListItemID + `${e.message}`)
               }
          }
     });

     for (let i = 0; i < yearArrayValues.length; i++) {
          const rawVal = yearArrayValues[i];

          switch (rawVal.length) {
               case 4: // Single year show/movie
                    if (yearsValues.findIndex(obj => String(obj.value) === String(parseInt(rawVal.trim(), 10))) === -1) {
                         yearsValues.push({ value: parseInt(rawVal.trim(), 10), label: parseInt(rawVal.trim(), 10) });
                    }

                    break;
               case 5: // Ongoing show/movie
                    const intVal = parseInt(rawVal.slice(0, 4).trim());

                    if (yearsValues.findIndex(obj => String(obj.value) === String(intVal)) === -1) {
                         yearsValues.push({ value: intVal, label: intVal });
                    }

                    break;
               case 9:
                    const startYear = parseInt(rawVal.slice(0, 4).trim());
                    const endYear = parseInt(rawVal.slice(5, 9).trim());

                    for (let yearCounter = startYear; yearCounter <= endYear; yearCounter++) {
                         if (yearsValues.findIndex(obj => String(obj.value) === String(yearCounter)) === -1) {
                              yearsValues.push({ value: yearCounter, label: yearCounter });
                         }
                    }
                    break
          }
     }

     for (let i = 0; i < genreArrayValues.length; i++) {
          const genreSpl = genreArrayValues[i].split(",");

          for (let j = 0; j < genreSpl.length; j++) {
               const rawVal = String(genreSpl[j]).trim();

               if (typeof genreSpl[j] !== "undefined" && genreValues.findIndex(obj => String(obj.value) === String(rawVal)) === -1) {
                    genreValues.push({ value: rawVal, label: rawVal });
               }
          }
     }

     for (let i = 0; i < writerArrayValues.length; i++) {
          const writerSpl = writerArrayValues[i].split(",");

          for (let j = 0; j < writerSpl.length; j++) {
               const rawVal = String(writerSpl[j]).trim();

               if (typeof writerSpl[j] !== "undefined" && writerValues.findIndex(obj => String(obj.value) === String(rawVal)) === -1) {
                    writerValues.push({ value: rawVal, label: rawVal });
               }
          }
     }

     for (let i = 0; i < actorArrayValues.length; i++) {
          const actorSpl = actorArrayValues[i].split(",");

          for (let j = 0; j < actorSpl.length; j++) {
               const rawVal = String(actorSpl[j]).trim();

               if (typeof actorSpl[j] !== "undefined" && actorValues.findIndex(obj => String(obj.value) === String(rawVal)) === -1) {
                    actorValues.push({ value: rawVal, label: rawVal });
               }
          }
     }

     for (let i = 0; i < languageArrayValues.length; i++) {
          const languageSpl = languageArrayValues[i].split(",");

          for (let j = 0; j < languageSpl.length; j++) {
               const rawVal = String(languageSpl[j]).trim();

               if (typeof languageSpl[j] !== "undefined" && languageValues.findIndex(obj => String(obj.value) === String(rawVal)) === -1) {
                    languageValues.push({ value: rawVal, label: rawVal });
               }
          }
     }

     const sortedActors = actorValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedDirectors = directorValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedGenres = genreValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedIMDBRatings = imdbRatingValues.sort((a, b) => {
          if (a.value === 'N/A') return 1; // Ensure 'N/A' goes last
          if (b.value === 'N/A') return -1; // Ensure 'N/A' goes last
          return parseFloat(a.value) - parseFloat(b.value); // Sort by numerical value
     });

     const sortedIMDBVotes = imdbVotesValues.sort((a, b) => {
          // Remove commas and convert to numbers
          const numA = parseFloat(a.value.replace(/,/g, ''));
          const numB = parseFloat(b.value.replace(/,/g, ''));

          return numA - numB; // Compare numerically
     });

     const sortedLanguages = languageValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedRatings = ratingsValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedReleaseDates = releaseDateValues.sort((a, b) => {
          return new Date(a.value).getTime() - new Date(b.value).getTime();
     });

     const sortedRuntimes = runtimeValues.sort((a, b) => {
          if (a.value === 'N/A') return 1; // Ensure 'N/A' goes last
          if (b.value === 'N/A') return -1; // Ensure 'N/A' goes last

          const aValue = parseInt(a.value.replace("S min", "").replace(" min", ""), 10);
          const bValue = parseInt(b.value.replace("S min", "").replace(" min", ""), 10);

          return aValue - bValue;
     });

     const totalSeasonsValuesSorted = totalSeasonsValues.sort((a, b) => {
          const numA = Number(a.value);
          const numB = Number(b.value);

          // Handle "N/A" cases explicitly
          if (isNaN(numA) && isNaN(numB)) return 0; // both N/A
          if (isNaN(numA)) return 1; // put N/A last
          if (isNaN(numB)) return -1; // put N/A last

          return numA - numB; // numeric sort
     });

     const sortedWriters = writerValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     const sortedYears = yearsValues.sort((a, b) => {
          return String(a.value).localeCompare(String(b.value));
     });

     metaSearch["Actors"]["Values"] = sortedActors;
     metaSearch["Director"]["Values"] = sortedDirectors;
     metaSearch["Genre"]["Values"] = sortedGenres;
     metaSearch["imdbRating"]["Values"] = sortedIMDBRatings;
     metaSearch["imdbVotes"]["Values"] = sortedIMDBVotes;
     metaSearch["Language"]["Values"] = sortedLanguages;
     metaSearch["Rated"]["Values"] = sortedRatings;
     metaSearch["Released"]["Values"] = sortedReleaseDates;
     metaSearch["Runtime"]["Values"] = sortedRuntimes;
     metaSearch["totalSeasons"]["Values"] = totalSeasonsValuesSorted;
     metaSearch["Writer"]["Values"] = sortedWriters;
     metaSearch["Year"]["Values"] = sortedYears;

     return metaSearch;
}

// This method will try to get the IMDB poster image for a given item based on the IMDBURL but will NOT save this back to the database.
// It is up to the service calling this methods to call writeDB(). This is necessary to avoid multiple calls to writeDB which throws an error
export const getMissingArtwork = async (watchListItemID: number) => {
     /*let processIds: number[] = [];

     if (watchListItemsProcessIds !== null) {
          const parseNumberList = str => str.split(',').map(s => { if (isNaN(s = s.trim()) || s === '') throw new Error(`Invalid number: "${s}"`); return Number(s); });

          processIds = parseNumberList(watchListItemsProcessIds);
     }*/


     const db: any = await getDB();
     let logText = "";

     const watchListItemsDB = db.WatchListItems;

     const thisWLIResult = watchListItemsDB
          .filter((watchListItem: IWatchListItem) => {
               return (
                    watchListItem.IMDB_URL !== "" &&
                    (String(watchListItem.WatchListItemID) === String(watchListItemID))
               )
          });

     if (thisWLIResult.length !== 1) {
          const newResult = {
               ID: watchListItemID,
               Name: "",
               IMDB_URL: "",
               Status: "ERROR",
               Message: `${watchListItemID} did not have an exact match`
          };

          writeLog(`Error response for ${watchListItemID}. No results for this ID`);

          return newResult;
     }

     const thisWLI = thisWLIResult[0];

     logText = `${getCurrentDate()}: Checking ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} with the URL ${thisWLI.IMDB_URL}`;

     try {
          const mediaViewerPageResponse = await fetch(thisWLI.IMDB_URL, {
               headers: {
                    'User-Agent': 'Next.js server',
               },
          });

          if (!mediaViewerPageResponse.ok) {
               const newResult = {
                    ID: watchListItemID,
                    Name: "",
                    IMDB_URL: "",
                    Status: "ERROR",
                    Message: `Failed to fetch the HTML from ${thisWLI.IMDB_URL}`
               };

               logText += `\n${getCurrentDate()}: Failed to fetch the HTML for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} with the error ${mediaViewerPageResponse.statusText} and status: ${mediaViewerPageResponse.status}`
               writeLog(logText, true);

               return newResult;
          }

          const linkToMediaViewerHTML = await mediaViewerPageResponse.text();

          if (typeof linkToMediaViewerHTML === "undefined" || linkToMediaViewerHTML === null || linkToMediaViewerHTML === "") {
               const newResult = {
                    ID: watchListItemID,
                    Name: "",
                    IMDB_URL: "",
                    Status: "ERROR",
                    Message: `Failed to parse the HTML from ${thisWLI.IMDB_URL}`
               };

               logText += `\n${getCurrentDate()}: Failed to parse the HTML for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} with the error ${mediaViewerPageResponse.statusText} and status: ${mediaViewerPageResponse.status}`
               writeLog(logText, true);

               return newResult;
          }

          const imdbPage = cheerio.load(linkToMediaViewerHTML);

          const imageUrlPage = imdbPage('.ipc-lockup-overlay.ipc-focusable');

          // Add domain to this src which is a relative path
          const newImageURL = "https://imdb.com" + imageUrlPage.attr('href');

          const imageResponse = await fetch(newImageURL, {
               headers: {
                    'User-Agent': 'Next.js server',
               },
          });

          if (!imageResponse.ok) {
               const newResult = {
                    ID: thisWLI.WatchListItemID,
                    Name: thisWLI.WatchListItemName,
                    IMDB_URL: thisWLI.IMDB_URL,
                    ImageURL: newImageURL,
                    Status: "ERROR",
                    Message: imageResponse.statusText
               };

               logText += `\n${getCurrentDate()}: Error getting the 2nd page response for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_URL}`;
               writeLog(logText, true);

               return newResult;
          }

          const imgHtml = await imageResponse.text();

          const imagePage = cheerio.load(imgHtml);

          const imgSources = imagePage('.sc-b66608db-2.cEjYQy img:not(.peek)')
               .map((_, el) => imagePage(el).attr('src'))
               .get();

          if (imgSources.length === 0) {
               return {
                    ID: watchListItemID,
                    Name: thisWLI.WatchListItemName,
                    IMDB_URL: thisWLI.IMDB_URL,
                    Status: "ERROR",
                    Message: "No results when matching css class .sc-b66608db-2.cEjYQy img:not(.peek)"
               };
          } else {
               return {
                    ID: watchListItemID,
                    Name: thisWLI.WatchListItemName,
                    IMDB_URL: thisWLI.IMDB_URL,
                    IMDB_Poster: imgSources[0],
                    Status: "OK"
               };
          }
     } catch (e: any) {
          alert(e.message);
     }
}

export const getRapidAPIKey = async () => {
     const rapidapi_key = process.env.RAPIDAPIKEY;

     return rapidapi_key;
}

export const getRecommendationsAPIKey = async () => {
     const recommendations_key = process.env.RECOMMENDATIONSAPIKEY;

     return recommendations_key;
}

export const getUserID = async (req: NextRequest) => {
     const userSession = await getUserSession(req);

     if (userSession !== null && typeof userSession !== "undefined" && typeof userSession.UserID !== "undefined") {
          return userSession.UserID;
     } else {
          return null;
     }
}

export const getUserOptions = async (userID: number, isAdmin: boolean) => {
     try {
          const db: any = await getDB();

          const optionsDB = db.Options;

          const existingWatchListItemResult = optionsDB.filter((option: IUserOption) => {
               return option.UserID === userID;
          });

          if (existingWatchListItemResult.length !== 1) {
               if (existingWatchListItemResult.length !== 0) {// Should never happen. Means theres more than 1 result
                    writeLog("Fatal error! more than 1 option for this user id");
                    return Response.json(["ERROR", "Fatal error! more than 1 option for this user id"]);
               }

               const visibleSectionsDB = db.VisibleSections;

               const filteredVisibleSections = visibleSectionsDB.filter((visibleSection: ISectionChoice) => {
                    return (visibleSection.label !== "Admin");
               });

               const filteredVisibleSectionsJSON = JSON.stringify(filteredVisibleSections);

               const highestOptionID = Math.max(...optionsDB.map(o => o.OptionID));

               const newOptions = {
                    "OptionID": highestOptionID + 1,
                    "UserID": userID,
                    "ArchivedVisible": 0,
                    "AutoAdd": 1,
                    "DarkMode": 1,
                    "HideTabs": 0,
                    "SearchCount": 5,
                    "StillWatching": 0,
                    "ShowMissingArtwork": 0,
                    "SourceFilter": -1,
                    "TypeFilter": -1,
                    "WatchListSortColumn": "Name",
                    "WatchListSortDirection": "ASC",
                    "VisibleSections": filteredVisibleSectionsJSON
               };

               optionsDB.push(newOptions);

               writeDB(db);

               return newOptions;
          } else {
               return existingWatchListItemResult[0];
          }
     } catch (e: any) {
          writeLog(e)
          return null;
     }
}

export const getUserSession = async (req: NextRequest) => {
     const cookiesVal = await cookies();
     const userData = cookiesVal.get('userData');

     if (typeof userData === "undefined") {
          return null;
     } else {
          const userObj = JSON.parse(userData.value);
          return userObj;
     }
}

export const isLoggedIn = async (req: NextRequest) => {
     const userSession = await getUserSession(req);

     if (typeof userSession === "undefined") {
          return false;
     } else {
          return true;
     }
}

export const isUserAdmin = async (req: NextRequest) => {
     const userSession = await getUserSession(req);

     if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin !== '1')) {
          return false;
     } else {
          return true;
     }
}

export const login = async (username: string, password: string) => {
     try {
          const db: any = await getDB();

          const results = db.Users;

          // Since the encryption is done in the API, we have to get the username and password and decrypt it in this endpoint
          const currentUser = results.filter((currentUser: IUser) => {
               return username === decrypt(currentUser.Username) && password === decrypt(currentUser.Password)
          });

          if (currentUser.length !== 1) {
               return Response.json(["ERROR", "Invalid username or password"]);
          }

          if (currentUser[0].Enabled !== 1) {
               return Response.json(["ERROR", "This user account is not enabled"]);
          }

          return loginSuccessfullActions(currentUser);

     } catch (err: any) {
          if (err instanceof Error) {
               return Response.json(["ERROR", `The error ${err.message} occurred logging in`]);
          }
     }
}

const loginSuccessfullActions = async (currentUser: IUser) => {
     try {
          const userOptions = await getUserOptions(currentUser[0].UserID, currentUser[0].Admin);

          const userData = {
               UserID: currentUser[0].UserID,
               Username: decrypt(currentUser[0].Username),
               Realname: decrypt(currentUser[0].Realname),
               Admin: String(currentUser[0].Admin),
               Options: userOptions
          }

          const expires = new Date(Date.now() + sessionDuration);

          const currentCookies = await cookies();

          currentCookies.set('userData', JSON.stringify(userData), { expires: expires });

          return Response.json(["OK", userData]);
     } catch (e: any) {
          return Response.json(["ERROR", `An error occurred getting the options with the error ${e.message}`]);
     }
}

export const writeLog = async (message, noDate = false) => { // No Date says don't write the date to allow for more flexibility to write multiple logs at once and have each line have its own date time stamp
     const now = new Date();
     let formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ` +
          `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
     //new Date().toISOString().replace("T", " ").replace("Z", "");

     // Strip milliseconds
     //formattedDate = formattedDate.slice(0, formattedDate.indexOf("."));

     if (noDate !== true) {
          message = formattedDate + " " + message
     }

     fs.appendFile('watchlist.log', message + '\n', (err) => {
          if (err) {
               console.error('Error appending to log file:', err);
          }
     });
}

export const matchMetadata = (IMDB_JSON, metaDataFilters) => {
     let metadataMatch: boolean = false;
     let matchCount = 0;

     if (metaDataFilters !== null) {
          Object.keys(metaDataFilters).forEach((metaDataKey, index) => {
               for (let i = 0; i < metaDataFilters[metaDataKey].length; i++) {
                    if (typeof IMDB_JSON !== "undefined" && IMDB_JSON !== null && typeof IMDB_JSON[metaDataKey] !== "undefined" && IMDB_JSON[metaDataKey] !== null
                         && (
                              metaSearch[metaDataKey]["MatchType"] === "Partial" && IMDB_JSON[metaDataKey].includes(metaDataFilters[metaDataKey][i]["value"])
                              ||
                              metaSearch[metaDataKey]["MatchType"] === "Exact" && IMDB_JSON[metaDataKey] === metaDataFilters[metaDataKey][i]["value"]
                         )
                    ) {
                         matchCount++;
                    }
               }
          });

          if (matchCount === Object.keys(metaDataFilters).length) {
               metadataMatch = true;
          }
     }

     return metadataMatch;
}

export const validateSettings = async () => {
     if (!fs.existsSync(dbFile)) {
          return `Database file is missing`;
     }

     // Validate .env properties that are required
     if (process.env.SECRET === null || process.env.SECRET === "") {
          return `ENV error: Secret property is missing or not set`;
     }

     return "";
}

export const writeDB = (newDB) => {
     try {
          fs.writeFileSync(dbFile, JSON.stringify(newDB));
     } catch (e: any) {
          writeLog(`The error ${e.message} occurred while saving the DB`);
     }
}

/*

import { JsonStreamStringify } from 'json-stream-stringify';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';

export const getDB_delete_me = () => {
     return new Promise((resolve) => {
          const filePath = path.join(process.cwd(), dbFile);

          const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
          const jsonParser = parser();
          const jsonStream = fileStream.pipe(jsonParser).pipe(streamValues());

          let isArray: any = null;

          const result = isArray === null ? (null) : (isArray ? [] : {});

          // We'll rebuild the entire object/array progressively:
          // For a top-level array, streamValues emits each item.
          // For a top-level object, it emits {key, value} pairs.
          // So we accumulate those to reconstruct the DB.

          let topLevelValue: any = null; // Will hold the full DB if primitive

          // We buffer object properties if the root is an object
          let objectAccumulator = {};

          let hasItems = false;

          jsonStream.on('data', ({ key, value }) => {
               hasItems = true;

               if (isArray === null) {
                    // Detect root type:
                    isArray = key === null; // For arrays, key is null
                    if (isArray) {
                         topLevelValue = [];
                    } else {
                         objectAccumulator = {};
                    }
               }

               if (isArray) {
                    topLevelValue.push(value);
               } else {
                    objectAccumulator[key] = value;
               }
          });


          jsonStream.on('end', () => {
               if (hasItems) {
                    resolve(isArray ? topLevelValue as any : objectAccumulator[0]);
               } else {
                    // Empty file or no data
                    resolve({});
               }
          });

          jsonStream.on('error', (err) => {
               console.error('Error parsing JSON:', err.message);
               resolve({});  // fallback like your original method
          });

          fileStream.on('error', (err) => {
               console.error('Error reading file:', err.message);
               resolve({});  // fallback like your original method
          });
     });
};

export const writeDB_delete_me = (newDB) => {
     return new Promise((resolve, reject) => {
          if (typeof newDB !== 'object' || newDB === null) {
               return reject(new Error('newDB must be a non-null object or array'));
          }

          const tmpFile = `${dbFile}.tmp`;

          // Step: open the writable first (this truncates the tmp file)
          const writable = fs.createWriteStream(tmpFile, { encoding: 'utf8' });

          let jsonStream;
          try {
               // Use a streaming library that supports objects properly
               jsonStream = new JsonStreamStringify(newDB);
          } catch (e) {
               writable.destroy();
               return reject(new Error('Could not initiate JSON stream: ' + e.message));
          }

          let hadError = false;

          // On write stream error
          writable.on('error', (err) => {
               hadError = true;
               console.error('[writeDB] Writable error:', err);
               // Clean up: remove tmp file if exists
               try { fs.unlinkSync(tmpFile); } catch (e) { // ignore
               reject(err);
          });

          writable.on('finish', () => {
               if (hadError) {
                    // someone already rejected
                    return;
               }
               // Everything succeeded — replace the original
               fs.copyFile(tmpFile, dbFile, (err) => {
                    if (err) {
                         console.error('[writeDB] Copy failed:', err);
                         reject(err);
                         return;
                    }

                    fs.unlink(tmpFile, (unlinkErr) => {
                         if (unlinkErr) {
                              console.warn('[writeDB] Warning: temp file was not deleted:', unlinkErr);
                         }
                         resolve(null);
                    });
               });
          });

          jsonStream.on('error', (err) => {
               hadError = true;
               console.error('[writeDB] JSON stream error:', err);
               // destroy writable so finish won't be called
               writable.destroy();
               // cleanup tmp
               try { fs.unlinkSync(tmpFile); } catch (e) { }
               reject(err);
          });

          // Pipe the JSON stream into the writable
          jsonStream.pipe(writable);
     });
};

const getImageBase64 = async (URL: string) => {

     const response = await fetch(URL);

     if (!response.ok) {
          return new Response('Failed to fetch image.', { status: 500 });
     }

     const arrayBuffer = await response.arrayBuffer();
     const base64 = Buffer.from(arrayBuffer).toString('base64');

     // Get the MIME type from headers, default to image/jpeg if unknown
     const contentType = response.headers.get('content-type') || 'image/jpeg';

     const base64Data = `data:${contentType};base64,${base64}`;

     return base64Data;
}
*/
// writes in chunks
// Generator that chunks a string into smaller pieces
/*function* chunkString(str, size = 65536) {
  let index = 0;
  while (index < str.length) {
    yield str.slice(index, index + size);
    index += size;
  }
}

export const writeDB2 = (newDB) => {
  return new Promise((resolve, reject) => {
    try {
      // Convert the entire object to JSON string (this is still one big string in memory)
      // You can tweak JSON.stringify parameters for indentation or filtering
      const jsonString = JSON.stringify(newDB);

      // Create a readable stream from chunks of the JSON string
      const readable = Readable.from(chunkString(jsonString));

      const writable = fs.createWriteStream(dbFile);

      writable.on('finish', () => resolve(null));
      writable.on('error', (err) => reject(err));
      readable.on('error', (err) => reject(err));

      // Pipe the chunked string stream to file
      readable.pipe(writable);

    } catch (e) {
      console.error(`The error ${e.message} occurred while saving the DB`);
      reject(e);
    }
  });
};*/