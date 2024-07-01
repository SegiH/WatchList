import { NextRequest } from 'next/server';
import { execSelect, logMessage } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTypes:
 *    get:
 *        tags:
 *          - WatchListTypes
 *        summary: Get the WatchList Types
 *        description: Get the WatchList types that indicate whether the WatchList is a movie or show
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const SQL="SELECT * FROM WatchListTypes ORDER BY WatchListTypeName ASC";
     logMessage("Getting sources with the SQL " + SQL);

     try {
          const results = await execSelect(SQL, []);

          logMessage("Results of Getting types");
          logMessage(JSON.stringify(results));

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListTypes: The error ${e.message} occurred getting the WatchList Types`]);
     }
}