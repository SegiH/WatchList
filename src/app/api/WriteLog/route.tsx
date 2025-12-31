import { NextRequest } from 'next/server';
import { writeLog } from '../lib';

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const writeLogText = searchParams.get("WriteLogText");

     if (writeLogText === null) {
          return Response.json(["ERROR", "Log message was not provided"]);
     }

     writeLog(writeLogText);

     return Response.json(["OK"]);
}