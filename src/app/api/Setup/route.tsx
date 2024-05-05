import { NextRequest } from 'next/server';
import { addUser, DBFile, DBType } from "../lib";
import fs from 'fs';

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

     addUser(request, true);
}