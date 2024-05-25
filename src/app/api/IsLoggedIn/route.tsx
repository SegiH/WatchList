'use server'
import { NextRequest } from 'next/server';
import fs from 'fs';
import { cookies } from 'next/headers';
import { DBFile, getUserSession, validateSettings } from "../lib";

/**
 * @swagger
 * /api/IsLoggedIn:
 *    get:
 *        tags: 
 *          - Users
 *        summary: Return the status as to whether a user is logged in
 *        description: Return the status as to whether a user is logged in
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const validationResult: any = await validateSettings();

     if (validationResult === false) {
          return Response.json(["ERROR", false]);
     } else if (validationResult != "") {
          return Response.json(["ERROR", validationResult]);
     }

     if (!fs.existsSync(DBFile)) { // If DB file doesn't exist, this is a new WatchList instance
          // Clear session cookie if it existed previously but DB doesn't exist
          cookies().delete('userData');

          return Response.json(["ERROR", false]);
     }

     const userSession = await getUserSession(request);

     if (userSession && userSession.UserID) {
          return Response.json([
               "OK",
               {
                    UserID: userSession.UserID,
                    Username: userSession.UserName,
                    RealName: userSession.RealName,
                    Admin: userSession.Admin,
               },
          ]);
     } else {
          return Response.json(["ERROR", ""]);
     }
}