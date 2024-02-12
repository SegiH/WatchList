import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";
import WatchList from "../../app/interfaces/IWatchList";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     const watchListID = typeof req.query.WatchListID !== "undefined" ? req.query.WatchListID : null;

     if (watchListID === null) {
          res.send(["ERROR", "WatchList ID was not provided"]);
          return;
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

     models.WatchList.findAll({
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
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchList: The error ${err.message} occurred getting the WatchList Detail`]);
     });
}