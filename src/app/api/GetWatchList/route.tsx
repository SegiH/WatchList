import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";
import WatchList from "../../interfaces/IWatchList";

/**
 * @swagger
 * /api/GetWatchList:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get all WatchList records for the currently logged in user
 *        description: Get all WatchList records for the currently logged in user
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
     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     let sortColumn = typeof searchParams.get("SortColumn") !== "undefined" ? searchParams.get("SortColumn") : "WatchListItemName";
     let sortDirection = typeof searchParams.get("SortDirection") !== "undefined" ? searchParams.get("SortDirection") : "ASC";
     let recordLimit = searchParams.get("RecordLimit");

     if (userID === null) {
          return Response.json(["User ID is not set"]);
     }

     if (sortColumn === null || typeof sortColumn == "undefined") {
          sortColumn = "WatchListItemName";
     } else {
          if (sortColumn === "ID") {
               sortColumn = "WatchListID";
          } else if (sortColumn === "Name") {
               sortColumn = "WatchListItemName";
          } else {
               sortColumn = "WatchListItemName"; // Fallback if unknown sort column is passed
          }
     }

     if (sortDirection === null || typeof sortDirection == "undefined") {
          sortDirection = "ASC";
     } else {
          if (sortDirection !== "ASC" && sortDirection != "DESC") {
               sortDirection = "ASC"; // Fallback if unknown sort direction is passed
          }
     }

     if (recordLimit !== null) {
          try {
               if (isNaN(parseInt(recordLimit, 10))) {
                    return Response.json(["Record limit is not a number 1"]);
               }
          } catch (e) {
               return Response.json(["Record limit is not a number 2"]);
          }
     }

     const SQL = `SELECT WatchList.*,WatchListItems.WatchListItemName,WatchListItems.WatchListTypeID,IMDB_URL, IMDB_Poster, IMDB_JSON, ItemNotes, WatchListSourceName, WatchListTypeName FROM WatchList
                LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID
                LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID
                LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID
                ${recordLimit !== null ? ` LIMIT ${recordLimit}` : ''}
                `;

     try {
          const results = await execSelect(SQL, []);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchList: The error ${e.message} occurred getting the WatchList`]);
     }
}