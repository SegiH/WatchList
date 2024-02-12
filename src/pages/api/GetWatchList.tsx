import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";
import { getUserID } from './default';
import WatchList from "../../app/interfaces/IWatchList";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const userID = await getUserID(req, res);

     let sortColumn = typeof req.query.SortColumn !== "undefined" ? req.query.SortColumn : "WatchListItemName";
     let sortDirection = typeof req.query.SortDirection !== "undefined" ? req.query.SortDirection : "ASC";
     let recordLimit = typeof req.query.RecordLimit !== "undefined" ? req.query.RecordLimit : null;

     if (userID === null) {
          res.send(["User ID is not set"]);
          return;
     }

     if (sortColumn === null || typeof sortColumn == "undefined") sortColumn = "WatchListItemName";
     else if (sortColumn === "ID") sortColumn = "WatchListID";
     else if (sortColumn === "Name") sortColumn = "WatchListItemName";

     if (sortDirection === null || typeof sortDirection == "undefined" || (sortDirection !== "ASC" && sortDirection != "DESC")) sortDirection = "ASC";

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
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchList: The error ${err} occurred getting the WatchList`]);
     });
}