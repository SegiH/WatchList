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

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (watchList.UserID === userID);
     });

     const tvTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "TV";
     });

     if (tvTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for tv type movie`]);
     }

     const tvTypeID = tvTypeIDResult[0].WatchListTypeID;

     const allTvWatchList = filteredWatchList.filter((watchList: IWatchList) => {
          return watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(tvTypeID));
          }).length == 1;
     });

     const frequencyMap = allTvWatchList.reduce((acc, item) => {
          const key = `${item.WatchListItemID}`;
          if (!acc[key]) {
               acc[key] = 0;
          }
          acc[key]++;
          return acc;
     }, {} as { [key: string]: number });

     const frequencyArray = Object.entries(frequencyMap);

     const sortedTop10 = frequencyArray
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .map(([key, count]) => {
               const [WatchListItemID] = key.split('-');
               return { WatchListItemID: Number(WatchListItemID), ItemCount: count };
          });

     sortedTop10.map((watchList: any) => {
          const watchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
          });

          if (watchListItem.length === 1) {
               watchList.WatchListItemName = watchListItem[0].WatchListItemName;
               watchList.IMDB_URL = watchListItem[0].IMDB_URL;
          }
     });

     return Response.json(["OK", sortedTop10]);
}