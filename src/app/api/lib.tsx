const axios = require("axios");
const config = require("config");
const fs = require("fs");
const https = require('https');
const sqlite3 = require('sqlite3').verbose();

import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';
import IUser from "../interfaces/IUser";

import { open } from "sqlite";

const Statement = require('sqlite3');

var SQLiteStore = require("connect-sqlite3")(expressSession);

// Constants
export const DBFile = "watchlistdb.sqlite";
export const watchListSQL = "CREATE TABLE WatchList (WatchListID INTEGER PRIMARY KEY, UserID INTEGER NOT NULL, WatchListItemID INTEGER NOT NULL, StartDate VARCHAR(80), EndDate VARCHAR(80), WatchListSourceID INTEGER, Season INTEGER, Archived TINYINT(1), Notes VARCHAR(200), Rating DECIMAL(18,2));";
export const watchListItemsSQL = "CREATE TABLE WatchListItems(WatchListItemID INTEGER PRIMARY KEY,WatchListItemName VARCHAR(500),WatchListTypeID INTEGER,IMDB_URL VARCHAR(200),IMDB_Poster VARCHAR(2000),ItemNotes VARCHAR(200),Archived TINYINT(1), IMDB_JSON TEXT NULL);";
export const watchListSourcesSQL = "CREATE TABLE WatchListSources (WatchListSourceID INTEGER PRIMARY KEY, WatchListSourceName VARCHAR(80) NOT NULL);";
export const watchListTypesSQL = "CREATE TABLE WatchListTypes (WatchListTypeID INTEGER PRIMARY KEY, WatchListTypeName VARCHAR(80) NOT NULL);";
export const usersSQL = "CREATE TABLE Users (UserID INTEGER PRIMARY KEY, Username BLOB NOT NULL, Realname BLOB NOT NULL, Password BLOB NOT NULL, Admin BIT NULL DEFAULT 0, Enabled NULL DEFAULT 0, Token TEXT NULL, TokenExpiration INTEGER NULL);";

export const defaultSources = ['Amazon', 'Hulu', 'Movie Theatre', 'Netflix', 'Plex', 'Prime', 'Web'];
export const defaultTypes = ['Movie', 'Other', 'Special', 'TV'];
export const tokenSeparator = "*****";
const timeout = 604800000; // 1 week in MS

const secretKey = config.get(`Secret`);

export async function logMessage(message) {
     message = new Date().toISOString() + " " + message
     fs.appendFile('app.log', message + '\n', (err) => {
          if (err) {
               console.error('Error appending to log file:', err);
          }
     });
};

export async function addUser(request: NextRequest, isNewInstance = false) {
     const searchParams = request.nextUrl.searchParams;

     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const isAdmin = searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true" || isNewInstance === true) ? 1 : 0;

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

     const SQL = "INSERT INTO Users(UserName, Realname, Password, Admin, Enabled) VALUES (?, ?, ?, ?, ?);";

     const params = [encrypt(String(userName)), encrypt(String(realName)), encrypt(String(password)), isAdmin, 1];

     const result = await execInsert(SQL, params);

     const newID = result.lastID;

     return Response.json(["OK", newID]);
}

// Since Replit uses a primitive key/value pair, convert Replit BugLogs to format that matches what this app expects
export const getBugLogModel = (data: object) => {
     const newData: any = [];

     Object.keys(data).forEach(async (element) => {
          newData.push({
               "WLBugID": element,
               "WLBugName": data[element].WLBugName,
               "AddDate": data[element].AddDate,
               "CompletedDate": data[element].CompletedDate !== null ? data[element].CompletedDate : "",
               "ResolutionNotes": data[element].ResolutionNotes !== null ? data[element].ResolutionNotes : ""
          });
     });

     return newData;
};

export const decrypt = (cipherText: string) => {
     const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
     const plainText = bytes.toString(CryptoJS.enc.Utf8)
     return plainText
}

export const encrypt = (plainText: string) => {
     const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
     return cipherText
}

export const execInsert = async (sql: string, params: Array<string | number | null>) => {
     const db = await openDB();

     let stmt: typeof Statement;

     try {
          stmt = await db.prepare(sql);
     } catch (e) {
          return e;
     }

     return await stmt.run(params);
}

export const execSelect = async (sql: string, params: Array<string | number>) => {
     const db = await openDB();

     let stmt: typeof Statement;

     try {
          stmt = await db.prepare(sql);
     } catch (e) {
          return e;
     }

     const results: any = [];

     await stmt.each(params, function (_err: unknown, row: any) {
          results.push(row);
     });

     stmt.finalize();

     db.close();

     return results;
}

