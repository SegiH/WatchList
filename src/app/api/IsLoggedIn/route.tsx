'use server'
import { NextRequest } from 'next/server';
import { getDB, getUserOptions, getUserSession, validateSettings } from "../lib";

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const validationResult = await validateSettings();

     if (validationResult !== "") {
          return Response.json(["ERROR", validationResult]);
     }

     try {
          const db = getDB();

          if (db.SetupComplete !== true) {
               return Response.json(["ERROR", false]);
          }
     } catch (e) {
          console.log(e.message)
          return Response.json(["ERROR", e.message]);
     }

     const userSession = await getUserSession(request);

     const userOptions = await getUserOptions(userSession?.UserID, userSession?.Admin);

     if (typeof userSession && userSession?.UserID) {
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