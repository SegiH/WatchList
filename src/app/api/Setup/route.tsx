import { NextRequest } from 'next/server';
import { addUser, DBFile, DBType } from "../lib";
import fs from 'fs';

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
export async function GET(request: NextRequest) {
     if (DBType === "SQLite") {
          try {
               if (fs.existsSync(DBFile)) {
                    return Response.json(["ERROR", `Error! The WatchList database file already exists. Please move or rename this file`]);
               }
          } catch (err) {
               return Response.json(["ERROR", err]);
          }
     }

     return addUser(request, true);
}