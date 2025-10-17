import { NextRequest } from 'next/server';
import { logMessage } from '../lib';

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const logMessageText = searchParams.get("LogMessage");

     if (logMessageText === null) {
          return Response.json(["ERROR", "Log message was not provided"]);
     }

     logMessage(logMessageText);

     return Response.json(["OK"]);
}