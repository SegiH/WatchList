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
     // WatchListItems applies to all users so no need to provide user ID
     let recordLimit = typeof req.query.RecordLimit !== "undefined" ? req.query.RecordLimit : null;
     let sortColumn = typeof req.query.SortColumn !== "undefined" ? req.query.SortColumn : null;
     let sortDirection = typeof req.query.SortDirection !== "undefined" ? req.query.SortDirection : null;

     if (sortColumn === null || typeof sortColumn == "undefined") sortColumn = "WatchListItemName";
     else if (sortColumn === "ID") sortColumn = "WatchListItemID";
     else if (sortColumn === "Name") sortColumn = "WatchListItemName";
     else if (sortColumn === "Type") sortColumn = "WatchListTypeID";
     else if (sortColumn === "IMDB_URL") {
     } // Nothing to do for this column

     if (sortDirection === null || typeof sortDirection == "undefined" || (sortDirection !== "ASC" && sortDirection != "DESC")) sortDirection = "ASC";

     models.WatchListTypes.hasMany(models.WatchListItems, {
          foreignKey: "WatchListTypeID",
     });
     models.WatchListItems.belongsTo(models.WatchListTypes, {
          foreignKey: "WatchListTypeID",
     });

     models.WatchListItems.findAll({
          limit: recordLimit !== null ? recordLimit : 999999999,
          include: [{ model: models.WatchListTypes, required: true }],
     }).then((results: WatchListItem) => {
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchList: The error ${JSON.stringify(err)} occurred getting the WatchList Items`]);
     });
}