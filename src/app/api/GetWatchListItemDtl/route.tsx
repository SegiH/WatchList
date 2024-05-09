import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import WatchListItem from "../../interfaces/IWatchListItem";

/**
 * @swagger
 * /api/GetWatchListItemDtl:
 *    get:
 *        tags:
 *          - WatchListItems
 *        summary: Get WatchList Item record based on the provided WatchListItemID
 *        description: Get WatchListItem record based on the provided WatchListItemID
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID of the record to return
 *             required: true
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const models = getModels();
     
     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");

     if (watchListItemID === null) {
          return Response.json(["ERROR", "WatchList ItemID was not provided"]);
     }

     models.WatchListTypes.hasMany(models.WatchListItems, {
          foreignKey: "WatchListTypeID",
     });
     models.WatchListItems.belongsTo(models.WatchListTypes, {
          foreignKey: "WatchListTypeID",
     });

     return models.WatchListItems.findAll({
          include: [{ model: models.WatchListTypes, required: true }],
          where: {
               WatchListItemID: watchListItemID,
          },
     }).then((results: WatchListItem) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchListItems: The error ${err.message} occurred getting the WatchList Item Detail`]);
     });
}