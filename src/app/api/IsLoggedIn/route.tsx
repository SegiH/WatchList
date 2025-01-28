'use server'
import { NextRequest } from 'next/server';
import fs from 'fs';
import { cookies } from 'next/headers';
import { DBFile, execSelect, execUpdateDelete, getUserOptions, getUserSession, validateSettings } from "../lib";
import IUser from '@/app/interfaces/IUser';

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
     const currentCookies = await cookies();

     const searchParams = request.nextUrl.searchParams;

     const validationResult = await validateSettings();

     if (validationResult !== "") {
          return Response.json(["ERROR", false]);
     } else if (validationResult != "") {
          return Response.json(["ERROR", validationResult]);
     }

     if (!fs.existsSync(DBFile)) { // If DB file doesn't exist, this is a new WatchList instance
          // Clear session cookie if it existed previously but DB doesn't exist
          try {
               currentCookies.delete('userData');
          } catch(e) {}

          return Response.json(["ERROR", false]);
     }

     const userSession = await getUserSession(request);

     const userOptions = await getUserOptions(userSession?.UserID, userSession?.Admin);

     if (userSession && userSession?.UserID) {
          return Response.json([
               "OK",
               {
                    UserID: userSession?.UserID,
                    Username: userSession?.Username,
                    RealName: userSession?.Realname,
                    Admin: userSession?.Admin,
                    Options: userOptions
               }
          ]);
     } else {
          return Response.json(["ERROR", ""]);
     }
}