const JSON5 = require('json5');
const config = require("config");
const sqlite3 = require('sqlite3').verbose();
const tedious = require("tedious");

import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
//import cookie from "next/headers";
import { cookies } from 'next/headers';
import * as CryptoJS from 'crypto-js';
import { Sequelize } from "sequelize";
import { NextRequest } from 'next/server';
import User from "../../app/interfaces/IUser";

var SQLiteStore = require("connect-sqlite3")(expressSession);

// Constants
export let DBType = config.has(`SQLite.username`) ? "SQLite" : config.has(`SQLServer.username`) ? "SQLServer" : "";

export const DBFile = "watchlistdb.sqlite";

const defaultSources = ['Amazon', 'Hulu', 'Movie Theatre', 'Netflix', 'Plex', 'Prime', 'Web'];
const defaultTypes = ['Movie', 'Other', 'Special', 'TV'];

// SQLite
const SQLiteSequelize = new Sequelize(config.get(`SQLite.database`), config.get(`SQLite.username`), config.get(`SQLite.password`), {
     dialectModule: sqlite3,
     dialect: "sqlite",
     storage: DBFile,
     logging: false
});

const MSSQLSequelize = new Sequelize(config.get(`SQLServer.database`), config.get(`SQLServer.username`), config.get(`SQLServer.password`), {
     host: config.get(`SQLServer.host`),
     //encrypt: false,
     dialectModule: tedious,
     dialect: "mssql",
     logging: false,
     quoteIdentifiers: true,
     define: {
          freezeTableName: true,
     },
     pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
     },
     dialectOptions: {
          port: 1433,
     },
});

export const sequelize = DBType === "SQLite" ? SQLiteSequelize : MSSQLSequelize;

const initModels = require("./models/init-models");
const models = initModels(sequelize);
const secretKey = config.get(`Secret`);

export async function addUser(request: NextRequest, IsNewInstance = false) {
     const searchParams = request.nextUrl.searchParams;

     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const isAdmin = searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true" || IsNewInstance === true) ? 1 : 0;

     if (userName === null) {
          return Response.json(["User Name was not provided"]);
     } else if (realName === null) {
          return Response.json(["Real name was not provided"]);
     } else if (password === null) {
          return Response.json(["Password was not provided"]);
     } else {
          if (IsNewInstance === true) {
               await sequelize.sync({ alter: true }); // Init the DB

               // Initialize the default watchlist sources so this table is not empty by default
               defaultSources.forEach(async (element) => {
                    await models.WatchListSources.create({
                         WatchListSourceName: element
                    })
                         .catch(function (e: Error) {
                              const errorMsg = `addUser(): The error ${e.message} occurred while initializing the default WatchList Sources`;
                              console.error(errorMsg);
                         });
               });

               // Initialize the default watchlist types so this table is not empty by default
               defaultTypes.forEach(async (element) => {
                    return await models.WatchListTypes.create({
                         WatchListTypeName: element
                    }).catch(function (e: Error) {
                         const errorMsg = `addUser(): The error ${e.message} occurred while initializing the default WatchList Types`;
                         console.error(errorMsg);
                    });
               });
          } else {
               // This action should only be performed by logged in users who are an admin when not setting up new instance
               const userSession = await getUserSession(request);

               if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin === false)) {
                    return Response.json(["ERROR", `addUser(): Access Denied`]);
               }
          }

          return await models.Users.create({
               Username: encrypt(String(userName)),
               Realname: encrypt(String(realName)),
               Password: encrypt(String(password)),
               Admin: isAdmin,
               Enabled: 1,
          }).then((result: User) => {
               // Return ID of newly inserted row
               return Response.json(["OK", result.UserID]);
          }).catch(function (e: Error) {
               const errorMsg = `addUser(): The error ${e.message} occurred while adding the user`;
               console.error(errorMsg);
               return Response.json(["ERROR", errorMsg]);
          });
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

export async function getDBFile() {
     return DBFile;
}

export function getModels() {
     return models;
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

export async function validateSettings() {
     if (DBType === "") {
          //console.log(`Config file error: Database is not configured`);
          return false;
     }

     // Validate config file properties that are required
     if (!config.has(`Secret`)) {
          return `Config file error: Secret property is missing or not set`;
     }
     if (DBType === "MSSQL" && (!config.has(`SQLServer.username`) || (config.has(`SQLServer.username`) && config.get(`SQLServer.username`) === ""))) {
          return `Config file error: SQLServer.username property is missing or not set`;
     }

     if (DBType === "MSSQL" && (!config.has(`SQLServer.password`) || (config.has(`SQLServer.password`) && config.get(`SQLServer.password`) === ""))) {
          return `Config file error: SQLServer.password property is missing or not set`;
     }

     if (DBType === "MSSQL" && (!config.has(`SQLServer.host`) || (config.has(`SQLServer.host`) && config.get(`SQLServer.host`) === ""))) {
          return `Config file error: SQLServer.host property is missing or not set`;
     }

     if (DBType === "MSSQL" && (!config.has(`SQLServer.database`) || (config.has(`SQLServer.database`) && config.get(`SQLServer.database`) === ""))) {
          return `Config file error: SQLServer.database property is missing or not set`;
     }

     if (DBType === "SQLite" && (!config.has(`SQLite.username`) || (config.has(`SQLite.username`) && config.get(`SQLite.username`) === ""))) {
          return `Config file error: SQLite.username property is missing or not set`;
     }

     if (DBType === "SQLite" && (!config.has(`SQLite.password`) || (config.has(`SQLite.password`) && config.get(`SQLite.password`) === ""))) {
          return `Config file error: SQLite.password property is missing or not set`;
     }

     if (DBType === "SQLite" && (!config.has(`SQLite.database`) || (config.has(`SQLite.database`) && config.get(`SQLite.database`) === ""))) {
          return `Config file error: SQLite.database property is missing or not set`;
     }

     if (DBType === "MSSQL") {
          (async () => {
               try {
                    await sequelize.authenticate();

               } catch (e: any) {
                    return `Sequelize encountered the error ${e.message} while connecting to the DB`;
               }
          })();
     }

     return "";
}