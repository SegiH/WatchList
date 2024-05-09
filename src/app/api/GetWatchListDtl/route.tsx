import { NextRequest } from 'next/server';
import { getModels, getUserID } from "../lib";
import WatchList from "../../interfaces/IWatchList";

/**
 * @swagger
 * /api/GetWatchListDtl:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get WatchList record based on the provided WatchListID
 *        description: Get WatchList record based on the provided WatchListID
 *        parameters:
 *           - name: WatchListID
 *             in: query
 *             description: WatchList ID of the record to return
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

     const watchListID = searchParams.get("WatchListID");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
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
          include: [
               {
                    model: models.WatchListItems,
                    required: true,
                    include: [{ model: models.WatchListTypes, required: true }],
               },
               { model: models.WatchListSources, required: true },
          ],
          where: {
               WatchListID: watchListID,
          },
     }).then((results: WatchList) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchList: The error ${err.message} occurred getting the WatchList Detail`]);
     });
}