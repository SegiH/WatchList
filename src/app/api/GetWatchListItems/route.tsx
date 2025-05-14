import { NextRequest } from 'next/server';
import { getDB, isLoggedIn } from "../lib";
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     // WatchListItems applies to all users so no need to provide user ID
     try {
          const db = getDB();

          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          watchListItemsDB.map((watchListItem: IWatchListItem) => {
               const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                    return (String(watchListType.WatchListTypeID) === String(watchListItem.WatchListTypeID));
               });

               watchListItem.WatchListTypeName = watchListType.length > 0 ? watchListType[0].WatchListTypeName : "";
          });

          return Response.json(["OK", watchListItemsDB]);
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}