export const execUpdateDelete = async (sql: string, params: Array<string | number>) => {
     const db = await openDB();

     let stmt: typeof Statement;

     try {
          stmt = await db.prepare(sql);
     } catch (e) {
          return e;
     }

     await stmt.run(params);
}

export async function getIMDBDetails(imdb_id: string) {
     const detailsURL = `https://nodejs-shovav.replit.app//GetIMDBDetails?id=${imdb_id}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return await axios.get(detailsURL, { httpsAgent: agent })
          .then((response: any) => {
               return (["OK", response.data]);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });
}

export const getSession = nextSession({
     name: "WIB_SESSION",
     store: promisifyStore(
          new SQLiteStore({ dir: "./", table: "wiberSessions" })
     ),
});

export async function getUserID(req: NextRequest) {
     const userSession = await getUserSession(req);

     if (userSession !== null && typeof userSession !== "undefined" && typeof userSession.UserID !== "undefined") {
          return userSession.UserID;
     } else {
          return null;
     }
}

export async function getUserSession(req: NextRequest) {
     const userData = cookies().get('userData')

     if (typeof userData === "undefined") {
          return null;
     } else {
          const userObj = JSON.parse(userData.value);
          return userObj;
     }
}

export async function isLoggedIn(req: NextRequest) {
     const userSession = await getUserSession(req);

     if (typeof userSession === "undefined") {
          return false;
     } else {
          return true;
     }
}

export async function isUserAdmin(req: NextRequest) {
     const userSession = await getUserSession(req);

     if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin === false)) {
          return false;
     } else if (userSession.Admin === true) {
          return true;
     } else {
          return false;
     }
}

export async function login(username: string, password: string) {
     try {
          const SQL = "SELECT UserID,Username,Password,Realname,Admin FROM Users WHERE Enabled=1 LIMIT 1";

          const results = await execSelect(SQL, []);

          if (results.length === 0) {
               return Response.json(["ERROR", "Invalid username or password"]);
          }

          // Since the encryption is done in the API, we have to get the username and password and decrypt it in this endpoint
          const currentUser = results.filter((currentUser: any) => {
               return username === decrypt(currentUser.Username) && password === decrypt(currentUser.Password)
          });

          if (currentUser.length !== 1) {
               return Response.json(["ERROR", "Invalid username or password"]);
          }

          return loginSuccessfullActions(currentUser, results);

     } catch (err: any) {
          return Response.json(["ERROR", `/Login: The error ${err.message} occurred logging in`]);
     }
}

export async function loginSuccessfullActions(currentUser: IUser, results: any) {
     // Generate token
     const epochTime = new Date().getTime().toString();
     const token = encrypt(btoa(epochTime));

     const tokenExpiration = new Date().getTime() + timeout;

     const tokenSQL = "UPDATE Users SET Token=?, TokenExpiration=? WHERE UserID=?";
     const tokenParams: any = [token, tokenExpiration, currentUser[0].UserID];

     await execUpdateDelete(tokenSQL, tokenParams);

     const userData = {
          UserID: currentUser[0].UserID,
          Username: decrypt(currentUser[0].Username),
          Realname: decrypt(currentUser[0].Realname),
          Admin: results[0]["Admin"],
          Token: `${currentUser[0].Username}${tokenSeparator}${token}`,
          Timeout: timeout
     }

     cookies().set('userData', JSON.stringify(userData));

     return Response.json(["OK", userData]);
}

const openDB = async () => {
     return await open({
          filename: DBFile,
          driver: sqlite3.Database,
     });
}

export async function validateSettings() {
     // Validate config file properties that are required
     if (!config.has(`Secret`)) {
          return `Config file error: Secret property is missing or not set`;
     }

     if (!config.has(`SQLite.username`) || (config.has(`SQLite.username`) && config.get(`SQLite.username`) === "")) {
          return `Config file error: SQLite.username property is missing or not set`;
     }

     if (!config.has(`SQLite.password`) || (config.has(`SQLite.password`) && config.get(`SQLite.password`) === "")) {
          return `Config file error: SQLite.password property is missing or not set`;
     }

     if (!config.has(`SQLite.database`) || (config.has(`SQLite.database`) && config.get(`SQLite.database`) === "")) {
          return `Config file error: SQLite.database property is missing or not set`;
     }

     return "";
}