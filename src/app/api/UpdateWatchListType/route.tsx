import { NextRequest } from 'next/server';
import { getModels } from "../lib";

export async function PUT(request: NextRequest) {
     const models = getModels();
     const searchParams = request.nextUrl.searchParams;

     const watchListTypeID = searchParams.get("WatchListTypeID");
     const watchListTypeName = searchParams.get("WatchListTypeName");
     
     if (watchListTypeID === null) {
          return Response.json(["ERROR", "WatchList Type ID was not provided"]);
     } else if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList Type Name was not provided"]);
     }

     const updatedRowCount = await models.WatchListTypes.update(
          { WatchListTypeName: watchListTypeName }
          , {
               //logging: console.log,
               where: { WatchListTypeID: watchListTypeID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchListType: The error ${e.message} occurred while updating WatchList Types with ID ${watchListTypeID}`;
               return Response.json(["ERROR", errorMsg]);
          });

     return Response.json(["OK", updatedRowCount]);
}