import { NextRequest } from 'next/server';
import { addUser, DBFile, execSelect } from "../lib";
import fs from 'fs';

const sqlite3 = require('sqlite3').verbose();

/**
 * @swagger
 * /api/Setup:
 *    get:
 *        tags:
 *          - Users
 *        summary: Add a user as part of the initial WatchList setup
 *        description: Add a user as part of the initial WatchList setup
 *        parameters:
 *           - name: wl_username
 *             in: query
 *             description: New username
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_realname
 *             in: query
 *             description: Name of the user
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_password
 *             in: query
 *             description: New password
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_admin
 *             in: query
 *             description: Whether the new user is an admin
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */

const defaultSources = ['Amazon', 'Hulu', 'Movie Theatre', 'Netflix', 'Plex', 'Prime', 'Web'];
const defaultTypes = ['Movie', 'Other', 'Special', 'TV'];

export async function PUT(request: NextRequest) {
     if (fs.existsSync(DBFile)) {
          return Response.json(["ERROR", `Error! The WatchList database file already exists. Please move or rename this file`]);
     }

     // Create new WatchList DB
     const dbResult: any = await new Promise((resolve, reject) => {
          new sqlite3.Database(DBFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
              if (err) {
                  reject(new Error(`/Setup: An error occurred creating a new database with the error ${err.message}`));
              } else {
                  resolve(["OK"]);
              }
          });
      });

     if (dbResult[0] !== "OK") {
          return Response.json(["ERROR", dbResult[1]]);
     }

     // WatchList
     const watchListSQL = "CREATE TABLE WatchList (WatchListID INTEGER PRIMARY KEY, UserID INTEGER NOT NULL, WatchListItemID INTEGER NOT NULL, StartDate VARCHAR(80), EndDate VARCHAR(80), WatchListSourceID INTEGER, Season INTEGER, Archived TINYINT(1), Notes VARCHAR(200), Rating DECIMAL(18,2));";
     const watchListItemsSQL = "CREATE TABLE WatchListItems(WatchListItemID INTEGER PRIMARY KEY,WatchListItemName VARCHAR(500),WatchListTypeID INTEGER,IMDB_URL VARCHAR(200),IMDB_Poster VARCHAR(2000),ItemNotes VARCHAR(200),Archived TINYINT(1), IMDB_JSON TEXT NULL);";
     const watchListSourcesSQL = "CREATE TABLE WatchListSources (WatchListSourceID INTEGER PRIMARY KEY, WatchListSourceName VARCHAR(80) NOT NULL);";
     const watchListTypesSQL = "CREATE TABLE WatchListTypes (WatchListTypeID INTEGER PRIMARY KEY, WatchListTypeName VARCHAR(80) NOT NULL);";
     const usersSQL = "CREATE TABLE Users (UserID INTEGER PRIMARY KEY, Username BLOB NOT NULL, Realname BLOB NOT NULL, Password BLOB NOT NULL, Admin BIT NULL DEFAULT 0, Enabled NULL DEFAULT 0);";

     try {
          await execSelect(watchListSQL, []);
          await execSelect(watchListItemsSQL, []);
          await execSelect(watchListSourcesSQL, []);
          await execSelect(watchListTypesSQL, []);
          await execSelect(usersSQL, []);

          defaultSources.forEach(async (element) => {
               const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";

               await execSelect(SQL, [element]);
          });

          defaultTypes.forEach(async (element) => {
               const SQL = "INSERT INTO WatchListTypes (WatchListTypeName) VALUES (?)";

               await execSelect(SQL, [element]);
          });

          return await addUser(request, true);
     } catch (e) {
          return Response.json(["ERROR", `/Setup: An error occurred initializing the database with the error ${e.message}`]);
     }
}