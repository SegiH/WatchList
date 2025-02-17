import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";
import IWatchListSource from '@/app/interfaces/IWatchListSource';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListSourceID = searchParams.get("WatchListSourceID");
     const watchListSourceName = searchParams.get("WatchListSourceName");

     if (watchListSourceID === null) {
          return Response.json(["ERROR", "WatchList Source ID was not provided"]);
     } else if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     try {
          const db = getDB();

          const watchListSourcesDB = db.WatchListSources;

          const watchListSourceResult = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
               return String(watchListSource.WatchListSourceID) === String(watchListSourceID)
          });

          if (watchListSourceResult.length !== 1) {
               return Response.json(["ERROR", "Unable to get the existing Watchlist Source"]);
          }

          const watchListSource = watchListSourceResult[0];

          watchListSource.WatchListSourceName = watchListSourceName;

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          console.log(e.message)
          return Response.json(["ERROR", e.message]);
     }
}