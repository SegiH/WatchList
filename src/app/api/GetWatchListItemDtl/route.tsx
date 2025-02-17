import { NextRequest } from 'next/server';
import { getDB, isLoggedIn } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListType from '@/app/interfaces/IWatchListType';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");

     if (watchListItemID === null) {
          return Response.json(["ERROR", "WatchList ItemID was not provided"]);
     }

     try {
          const db = getDB();

          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          const filteredWatchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(watchListItemID));
          });

          filteredWatchListItem.map((watchListItem) => {
               const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                    return (String(watchListType.WatchListTypeID) === String(watchListItem.WatchListTypeID));
               });

               /*if (watchListType.length !== 1) { // This shouldn't ever happen
                    return Response.json(["ERROR", `Unable to get WatchListType ${watchListItem[0].WatchListTypeID} for WatchListItemID ${watchListItem.WatchListItemID}`]);
               }*/

               watchListItem.WatchListTypeName = watchListType.length > 0 ? watchListType[0].WatchListTypeName : "";
          });

          return Response.json(["OK", filteredWatchListItem]);
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}