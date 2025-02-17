import { NextRequest } from 'next/server';
import { getDB, getUserID } from "../lib";
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const db = getDB();

     const watchListDB = db.WatchList;
     const watchListItemsDB = db.WatchListItems;
     const watchListTypesDB = db.WatchListTypes;

     const tvTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "TV";
     });

     if (tvTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for tv type movie`]);
     }

     const tvTypeID = tvTypeIDResult[0].WatchListTypeID;

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (watchList.UserID === userID);
     });

     const allTvWatchList = filteredWatchList.filter((watchList: IWatchList) => {
          return watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(tvTypeID));
          }).length == 1;
     });

     return Response.json(["OK", [{ "TVSeasonsCount": allTvWatchList.length }]]);
}