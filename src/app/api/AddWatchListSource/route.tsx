import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import WatchListSource from "../../../app/interfaces/IWatchListSource";

export async function PUT(request: NextRequest) {
     const models = getModels();

     const searchParams = request.nextUrl.searchParams;

     const watchListSourceName = searchParams.get("WatchListSourceName");

     if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     return await models.WatchListSources.create({
          WatchListSourceName: watchListSourceName
     }).then((result: WatchListSource) => {
          // Return ID of newly inserted row
          return Response.json(["OK", result.WatchListSourceID]);
     }).catch(function (e: Error) {
          const errorMsg = `/AddWatchListSource: The error ${e.message} occurred while adding the WatchList Source record`;
          console.error(errorMsg);
          return Response.json(errorMsg);
     });
}