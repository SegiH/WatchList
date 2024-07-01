import { defaultSources, execSelect, logMessage, watchListSourcesSQL } from "../lib";

/**
 * @swagger
 * /api/GetWatchListSources:
 *    get:
 *        tags:
 *          - WatchListSources
 *        summary: Get the WatchList sources
 *        description: Get the WatchList sources that indicate where a movie/show was watched (I.E Netflix)
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */

export async function GET() {
     const SQL="SELECT * FROM WatchListSources ORDER BY WatchListSourceName ASC";
     logMessage("Getting sources with the SQL " + SQL);
     try {
          const results = await execSelect(SQL, []);
          logMessage("Results of Getting sources");
          logMessage(JSON.stringify(results));

          return Response.json(["OK", results]);
     } catch (e) {
          try {
               await execSelect(watchListSourcesSQL, []);

               defaultSources.forEach(async (element) => {
                    const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";

                    await execSelect(SQL, [element]);
               });

               const results = await execSelect(SQL, []);

               logMessage("Adding sources");
               return Response.json(["OK", results]);
          } catch(e) {
               return Response.json(["ERROR", `/GetWatchListSources: The error ${e.message} occurred getting the WatchList Sources`]);
          }
     }
}