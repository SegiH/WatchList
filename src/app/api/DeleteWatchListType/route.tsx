import { execSelect, execUpdateDelete } from "../lib";
import { NextRequest } from 'next/server';
/**
 * @swagger
 * /api/DeleteWatchListType:
 *    get:
 *        tags:
 *          - WatchListTypes
 *        summary: Delete a WatchList Type as long as its in not in use
 *        description: Delete a WatchList Type as long as its in not in use
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */

export async function GET(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     const watchListTypeID = searchParams.get("WatchListTypeID");

     if (watchListTypeID === null) {
          return Response.json(["ERROR", "WatchList Type ID was not provided"]);
     }

     try {
          const validTypeIDValidationSQL = `SELECT COUNT(*) AS TypeCount FROM WatchListTypes WHERE WatchListTypeID=?`;

          const validTypeIDValidationResults = await execSelect(validTypeIDValidationSQL, [watchListTypeID]);

          if (validTypeIDValidationResults[0].TypeCount === 0) {
               return Response.json(["ERROR", `/DeleteWatchListType: The WatchList Type with ID ${watchListTypeID} is not a valid ID`]);
          }

          const inUseValidationSQL = `SELECT COUNT(*) AS TypeCount FROM WatchListItems WHERE WatchListTypeID=?`;

          const inUseValidationResults = await execSelect(inUseValidationSQL, [watchListTypeID]);

          if (inUseValidationResults[0].TypeCount !== 0) {
               return Response.json(["ERROR", `/DeleteWatchListType: The WatchList Type with ID ${watchListTypeID} is in use`]);
          }

          const SQL = "DELETE FROM WatchListTypes WHERE WatchListTypeID=?";

          await execUpdateDelete(SQL, [parseInt(watchListTypeID, 10)]);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `/DeleteWatchListType: The fatal error ${e.message} occurred deleting the WatchList Type with ID`]);
     }
}