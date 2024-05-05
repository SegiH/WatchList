'use server'

import { NextRequest } from 'next/server';
import fs from 'fs';
import { cookies } from 'next/headers';

import { DBFile, getUserSession, validateSettings } from "../lib";

export async function GET(request: NextRequest) {
     const validationResult = await validateSettings();

     if (validationResult === false) {
          return Response.json(["ERROR", false]);
     } else if (validationResult != "") {
          return Response.json(["ERROR",validationResult]);
     }

     if (!fs.existsSync(DBFile)) {
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
          return Response.json(["ERROR",""]);
     }
}