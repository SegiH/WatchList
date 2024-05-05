import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import WatchListType from "../../../app/interfaces/IWatchListType";
import { error } from 'console';

export async function PUT(request: NextRequest) {
     const models = getModels();

     const searchParams = request.nextUrl.searchParams;

     const watchListTypeName = searchParams.get("WatchListWatchListTypeName");

     if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList WatchListType Name was not provided"]);
     }

     return await models.WatchListTypes.create({
          WatchListTypeName: watchListTypeName
     }).then((result: WatchListType) => {
          // Return ID of newly inserted row
          return Response.json(["OK", result.WatchListTypeID]);
     }).catch(function (e: Error) {
          const errorMsg = `/AddWatchListType: The error ${e.message} occurred while adding the WatchList Type record`;
          console.error(errorMsg);
          return Response.json(errorMsg);
     });
}