import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage } from '../lib';
import IBugLog from '@/app/interfaces/IBugLog';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;
     const getActiveBugLogs = searchParams.get("GetActiveBugLogs");

     try {
          const db: any = await getDB();

          const buglogsDB = db.BugLogs;

          const filteredBugLogs = buglogsDB.filter((currentBuglog: IBugLog) => {
               return getActiveBugLogs === null || (getActiveBugLogs === "true" && currentBuglog.CompletedDate == null)
          });

          return Response.json(["OK", filteredBugLogs]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}