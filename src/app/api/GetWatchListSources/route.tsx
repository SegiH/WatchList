import { defaultSources, execSelect, watchListSourcesSQL } from "../lib";

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
     console.log("Getting sources with the SQL " + SQL);
     try {
          const results = await execSelect(SQL, []);

          console.log("Sources Results")
          console.log(JSON.stringify(results));
          return Response.json(["OK", results]);
     } catch (e) {
          try {
               await execSelect(watchListSourcesSQL, []);

               defaultSources.forEach(async (element) => {
                    const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";
                    console.log("Adding default source with the SQL " + SQL);
                    await execSelect(SQL, [element]);
               });

               const results = await execSelect(SQL, []);
               console.log("Default Sources Results");
               console.log(JSON.stringify(results));
               return Response.json(["OK", results]);
          } catch(e) {
               console.log("Error Sources Results" + e.message);
               return Response.json(["ERROR", `/GetWatchListSources: The error ${e.message} occurred getting the WatchList Sources`]);
          }
     }
}