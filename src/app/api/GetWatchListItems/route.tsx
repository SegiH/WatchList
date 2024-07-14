import { NextRequest } from 'next/server';
import { execSelect, isLoggedIn } from "../lib";

/**
 * @swagger
 * /api/GetWatchListItems:
 *    get:
 *        tags:
 *          - WatchListItems
 *        summary: Get all WatchList Items
 *        description: Get all WatchList Items
 *        parameters:
 *           - name: SortColumn
 *             in: query
 *             description: Sort by specified column
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SortDirection
 *             in: query
 *             description: Sort by specified direction
 *             required: false
 *             schema:
 *                  type: string
 *           - name: RecordLimit
 *             in: query
 *             description: Limit numbr of records selected
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     // WatchListItems applies to all users so no need to provide user ID
     let recordLimit = searchParams.get("RecordLimit");
     let sortColumn = searchParams.get("SortColumn");
     let sortDirection = searchParams.get("SortDirection");

     if (sortColumn === null || typeof sortColumn == "undefined") sortColumn = "WatchListItemName";
     else if (sortColumn === "ID") sortColumn = "WatchListItemID";
     else if (sortColumn === "Name") sortColumn = "WatchListItemName";
     else if (sortColumn === "Type") sortColumn = "WatchListTypeID";
     else if (sortColumn === "IMDB_URL") {} // Nothing to do for this column

     if (sortDirection === null || typeof sortDirection == "undefined" || (sortDirection !== "ASC" && sortDirection != "DESC")) sortDirection = "ASC";

     const SQL = `SELECT WatchListItems.*, WatchListTypeName FROM WatchListItems
                LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID
                ${recordLimit !== null ? ` LIMIT ${recordLimit}` : ''}
                `;

     try {
          const results = await execSelect(SQL, []);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `The error ${e.message} occurred getting the WatchList Items`]);
     }
}