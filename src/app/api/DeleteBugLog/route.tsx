import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";
import IBugLog from '@/app/interfaces/IBugLog';

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;
     const bugLogId = searchParams.get("BugLogId");

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     if (bugLogId === null) {
          return Response.json(["ERROR", "ID was not provided"])
     }

     try {
          const db = getDB();

          const buglogsDB = db.BugLogs;

          const newBugLogs = buglogsDB.filter((currentBuglog: IBugLog) => {
               return String(currentBuglog.BugLogId) !== String(bugLogId)
          });

          db.BugLogs = newBugLogs;

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}