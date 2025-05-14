import { NextRequest } from 'next/server';
import { getDB, isLoggedIn } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListSource from '@/app/interfaces/IWatchListSource';
import IWatchListType from '@/app/interfaces/IWatchListType';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListID = searchParams.get("WatchListID");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
     }

     try {
          const db = getDB();

          const watchListDB = db.WatchList
          const watchListItems = db.WatchListItems;
          const watchListSourcesDB = db.WatchListSources;
          const watchListTypesDB = db.WatchListTypes;

          const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
               return (String(watchList.WatchListID) === String(watchListID));
          });

          filteredWatchList.map((watchList) => {
               const watchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
                    return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
               });

               const watchListSource = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
                    return (String(watchListSource.WatchListSourceID) === String(watchList.WatchListSourceID));
               });

               const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                    return (String(watchListType.WatchListTypeID) === String(watchListItem[0].WatchListTypeID));
               });

               watchList.WatchListItemID = watchListItem.length > 0 ? parseInt(watchList.WatchListItemID, 10) : "";
               watchList.WatchListItemName = watchListItem.length > 0 ? watchListItem[0].WatchListItemName : "";
               watchList.WatchListTypeID = watchListItem.length > 0 ? watchListItem[0].WatchListTypeID : "";
               watchList.WatchListTypeName = watchListType.length > 0 ? watchListType[0].WatchListTypeName : "";
               watchList.IMDB_URL = watchListItem.length > 0 ? watchListItem[0].IMDB_URL : "";
               watchList.IMDB_Poster = watchListItem.length > 0 ? watchListItem[0].IMDB_Poster : "";
               watchList.ItemNotes = watchListItem.length > 0 ? watchListItem[0].ItemNotes : "";
               watchList.IMDBArchived = watchListItem.length > 0 ? watchListItem[0].Archived : "";
               watchList.IMDB_JSON = watchListItem.length > 0 ? watchListItem[0].IMDB_JSON : "";
               watchList.WatchListSourceName = watchListItem.length > 0 ? watchListSource[0]?.WatchListSourceName : "";
          });

          return Response.json(["OK", filteredWatchList]);
     } catch (e) {
          console.log(e.message);
          return Response.json(["ERROR", e.message]);
     }
}