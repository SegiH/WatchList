import { NextRequest } from 'next/server';
import { getDB, getUserID, logMessage } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListSource from '@/app/interfaces/IWatchListSource';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     let recordLimit = searchParams.get("RecordLimit");

     if (userID === null) {
          return Response.json(["User ID is not set"]);
     }

     if (recordLimit !== null) {
          try {
               if (isNaN(parseInt(recordLimit, 10))) {
                    return Response.json(["Record limit is not a number 1"]);
               }
          } catch (e) {
               return Response.json(["Record limit is not a number 2"]);
          }
     }

     try {
          const db = getDB();

          const watchListDB = db.WatchList;
          const watchListItemsDB = db.WatchListItems;
          const watchListSourcesDB = db.WatchListSources;
          const watchListTypesDB = db.WatchListTypes;

          const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
               return (String(watchList.UserID) === String(userID));
          });

          filteredWatchList.map((watchList) => {
               const watchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
                    return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
               });

               const watchListSource = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
                    return (String(watchListSource.WatchListSourceID) === String(watchList.WatchListSourceID));
               });

               const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                    return (String(watchListType.WatchListTypeID) === String(watchListItem[0].WatchListTypeID));
               });

               if (watchListItem.length > 0) {
                    watchList.WatchListItemID = parseInt(watchList.WatchListItemID, 10);
                    watchList.WatchListItemName = watchListItem[0].WatchListItemName;
                    watchList.WatchListTypeID =  watchListItem[0].WatchListTypeID;
                    watchList.WatchListTypeName = watchListType[0].WatchListTypeName;
                    watchList.IMDB_URL = watchListItem[0].IMDB_URL;
                    watchList.IMDB_Poster = watchListItem[0].IMDB_Poster;
                    watchList.IMDB_Poster_Image = watchListItem[0].IMDB_Poster_Image;
                    watchList.ItemNotes = watchListItem[0].ItemNotes;
                    watchList.IMDBArchived = watchListItem[0].Archived;
                    watchList.IMDB_JSON = watchListItem[0].IMDB_JSON;
                    watchList.WatchListSourceName = watchListSource[0]?.WatchListSourceName;
               }
          });

          return Response.json(["OK", filteredWatchList]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}