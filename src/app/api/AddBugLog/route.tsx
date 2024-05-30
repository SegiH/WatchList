import { NextRequest } from 'next/server';
import { execInsert, getUserID } from '../lib';

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const bugLogName = searchParams.get("BugLogName");
     const addDate = searchParams.get("AddDate");
     const completedDate = searchParams.get("CompletedDate");

     if (bugLogName === null) {
          return Response.json({ "ERROR": "Bug log name is not set" });
     } else if (addDate === null) {
          return Response.json(["Add date was not provided"]);
     } else {
          const SQL = "INSERT INTO WLBugs(WLBugName, AddDate, CompletedDate) VALUES (?, ?, ?);"

          const params = [bugLogName, addDate, completedDate];

          const result = await execInsert(SQL, params);

          const newID = result.lastID;

          return Response.json(["OK", newID]);
     }
}