import { NextRequest } from 'next/server';
import { getRecommendationsAPIKey, isLoggedIn } from '../lib';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const recommendationsAPIKey = await getRecommendationsAPIKey();

     if (recommendationsAPIKey === "") {
          return Response.json(["ERROR", "Recommendations API key is not set"]);
     } else {
         return Response.json(["OK"]);
     }
}