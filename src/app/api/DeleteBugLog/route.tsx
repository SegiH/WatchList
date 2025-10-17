import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage, writeDB } from "../lib";
import IBugLog from '@/app/interfaces/IBugLog';

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;
     const bugLogId = searchParams.get("BugLogId");

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     if (bugLogId === null) {
          return Response.json(["ERROR", "ID was not provided"]);
     }

     try {
          const db: any = await getDB();

          const buglogsDB = db.BugLogs;

          // Validate that BugLog ID provided is valid
          const validBugLogIDResult = buglogsDB.filter((currentBuglog: IBugLog) => {
               return String(currentBuglog.BugLogId) === String(bugLogId)
          });

          if (validBugLogIDResult.length !== 1) {
               return Response.json(["ERROR", "ID is not valid"]);
          }

          const newBugLogs = buglogsDB.filter((currentBuglog: IBugLog) => {
               return String(currentBuglog.BugLogId) !== String(bugLogId)
          });

          db.BugLogs = newBugLogs;

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}