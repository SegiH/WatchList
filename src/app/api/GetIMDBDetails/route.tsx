import { NextRequest } from 'next/server';
import { getIMDBDetails, getRapidAPIKey, isLoggedIn } from "../lib";

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     // Reenable when using local RapidAPI key
     if (await getRapidAPIKey() === "") {
          return Response.json(["ERROR", "API key is not set"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const imdb_id = searchParams.get("IMDB_ID");

     if (imdb_id === null) {
          return Response.json(["ERROR", "IMDB ID was not provided"]);
     } else {
          const result = await getIMDBDetails(imdb_id);

          return Response.json(["OK", result]);
     }
}