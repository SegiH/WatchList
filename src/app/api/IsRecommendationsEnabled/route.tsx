import { NextRequest } from 'next/server';
import { getRecommendationsAPIKey, isLoggedIn } from '../lib';
/**
 * @swagger
 * /api/IsRecommendationsEnabled:
 *    get:
 *        tags:
 *          - Recommendations
 *        summary: Is recommendations enabled
 *        description: Is recommendations enabled
 *        responses:
 *          200:
 *            description: '["OK",recommendations] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const recommendationsAPIKey = getRecommendationsAPIKey();

     if (recommendationsAPIKey === null) {
          return Response.json(["ERROR", "Recommendations API key is not set"]);
     } else {
         return Response.json(["OK"]);
     }
}