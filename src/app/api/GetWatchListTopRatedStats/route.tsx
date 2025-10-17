import { NextRequest } from 'next/server';
import { getDB, getUserID } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const db: any = await getDB();

     const watchListDB = db.WatchList;
     const watchListItemsDB = db.WatchListItems;

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (String(watchList.UserID) === String(userID));
     });

     const getTop10Rated = (watchList) => {
          return watchList
               .sort((a, b) => b.Rating - a.Rating)  // Sort in descending order based on Rating
               .slice(0, 10);  // Take the first 10 items
     };

     // Get the top 10 highest-rated records
     const top10Rated = getTop10Rated(filteredWatchList);

     top10Rated.map(async (element: any) => {
          const currentWatchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(element.WatchListItemID));
          });

          if (currentWatchListItem.length > 0) {
               element.WatchListItemName = currentWatchListItem[0].WatchListItemName
               element.IMDB_URL = currentWatchListItem[0].IMDB_URL;
          }
     });

     return Response.json(["OK", top10Rated]);
}