import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage, writeDB } from "../lib";
import IWatchListType from '@/app/interfaces/IWatchListType';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListTypeID = searchParams.get("WatchListTypeID");
     const watchListTypeName = searchParams.get("WatchListTypeName");

     if (watchListTypeID === null) {
          return Response.json(["ERROR", "WatchList Type ID was not provided"]);
     } else if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList Type Name was not provided"]);
     }

     try {
          const db: any = await getDB();

          const watchListTypesDB = db.WatchListTypes;

          const watchListTypeResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
               return String(watchListType.WatchListTypeID) === String(watchListTypeID)
          });

          if (watchListTypeResult.length !== 1) {
               return Response.json(["ERROR", "Unable to get the existing Watchlist Type"]);
          }

          const watchListType = watchListTypeResult[0];

          watchListType.WatchListTypeName = watchListTypeName;

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          logMessage(e.message)
          return Response.json(["ERROR", e.message]);
     }
}