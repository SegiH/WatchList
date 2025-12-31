import { getDB, isUserAdmin, writeLog, writeDB } from "../lib";
import { NextRequest } from 'next/server';
import IWatchListType from "@/app/interfaces/IWatchListType";
import IWatchListItem from "@/app/interfaces/IWatchListItem";

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

     const watchListTypeID = searchParams.get("WatchListTypeID");

     if (watchListTypeID === null) {
          return Response.json(["ERROR", "WatchList Type ID was not provided"]);
     }

     try {
          const db: any = await getDB();

          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          const watchListTypeIdValidation = watchListTypesDB.filter((currentWatchListType: IWatchListType) => {
               return String(currentWatchListType.WatchListTypeID) === String(watchListTypeID);
          });

          if (watchListTypeIdValidation.length === 0) {
               return Response.json(["ERROR", `The WatchList Type with ID ${watchListTypeID} is not a valid ID`]);
          }

          const inUseValidationResults = watchListItemsDB.filter((currentWatchListItem: IWatchListItem) => {
               return String(currentWatchListItem.WatchListTypeID) === String(watchListTypeID);
          });

          if (inUseValidationResults.length !== 0) {
               return Response.json(["ERROR", `The WatchList Type with ID ${watchListTypeID} is in use`]);
          }

          const newWatchListTypes = watchListTypesDB.filter((currentWatchListType: IWatchListType) => {
               return String(currentWatchListType.WatchListTypeID) !== String(watchListTypeID)
          });

          db.WatchListTypes = newWatchListTypes

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e: any) {
          writeLog(e.message);
          return Response.json(["ERROR", e.message]);
     }
}