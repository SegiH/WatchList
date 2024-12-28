import { NextRequest } from 'next/server';
import { addUser, bugLogsSQL, DBFile, defaultSources, defaultTypes, execSelect, optionsSQL, watchListSQL, watchListItemsSQL, watchListSourcesSQL, watchListTypesSQL, usersSQL } from "../lib";
import fs from 'fs';
import sqlite3 from "sqlite3";

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

export async function PUT(request: NextRequest) {
     if (fs.existsSync(DBFile)) {
          return Response.json(["ERROR", `Error! The WatchList database file already exists. Please move or rename this file`]);
     }

     // Create new WatchList DB
     const dbResult: string[] = await new Promise((resolve, reject) => {
          new sqlite3.Database(DBFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
              if (err) {
                  reject(new Error(`An error occurred creating a new database with the error ${err.message}`));
              } else {
                  resolve(["OK"]);
              }
          });
      });

     if (dbResult[0] !== "OK") {
          return Response.json(["ERROR", dbResult[1]]);
     }

     try {
          await execSelect(watchListSQL, []);
          await execSelect(watchListItemsSQL, []);
          await execSelect(watchListSourcesSQL, []);
          await execSelect(watchListTypesSQL, []);
          await execSelect(usersSQL, []);
          await execSelect(bugLogsSQL, []);
          await execSelect(optionsSQL, []);

          defaultSources.forEach(async (element) => {
               const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";

               await execSelect(SQL, [element]);
          });

          defaultTypes.forEach(async (element) => {
               const SQL = "INSERT INTO WatchListTypes (WatchListTypeName) VALUES (?)";

               await execSelect(SQL, [element]);
          });

          await execSelect("INSERT INTO VisibleSections (name) VALUES(?);", ['Items']);
          await execSelect("INSERT INTO VisibleSections (name) VALUES(?);", ['Stats']);
          await execSelect("INSERT INTO VisibleSections (name) VALUES(?);", ['Admin']);

          return await addUser(request, true);
     } catch (e) {
          return Response.json(["ERROR", `An error occurred initializing the database with the error ${e.message}`]);
     }
}