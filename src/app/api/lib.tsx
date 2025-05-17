import axios from "axios";
import fs from "fs";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';
import IUser from "../interfaces/IUser";
import ISectionChoice from "../interfaces/ISectionChoice";
import IUserOption from "../interfaces/IUserOption";
import path from "path";

const dbFile = "./database.json";

export const defaultSources = ['Amazon', 'Hulu', 'Movie Theatre', 'Netflix', 'Plex', 'Prime', 'Web'];

const secretKey = typeof process.env.SECRET !== "undefined" ? String(process.env.SECRET) : "";
const sessionDuration = 604800000;

export const addUser = async (request: NextRequest, isNewInstance = false) => {
     const searchParams = request.nextUrl.searchParams;

     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const isAdmin = ((searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true") || isNewInstance === true)) ? true : false;

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
          const db = getDB();

          const usersDB = db.Users;

          const highestWatchListID = usersDB !== null && usersDB.length > 0 ? Math.max(...usersDB.map(o => o.UserID)) : null;

          usersDB.push({
               "UserID": (highestWatchListID !== null ? highestWatchListID : 0) + 1,
               "Username": encrypt(String(userName)),
               "Realname": encrypt(String(realName)),
               "Password": encrypt(String(password)),
               "Admin": isAdmin,
               "Enabled": true
          });

          if (isNewInstance) {
               db.SetupComplete = true;
          }

          writeDB(db);

          return Response.json(["OK", usersDB.length]);
     } catch (e) {
          logMessage(e.message)
          return Response.json(["ERROR", e.message]);
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

export const fetchData = async (options) => {
     try {
          const response = await axios(options);
          return response.data;
     } catch (error) {
          throw error;
     }
}

export const getDB = () => {
     try {
          const filePath = path.join(process.cwd(), dbFile);
          const data = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(data);
     } catch (e) {
          return {};
     }
}

export const getIMDBDetails = async (imdb_id: string) => {
     const rapidapi_key = process.env.RAPIDAPIKEY;

     let options = {
          method: "GET",
          url: "https://imdb107.p.rapidapi.com/",
          params: { i: imdb_id, r: "json" },
          headers: {
               "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
               "x-rapidapi-key": rapidapi_key,
               useQueryString: true,
          },
     };

     const result = await fetchData(options);

     return result;
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
          const db = getDB();

          const optionsDB = db.Options;

          const existingWatchListItemResult = optionsDB.filter((option: IUserOption) => {
               return option.UserID === userID;
          });

          if (existingWatchListItemResult.length !== 1) {
               if (existingWatchListItemResult.length !== 0) {// Should never happen. Means theres more than 1 result
                    logMessage("Fatal error! more than 1 option for this user id");
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
     } catch (e) {
          logMessage(e)
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

     if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin !== true)) {
          return false;
     } else {
          return true;
     }
}

export const login = async (username: string, password: string) => {
     try {
          const db = getDB();

          const results = db.Users;

          // Since the encryption is done in the API, we have to get the username and password and decrypt it in this endpoint
          const currentUser = results.filter((currentUser: IUser) => {
               return username === decrypt(currentUser.Username) && password === decrypt(currentUser.Password)
          });

          if (currentUser.length !== 1) {
               return Response.json(["ERROR", "Invalid username or password"]);
          }

          if (currentUser[0].Enabled !== true) {
               return Response.json(["ERROR", "This user account is not enabled"]);
          }

          return loginSuccessfullActions(currentUser);

     } catch (err) {
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
               Admin: currentUser[0].Admin,
               Options: userOptions
          }

          const expires = new Date(Date.now() + sessionDuration);

          const currentCookies = await cookies();

          currentCookies.set('userData', JSON.stringify(userData), { expires: expires });

          return Response.json(["OK", userData]);
     } catch (e) {
          return Response.json(["ERROR", `An error occurred getting the options with the error ${e.message}`]);
     }
}

export const logMessage = async (message) => {
     let formattedDate = new Date().toISOString().replace("T", " ").replace("Z", "");

     // Strip milliseconds
     formattedDate = formattedDate.slice(0, formattedDate.indexOf("."));

     message = formattedDate + " " + message
     fs.appendFile('watchlist.log', message + '\n', (err) => {
          if (err) {
               console.error('Error appending to log file:', err);
          }
     });
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

export const writeDB = async (newDB) => {
     fs.writeFileSync(dbFile, JSON.stringify(newDB));
}