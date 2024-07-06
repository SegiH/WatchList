import { NextRequest } from 'next/server';
import { getIMDBDetails, isLoggedIn } from "../lib";

/**
 * @swagger
 * /api/GetIMDBDetails:
 *    get:
 *        tags:
 *          - Search
 *        summary: Get details for a movie/show from IMDB based on its IMDB ID
 *        description: Get details for a movie/show from IMDB based on its IMDB ID
 *        parameters:
 *           - name: ID
 *             in: query
 *             description: IMDB ID
 *             required: true
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",imdb details] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const imdb_id = searchParams.get("IMDB_ID");

     if (imdb_id === null) {
          return Response.json(["ERROR", "IMDB ID was not provided"]);
     } else {
          const result = await getIMDBDetails(imdb_id);

          if (result[0] === "OK" && result[1][0] === "OK") {
               return Response.json(["OK", result[1][1]]); //, result
          }
     }
}