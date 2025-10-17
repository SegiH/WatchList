import { NextRequest } from 'next/server';
import { getDB, getUserID, logMessage } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     try {
          const db: any = await getDB();

          const watchListDB = db.WatchList
          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          // Get ID for movie type
          const movieTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
               return watchListType.WatchListTypeName === "Movie";
          });

          if (movieTypeIDResult.length !== 1) {
               return Response.json(["ERROR", `Unable to get ID for movie type movie`]);
          }

          const movieTypeID = movieTypeIDResult[0].WatchListTypeID;

          const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
               return (watchList.UserID === userID);
          });

          const allMovieWatchList = filteredWatchList.filter((watchList: IWatchList) => {
               return watchListItemsDB.filter((watchListItem: IWatchListItem) => {
                    return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(movieTypeID));
               }).length == 1;
          });

          return Response.json(["OK", [{ MovieCount: allMovieWatchList.length }]]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}