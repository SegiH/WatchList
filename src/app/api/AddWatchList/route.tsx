import { NextRequest } from 'next/server';
import { getDB, getUserID, isLoggedIn, logMessage, writeDB } from '../lib';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate")
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");
     const archived = typeof searchParams.get("Archived") !== "undefined" && searchParams.get("Archived") !== null && searchParams.get("Archived") === "true" ? searchParams.get("Archived") : 0;

     if (userID === null) {
          return Response.json({ "ERROR": "User ID is not set" });
     } else if (watchListItemID === null) {
          return Response.json(["Item ID was not provided"]);
     } else if (startDate === null) {
          return Response.json(["Start Date was not provided"]);
     } else {
          try {
               const db = getDB();

               const watchListDB = db.WatchList;

               const highestWatchListID = Math.max(...watchListDB.map(o => o.WatchListID));

               watchListDB.push({
                    "WatchListID": (highestWatchListID !== null ? highestWatchListID : 0) + 1,
                    "UserID": userID,
                    "WatchListItemID": parseInt(watchListItemID, 10),
                    "StartDate": startDate,
                    "EndDate": endDate,
                    "WatchListSourceID": parseInt(sourceID as string, 10),
                    "Season": season,
                    "Archived": archived,
                    "Rating": rating,
                    "Notes": notes
               });

               writeDB(db);

               return Response.json(["OK", watchListDB.length]); // New ID
          } catch (e) {
               logMessage(e.message)
               return Response.json(["ERROR", e.message]);
          }
     }
}