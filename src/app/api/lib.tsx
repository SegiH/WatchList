const axios = require("axios");
const config = require("config");
const https = require('https');
const sqlite3 = require('sqlite3').verbose();

import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';

import { open } from "sqlite";

const Statement = require('sqlite3');

var SQLiteStore = require("connect-sqlite3")(expressSession);

// Constants
export const DBFile = "watchlistdb.sqlite";

const secretKey = config.get(`Secret`);

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
          const userSession = await getUserSession(request);

          if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin === false)) {
               return Response.json(["ERROR", `addUser(): Access Denied`]);
          }
     }

     const SQL = "INSERT INTO Users(UserName, Realname, Password, Admin, Enabled) VALUES (?, ?, ?, ?, ?);";

     const params = [encrypt(String(userName)), encrypt(String(realName)), encrypt(String(password)), isAdmin, 1];

     const result = await execInsert(SQL, params);

     const newID = result.lastID;

     return Response.json(["OK", newID]);
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