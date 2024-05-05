import { NextRequest } from 'next/server';
import { getModels } from "../lib";

export async function PUT(request: NextRequest) {
     const models = getModels();
     const searchParams = request.nextUrl.searchParams;

     const watchListID = searchParams.get("WatchListID");
     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate"); // Optional
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const archived = searchParams.get("Archived");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
     }

     const updateColumns: any = {};

     if (watchListItemID !== null) {
          updateColumns['WatchListItemID'] = watchListItemID;
     }

     if (startDate !== null) {
          updateColumns['StartDate'] = startDate;
     }

     if (endDate !== null) {
          updateColumns['EndDate'] = endDate;
     }

     if (sourceID !== null) {
          updateColumns['WatchListSourceID'] = sourceID;
     }

     if (season !== null) {
          updateColumns['Season'] = season;
     }

     if (archived !== null) {
          updateColumns['Archived'] = (archived === "true" ? 1 : 0);
     }

     if (rating !== null) {
          updateColumns['Rating'] = rating;
     }

     if (notes !== null) {
          updateColumns['Notes'] = notes;
     }

     if (Object.keys(updateColumns).length == 0) { // No params were passed except for the mandatory column
          return Response.json(["ERROR", "No params were passed"]);
     }

     const updatedRowCount = await models.WatchList.update(
          updateColumns
          , {
               //logging: console.log,
               where: { WatchListID: watchListID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchList: The error ${e.message} occurred while updating WatchList with ID ${watchListID}`;
               return Response.json(["ERROR", errorMsg]);
          });

     return Response.json(["OK", updatedRowCount]);
}