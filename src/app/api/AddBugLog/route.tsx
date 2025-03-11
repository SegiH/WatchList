import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const bugLogName = searchParams.get("BugName");
     const addDate = searchParams.get("AddDate");
     const completedDate = searchParams.get("CompletedDate");
     const resolutionNotes = searchParams.get("ResolutionNotes");

     if (bugLogName === null) {
          return Response.json({ "ERROR": "Name was not provided" });
     }

     if (addDate === null) {
          return Response.json({ "ERROR": "AddDate was not provided" });
     }

     try {
          const db = getDB();

          const buglogsDB = db.BugLogs;

          const highestBugLogID = Math.max(...buglogsDB.map(o => o.BugLogId));

          buglogsDB.push({
               "BugLogId": (highestBugLogID !== null ? highestBugLogID : 0) + 1,
               "BugName": bugLogName,
               "AddDate": addDate,
               "CompletedDate": completedDate !== "NULL" ? completedDate : null,
               "ResolutionNotes": resolutionNotes
          });

          writeDB(db);

          return Response.json(["OK", buglogsDB.length]); // New ID
     } catch (e) {
          console.log(e.message)
          return Response.json(["ERROR", e.message]);
     }
}