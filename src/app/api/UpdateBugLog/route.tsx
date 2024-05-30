import { NextRequest } from 'next/server';
import { execUpdateDelete, getUserID } from '../lib';

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const bugLogID = searchParams.get("BugLogID");
    const bugLogName = searchParams.get("BugLogName");
    const addDate = searchParams.get("AddDate");
    const completedDate = searchParams.get("CompletedDate");

    if (bugLogID === null) {
        return Response.json({ "ERROR": "Bug log name is not set" });
    }

    let columns = "";
    const values: any = [];

    if (bugLogName !== null) {
        columns += (columns !== "" ? "," : "") + "WLBugName=?";
        values.push(bugLogName);
    }

    if (addDate !== null) {
        columns += (columns !== "" ? "," : "") + "AddDate=?";
        values.push(addDate);
    }

    if (completedDate !== null) {
        columns += (columns !== "" ? "," : "") + "CompletedDate=?";
        values.push(completedDate);
    }

    if (values.length === 0) {
        return Response.json(["ERROR", `No parameters were passed`]);
    }

    values.push(bugLogID);

    const SQL = `UPDATE WLBugs SET ${columns} WHERE WLBugID=?`

    await execUpdateDelete(SQL, values);

    return Response.json(["OK"]);
}