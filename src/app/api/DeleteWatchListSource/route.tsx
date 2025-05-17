import { getDB, isUserAdmin, logMessage, writeDB } from "../lib";
import { NextRequest } from 'next/server';
import IWatchListSource from "@/app/interfaces/IWatchListSource";
import IWatchList from "@/app/interfaces/IWatchList";

export async function PUT(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     const isAdminResult = await isUserAdmin(request);

     if (!isAdminResult) {
          return Response.json(["ERROR", "Access denied"]);
     }

     const watchListSourceID = searchParams.get("WatchListSourceID");

     if (watchListSourceID === null) {
          return Response.json(["ERROR", "WatchList Source ID was not provided"]);
     }

     try {
          const db = getDB();

          const watchListDB = db.WatchList
          const watchListSourcesDB = db.WatchListSources;

          const watchListSourceIdValidation = watchListSourcesDB.filter((currentWatchListSource: IWatchListSource) => {
               return String(currentWatchListSource.WatchListSourceID) === String(watchListSourceID);
          });

          if (watchListSourceIdValidation.length === 0) {
               return Response.json(["ERROR", `The WatchList Source with ID ${watchListSourceID} is not a valid ID`]);
          }

          const inUseValidationResults = watchListDB.filter((currentWatchList: IWatchList) => {
               return String(currentWatchList.WatchListSourceID) === String(watchListSourceID);
          });

          if (inUseValidationResults.length > 0) {
               return Response.json(["ERROR", `The WatchList Source with ID ${watchListSourceID} is in use`]);
          }

          const newWatchListSources = watchListSourcesDB.filter((currentWatchListSource: IWatchListSource) => {
               return String(currentWatchListSource.WatchListSourceID) !== String(watchListSourceID)
          });

          db.WatchListSources = newWatchListSources

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}