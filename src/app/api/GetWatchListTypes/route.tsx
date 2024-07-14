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
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     const SQL="SELECT * FROM WatchListTypes ORDER BY WatchListTypeName ASC";

     try {
          const results = await execSelect(SQL, []);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `The error ${e.message} occurred getting the WatchList Types`]);
     }
}