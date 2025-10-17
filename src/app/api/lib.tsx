import axios from "axios";
import fs from "fs";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';

import IUser from "../interfaces/IUser";
import ISectionChoice from "../interfaces/ISectionChoice";
import IUserOption from "../interfaces/IUserOption";
import path from "path";
import IWatchListItem from "../interfaces/IWatchListItem";

import { JsonStreamStringify } from 'json-stream-stringify';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';

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
          const db: any = await getDB();

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

export const getCurrentDate = () => {
     let formattedDate = new Date().toISOString().replace("T", " ").replace("Z", "");

     // Strip milliseconds
     formattedDate = formattedDate.slice(0, formattedDate.indexOf("."));

     return formattedDate;
}

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

export const getDB = () => {
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

export const getDB2 = () => {
     try {
          const filePath = path.join(process.cwd(), dbFile);

          const data = fs.readFileSync(filePath, 'utf8');

          return JSON.parse(data);
     } catch (e) {
          console.log(e.message)
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

          logMessage(`Error response for ${watchListItemID}. No results for this ID`, true);

          return newResult;
     }

     const thisWLI = thisWLIResult[0];

     logText = `${getCurrentDate()}: Checking ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} with the URL ${thisWLI.IMDB_URL}`;

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
               Message: `Failed to fetch the HTML`
          };

          logText += `\n${getCurrentDate()}: Failed to fetch the HTML for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} with the error ${mediaViewerPageResponse.statusText} and status: ${mediaViewerPageResponse.status}`
          logMessage(logText, true);

          return newResult;
     }

     const html = await mediaViewerPageResponse.text();

     const mediaViewerMatch = html.match(
          /<a[^>]*class="[^"]*\bipc-lockup-overlay\b[^"]*\bipc-focusable\b[^"]*"[^>]*href="([^"]+)"[^>]*>/
     );

     if (mediaViewerMatch && mediaViewerMatch[1]) {
          const newImageURL = `https://imdb.com${mediaViewerMatch[1]}`;

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
                    Status: "ERROR",
                    Message: imageResponse.statusText
               };

               logText += `\n${getCurrentDate()}: Error getting the 2nd page response for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_URL}`;
               logMessage(logText, true);

               return newResult;
          } else {
               const imgHtml = await imageResponse.text();

               const imgMatch = imgHtml.match(
                    /<img[^>]*\bclass="[^"]*\bsc-b66608db-0\b[^"]*\bAEgTx\b[^"]*"[^>]*\bsrc="([^"]+)"[^>]*>|<img[^>]*\bsrc="([^"]+)"[^>]*\bclass="[^"]*\bsc-b66608db-0\b[^"]*\bAEgTx\b[^"]*"[^>]*>/
               );

               if (imgMatch && imgMatch[1]) {
                    thisWLI.IMDB_Poster = imgMatch[1];

                    const base64Data = await getImageBase64(imgMatch[1]);

                    const newResult = {
                         ID: thisWLI.WatchListItemID,
                         Name: thisWLI.WatchListItemName,
                         IMDB_URL: thisWLI.IMDB_URL,
                         Status: "OK",
                         Message: "Matched by css class",
                         IMDB_Poster_Image: base64Data.toString()
                    };

                    logText += `\n${getCurrentDate()}: Matched by css class for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_Poster}`;
                    logMessage(logText, true);

                    return newResult;
               } else {
                    const firstClassIndex = imgHtml.indexOf("sc-b66608db-0 AEgTx");

                    const secondClassIndex = imgHtml.indexOf("sc-b66608db-1 eKTNqk");

                    const startIndex = (firstClassIndex !== -1 ? firstClassIndex : secondClassIndex !== -1 ? secondClassIndex : -1);

                    if (startIndex !== -1) {
                         let matched = false;

                         // find Img
                         for (let i = startIndex; i >= 4; i--) {
                              if (imgHtml.substring(i - 4, i) === "<img") {
                                   // find src=""
                                   const srcIndexStart = imgHtml.indexOf("src=\"", i - 4);
                                   if (srcIndexStart != -1) {
                                        const srcIndexEnd = imgHtml.indexOf('"', srcIndexStart + 6);

                                        if (srcIndexStart != -1 && srcIndexEnd != -1) {
                                             const newURL = imgHtml.substring(srcIndexStart + 5, srcIndexEnd);

                                             //thisWLI.IMDB_Poster = newURL;

                                             const base64Data = await getImageBase64(newURL);

                                             //thisWLI.IMDB_Poster_Image = base64Data.toString();

                                             const newResult = {
                                                  ID: thisWLI.WatchListItemID,
                                                  Name: thisWLI.WatchListItemName,
                                                  IMDB_URL: thisWLI.IMDB_URL,
                                                  Status: "OK",
                                                  Message: "Fuzzy match",
                                                  IMDB_Poster_Image: base64Data.toString()
                                             };

                                             logText += `\n${getCurrentDate()}: Fuzzy match for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_Poster}`;
                                             logMessage(logText, true);

                                             return newResult;
                                        }
                                   }

                                   if (!matched) {
                                        const newResult = {
                                             ID: thisWLI.WatchListItemID,
                                             Name: thisWLI.WatchListItemName,
                                             IMDB_URL: thisWLI.IMDB_URL,
                                             Status: "ERROR",
                                             Message: "Fuzzy match failed",
                                             IMDB_Poster_Image: ""
                                        };

                                        logText += `\n${getCurrentDate()}: Fuzzy match failed for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_URL}`;
                                        logMessage(logText, true);

                                        return newResult;
                                   }
                              }
                         }
                    } else {
                         const newResult = {
                              ID: thisWLI.WatchListItemID,
                              Name: thisWLI.WatchListItemName,
                              IMDB_URL: thisWLI.IMDB_URL,
                              Status: "ERROR",
                              Message: "No match by CSS class",
                              IMDB_Poster_Image: ""
                         };

                         logText += `\n${getCurrentDate()}: No match by CSS class for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_URL}`;
                         logMessage(logText, true);

                         return newResult;
                    }
               }
          }
     } else {
          const newResult = {
               ID: thisWLI.WatchListItemID,
               Name: thisWLI.WatchListItemName,
               IMDB_URL: thisWLI.IMDB_URL,
               Status: "ERROR",
               Message: "No match by anchor tag",
               IMDB_Poster_Image: ""
          };

          logText += `\n${getCurrentDate()}: No match by anchor tag for ${thisWLI.WatchListItemID} ${thisWLI.WatchListItemName} ${thisWLI.IMDB_URL}`;
          logMessage(logText, true);

          return newResult;
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
          const db: any = await getDB();

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

export const logMessage = async (message, noDate = false) => { // No Date says don't write the date to allow for more flexibility to write multiple logs at once and have each line have its own date time stamp
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
               try { fs.unlinkSync(tmpFile); } catch (e) { /* ignore */ }
               reject(err);
          });

          writable.on('finish', () => {
               if (hadError) {
                    // someone already rejected
                    return;
               }
               // Everything succeeded — replace the original
               fs.rename(tmpFile, dbFile, (err) => {
                    if (err) {
                         console.error('[writeDB] Rename failed:', err);
                         reject(err);
                    } else {
                         resolve(null);
                    }
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


export const writeDBold = (newDB) => {
     try {
          fs.writeFileSync(dbFile, JSON.stringify(newDB));
     } catch (e) {
          console.log(`The error ${e.message} occurred while saving the DB`);
          //console.log(newDB);
     }
}

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