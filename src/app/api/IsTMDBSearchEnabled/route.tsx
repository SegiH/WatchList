import { NextRequest } from 'next/server';
import { getTMDBAPIKey, isLoggedIn } from '../lib';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const tmdb_key = await getTMDBAPIKey();

     if (typeof tmdb_key === "undefined" || tmdb_key === null) {
          return Response.json(["ERROR", "API key is not set"]);
     } else {
         return Response.json(["OK"]);
     }
}