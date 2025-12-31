import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeLog } from '../lib';
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

          const filteredBugLogs = buglogsDB
               .filter((currentBuglog: IBugLog) => {
                    return getActiveBugLogs === null || (getActiveBugLogs === "true" && currentBuglog.CompletedDate == null)
               })
               .sort((a: IBugLog, b: IBugLog) => {
                    return b.BugLogId < a.BugLogId ? -1 : 1;
               })
          return Response.json(["OK", filteredBugLogs]);
     } catch (e: any) {
          writeLog(e.message);
          return Response.json(["ERROR", e.message]);
     }
}