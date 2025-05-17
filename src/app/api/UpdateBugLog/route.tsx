import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage, writeDB } from '../lib';
import IBugLog from '@/app/interfaces/IBugLog';

export async function PUT(request: NextRequest) {
    if (!isLoggedIn(request)) {
        return Response.json(["ERROR", "Error. Not signed in"]);
    }

    const searchParams = request.nextUrl.searchParams;

    const bugLogId = searchParams.get("BugLogId");
    const bugLogName = searchParams.get("BugName");
    const addDate = searchParams.get("AddDate");
    const completedDate = searchParams.get("CompletedDate");
    const resolutionNotes = searchParams.get("ResolutionNotes");

    if (bugLogId === null) {
        return Response.json({ "ERROR": "Bug log ID is not set" });
    }

    try {
        const db = getDB();

        const buglogsDB = db.BugLogs;

        const existingBugLogsResult = buglogsDB.filter((bugLog: IBugLog) => {
            return String(bugLog.BugLogId) === String(bugLogId)
        });

        if (existingBugLogsResult.length !== 1) {
            return Response.json(["ERROR", "Unable to get the existing BugLog"]);
        }

        const existingBugLog = existingBugLogsResult[0];

        if (bugLogName !== null) {
            existingBugLog.BugName = bugLogName;
        }

        if (addDate !== null) {
            existingBugLog.AddDate = encodeURIComponent(addDate);
        }

        if (completedDate !== null) {
            existingBugLog.CompletedDate = encodeURIComponent(completedDate);
        }

        if (resolutionNotes !== null) {
            existingBugLog.ResolutionNotes = resolutionNotes; // Client already encodes this. Do not encode it again or it will cause issues!
        }

        writeDB(db);

        return Response.json(["OK"]);
    } catch (e) {
        logMessage(e.message)
        return Response.json(["ERROR", e.message]);
    }
}