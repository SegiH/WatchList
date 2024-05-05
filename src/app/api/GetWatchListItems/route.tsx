import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import WatchListItem from "../../interfaces/IWatchListItem";

export async function GET(request: NextRequest) {
     const models = getModels();
     
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

     models.WatchListTypes.hasMany(models.WatchListItems, {
          foreignKey: "WatchListTypeID",
     });
     models.WatchListItems.belongsTo(models.WatchListTypes, {
          foreignKey: "WatchListTypeID",
     });

     return models.WatchListItems.findAll({
          limit: recordLimit !== null ? recordLimit : 999999999,
          include: [{ model: models.WatchListTypes, required: true }],
     }).then((results: WatchListItem) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchList: The error ${JSON.stringify(err)} occurred getting the WatchList Items`]);
     });
}