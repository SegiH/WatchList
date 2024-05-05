import { NextRequest } from 'next/server';
import { getModels, getUserID } from "../lib";
import WatchList from "../../interfaces/IWatchList";

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