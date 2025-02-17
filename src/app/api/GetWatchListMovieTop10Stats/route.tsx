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

     const movieWLI = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
          return watchListItem.WatchListTypeID === movieTypeIDResult[0].WatchListTypeID;
     });

     // Get All watched movies
     const watchedMovies = watchListDB.filter((watchList: IWatchList) => {
          return movieWLI.filter((watchListItem: IWatchListItem) => {
               return watchList.UserID == userID && watchListItem.WatchListItemID === watchList.WatchListItemID;
          }).length > 0;
     });

     const frequencyMap = watchedMovies.reduce((acc, item) => {
          const key = `${item.UserID}-${item.WatchListItemID}`;
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
               const [UserID, WatchListItemID] = key.split('-');
               return { UserID: parseInt(UserID, 10), WatchListItemID: Number(WatchListItemID), count };
          });

     sortedTop10.map((watchList: any) => {
          const watchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
          });

          if (watchListItem.length === 1) {
               watchList.ItemCount = watchList.count;
               watchList.WatchListItemName = watchListItem[0].WatchListItemName;
               watchList.IMDB_URL = watchListItem[0].IMDB_URL;
          }
     });

     return Response.json(["OK", sortedTop10]);
}