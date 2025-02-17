import { NextRequest } from 'next/server';
import { getDB, getUserID } from "../lib";
import IWatchListSource from '@/app/interfaces/IWatchListSource';
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const getDetail = typeof searchParams.get("GetDetail") !== "undefined" && searchParams.get("GetDetail") === "true" ? 1 : 0;

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const db = getDB();

     const watchListDB = db.WatchList;
     const watchListItemsDB = db.WatchListItems;
     const watchListSourcesDB = db.WatchListSources;

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (String(watchList.UserID) === String(userID));
     });

     const countOccurrences = filteredWatchList.reduce((acc, obj) => {
          acc[obj.WatchListSourceID] = (acc[obj.WatchListSourceID] || 0) + 1;
          return acc;
     }, {});

     const countArray = Object.entries(countOccurrences);

     const top10 = countArray.sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);

     const results: any = [];

     if (!getDetail) {
          top10.map(async (element: any, index) => {
               const watchListSource = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
                    return (String(watchListSource.WatchListSourceID) === String(element[0]));
               });

               if (watchListSource.length === 1) {
                    results.push({
                         WatchListSourceID: element[0],
                         WatchListSourceName: watchListSource[0].WatchListSourceName,
                         SourceCount: element[1]
                    });
               }
          });

          return Response.json(["OK", results]);
     } else {
          top10.map(async (element: any) => {
               const watchListForSource = filteredWatchList.filter((watchList: IWatchList) => {
                    return (String(watchList.WatchListSourceID) === String(element[0]));
               });

               watchListForSource.map(async (watchList: any) => {
                    const currentWatchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
                         return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
                    });

                    const currentWatchListSource = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
                         return (String(watchListSource.WatchListSourceID) === String(watchList.WatchListSourceID));
                    });

                    if (currentWatchListSource.length !== 0 && currentWatchListItem.length !== 0) {
                         results.push({
                              WatchListID: watchList.WatchListID,
                              UserID: watchList.UserID,
                              WatchListItemID: watchList.WatchListItemID,
                              WatchListItemName: currentWatchListItem[0].WatchListItemName,
                              StartDate: watchList.StartDate,
                              EndDate: watchList.EndDate,
                              Season: watchList.Season,
                              WatchListSourceID: currentWatchListSource[0]?.WatchListSourceID,
                              WatchListSourceName: currentWatchListSource[0]?.WatchListSourceName
                         });
                    }
               });
          });

          return Response.json(["OK", results]);
     }
}