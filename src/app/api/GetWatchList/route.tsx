import { NextRequest } from 'next/server';
import { getModels, getUserID } from "../lib";
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
     const models = getModels();
     
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
          if  (sortDirection !== "ASC" && sortDirection != "DESC") {
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
     models.WatchListItems.hasMany(models.WatchList, {
          foreignKey: "WatchListItemID",
     });
     models.WatchList.belongsTo(models.WatchListItems, {
          foreignKey: "WatchListItemID",
     });

     models.WatchListSources.hasMany(models.WatchList, {
          foreignKey: "WatchListSourceID",
     });
     models.WatchList.belongsTo(models.WatchListSources, {
          foreignKey: "WatchListSourceID",
     });

     models.WatchListTypes.hasMany(models.WatchListItems, {
          foreignKey: "WatchListTypeID",
     });
     models.WatchListItems.belongsTo(models.WatchListTypes, {
          foreignKey: "WatchListTypeID",
     });

     return models.WatchList.findAll({
          //logging: console.log,
          limit: recordLimit !== null ? recordLimit : 999999999,
          include: [
               {
                    model: models.WatchListItems,
                    required: true,
                    include: [{ model: models.WatchListTypes, required: true }],
               },
               { model: models.WatchListSources, required: true },
          ],
     }).then((results: WatchList) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchList: The error ${err} occurred getting the WatchList`]);
     });
}