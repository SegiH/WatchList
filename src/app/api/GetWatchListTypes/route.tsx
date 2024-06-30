import { NextRequest } from 'next/server';
import { execSelect } from "../lib";

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
     
     console.log("Getting types with the SQL " + SQL);

     try {
          const results = await execSelect(SQL, []);
          console.log("Types Results");
          console.log(JSON.stringify(results));
          return Response.json(["OK", results]);
     } catch (e) {
          console.log("Error Types Results" + e.message);
          return Response.json(["ERROR", `/GetWatchListTypes: The error ${e.message} occurred getting the WatchList Types`]);
     }
}