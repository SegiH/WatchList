import { defaultSources, execSelect, watchListSourcesSQL } from "../lib";
const fs = require("fs");
const path = require("path");

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
    // const logFilePath = path.join(__dirname, 'app.log');
 
function log (message) {
    fs.appendFile('app.log', message + '\n', (err) => {
        if (err) {
            console.error('Error appending to log file:', err);
        }
    });
};

     const SQL="SELECT * FROM WatchListSources ORDER BY WatchListSourceName ASC";
     log("Getting sources with the SQL " + SQL);
     try {
          const results = await execSelect(SQL, []);
          log("Results of Getting sources");
          log(JSON.stringify(results));

          return Response.json(["OK", results]);
     } catch (e) {
          try {
               await execSelect(watchListSourcesSQL, []);

               defaultSources.forEach(async (element) => {
                    const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";

                    await execSelect(SQL, [element]);
               });

               const results = await execSelect(SQL, []);

               log("Adding sources");
               return Response.json(["OK", results]);
          } catch(e) {
               return Response.json(["ERROR", `/GetWatchListSources: The error ${e.message} occurred getting the WatchList Sources`]);
          }
     }
}