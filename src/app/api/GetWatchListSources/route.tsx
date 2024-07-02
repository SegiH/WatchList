import { defaultSources, execSelect, watchListSourcesSQL } from "../lib";
import { NextRequest } from 'next/server';
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

export async function GET(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     const SQL="SELECT * FROM WatchListSources ORDER BY WatchListSourceName ASC";

     try {
          const results = await execSelect(SQL, []);

          return Response.json(["OK", results]);
     } catch (e) {
          try {
               await execSelect(watchListSourcesSQL, []);

               defaultSources.forEach(async (element) => {
                    const SQL = "INSERT INTO WatchListSources (WatchListSourceName) VALUES (?)";

                    await execSelect(SQL, [element]);
               });

               const results = await execSelect(SQL, []);

               return Response.json(["OK", results]);
          } catch(e) {
               return Response.json(["ERROR", `/GetWatchListSources: The error ${e.message} occurred getting the WatchList Sources`]);
          }
     }
}