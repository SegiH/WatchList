import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import { getUserID } from '../lib';
import WatchList from "../../../app/interfaces/IWatchList";

export async function PUT(request: NextRequest) {
     const models = getModels();

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate")
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");

     if (userID === null) {
          return Response.json({ "ERROR": "User ID is not set" });
     } else if (watchListItemID === null) {
          return Response.json(["Item ID was not provided"]);
     } else if (startDate === null) {
          return Response.json(["Start Date was not provided"]);
     } else {
          return await models.WatchList.create({
               UserID: userID,
               WatchListItemID: watchListItemID,
               StartDate: startDate,
               EndDate: endDate,
               WatchListSourceID: sourceID,
               Season: season,
               Archived: 0,
               Rating: rating,
               Notes: notes,
          })
               .then((result: WatchList) => {
                    // Return ID of newly inserted row
                    return Response.json(["OK", result.WatchListID]);
               })
               .catch(function (e: Error) {
                    const errorMsg = `/AddWatchList: The error ${e.message} occurred while adding the WatchList record`;
                    console.error(errorMsg);
                    return Response.json(errorMsg);
               });
     }
}