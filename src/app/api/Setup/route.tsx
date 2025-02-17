import { NextRequest } from 'next/server';
import { addUser, getDB } from "../lib";

export async function PUT(request: NextRequest) {
     try {
          const db = getDB();

          if (db.SetupComplete === true) {
               return Response.json(["ERROR", `Error! WatchList has already been set up. Please move or rename the database`]);
          }
     } catch (e) {
          console.log(e.message)
          return Response.json(["ERROR", e.message]);
     }

     try {
          return await addUser(request, true);
     } catch (e) {
          return Response.json(["ERROR", `An error occurred initializing the database with the error ${e.message}`]);
     }
}