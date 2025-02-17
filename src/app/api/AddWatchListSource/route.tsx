import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListSourceName = searchParams.get("WatchListSourceName");

     if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     try {
          const db = getDB();

          const watchListSourcesDB = db.WatchListSources;

          const highestWatchListSourceID = Math.max(...watchListSourcesDB.map(o => o.WatchListSourceID));

          watchListSourcesDB.push({
               "WatchListSourceID": (highestWatchListSourceID !== null ? highestWatchListSourceID : 0) + 1,
               "WatchListSourceName": watchListSourceName
          });

          writeDB(db);

          return Response.json(["OK", watchListSourcesDB.length]); // New ID
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}