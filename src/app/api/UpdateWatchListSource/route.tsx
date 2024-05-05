import { NextRequest } from 'next/server';
import { getModels } from "../lib";

export async function PUT(request: NextRequest) {
     const models = getModels();
     const searchParams = request.nextUrl.searchParams;

     const watchListSourceID = searchParams.get("WatchListSourceID");
     const watchListSourceName = searchParams.get("WatchListSourceName");
     
     if (watchListSourceID === null) {
          return Response.json(["ERROR", "WatchList Source ID was not provided"]);
     } else if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     const updatedRowCount = await models.WatchListSources.update(
          { WatchListSourceName: watchListSourceName }
          , {
               //logging: console.log,
               where: { WatchListSourceID: watchListSourceID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchListSource: The error ${e.message} occurred while updating WatchList Sources with ID ${watchListSourceID}`;
               return Response.json(["ERROR", errorMsg]);
          });

     return Response.json(["OK", updatedRowCount]);
}