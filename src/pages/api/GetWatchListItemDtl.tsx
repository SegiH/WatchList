import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";
import WatchListItem from "../../app/interfaces/IWatchListItem";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     const watchListItemID = typeof req.query.WatchListItemID !== "undefined" ? req.query.WatchListItemID : null;

     if (watchListItemID === null) {
          res.send(["ERROR", "WatchList ItemID was not provided"]);
          return;
     }

     models.WatchListTypes.hasMany(models.WatchListItems, {
          foreignKey: "WatchListTypeID",
     });
     models.WatchListItems.belongsTo(models.WatchListTypes, {
          foreignKey: "WatchListTypeID",
     });

     models.WatchListItems.findAll({
          include: [{ model: models.WatchListTypes, required: true }],
          where: {
               WatchListItemID: watchListItemID,
          },
     }).then((results: WatchListItem) => {
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchListItems: The error ${err.message} occurred getting the WatchList Item Detail`]);
     });
}