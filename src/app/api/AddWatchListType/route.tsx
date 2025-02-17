import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListTypeName = searchParams.get("WatchListTypeName");

     if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList WatchListType Name was not provided"]);
     }

     try {
          const db = getDB();

          const watchListTypesDB = db.WatchListTypes;

          const highestWatchListTypeID = Math.max(...watchListTypesDB.map(o => o.WatchListTypeID));

          watchListTypesDB.push({
               "WatchListTypeID": (highestWatchListTypeID !== null ? highestWatchListTypeID : 0) + 1,
               "WatchListTypeName": watchListTypeName
          });

          writeDB(db);

          return Response.json(["OK", watchListTypesDB.length]); // New ID
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}