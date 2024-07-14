import { execSelect, execUpdateDelete, getUserSession, isUserAdmin } from "../lib";
import { NextRequest } from 'next/server';
/**
 * @swagger
 * /api/DeleteWatchListSource:
 *    put:
 *        tags:
 *          - WatchListSources
 *        summary: Delete a WatchList source as long as its in not in use
 *        description: Delete a WatchList source as long as its in not in use
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     const isAdminResult = await isUserAdmin(request);

     if (!isAdminResult) {
          return Response.json(["ERROR", "Access denied"]);
     }

     const watchListSourceID = searchParams.get("WatchListSourceID");

     if (watchListSourceID === null) {
          return Response.json(["ERROR", "WatchList Source ID was not provided"]);
     }

     try {
          const validSourceIDValidationSQL = `SELECT COUNT(*) AS SourceCount FROM WatchListSources WHERE WatchListSourceID=?`;

          const validSourceIDValidationResults = await execSelect(validSourceIDValidationSQL, [watchListSourceID]);

          if (validSourceIDValidationResults[0].SourceCount === 0) {
               return Response.json(["ERROR", `The WatchList Source with ID ${watchListSourceID} is not a valid ID`]);
          }

          const inUseValidationSQL = `SELECT COUNT(*) AS SourceCount FROM WatchList WHERE WatchListSourceID=?`;

          const inUseValidationResults = await execSelect(inUseValidationSQL, [watchListSourceID]);

          if (inUseValidationResults[0].SourceCount !== 0) {
               return Response.json(["ERROR", `The WatchList Source with ID ${watchListSourceID} is in use`]);
          }

          const SQL = "DELETE FROM WatchListSources WHERE WatchListSourceID=?";

          await execUpdateDelete(SQL, [parseInt(watchListSourceID, 10)]);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `The fatal error ${e.message} occurred deleting the WatchList Source with ID`]);
     }
}