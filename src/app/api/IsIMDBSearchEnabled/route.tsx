import { NextRequest } from 'next/server';
import { getRapidAPIKey, isLoggedIn } from '../lib';
/**
 * @swagger
 * /api/IsIMDBSearchEnabled:
 *    get:
 *        tags:
 *          - Search
 *        summary: Is IMDB search enabled
 *        description: Is IMDB search enabled
 *        responses:
 *          200:
 *            description: '["OK"] on success, ["ERROR","error message"] on error'
 */
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