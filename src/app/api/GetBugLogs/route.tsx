import { NextRequest } from 'next/server';
import { execSelect } from "../lib";

export async function GET(request: NextRequest) {
     const SQL = `SELECT * FROM WLBugs ORDER BY WLBugID`;

     try {
          const results = await execSelect(SQL, []);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetBugLogs: The error ${e.message} occurred getting the WL Bug Logs`]);
     }
}