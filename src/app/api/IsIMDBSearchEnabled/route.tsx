import { NextRequest } from 'next/server';
import { getRapidAPIKey, isLoggedIn } from '../lib';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const rapidapi_key = getRapidAPIKey();

     if (rapidapi_key === null) {
          return Response.json(["ERROR", "API key is not set"]);
     } else {
         return Response.json(["OK"]);
     }
}