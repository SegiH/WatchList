import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const name = searchParams.get("WatchListItemName");
     const typeID = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("ItemNotes");
     const archived = searchParams.get("Archived");
     const imdb_json = searchParams.get("IMDB_JSON");

     if (watchListItemID === null) {
          return Response.json(["ERROR", "ID was not provided"]);
     }

     try {
          const db = getDB()

          const watchListItemsDB = db.WatchListItems;

          const watchListItemsResult = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return String(watchListItem.WatchListItemID) === String(watchListItemID)
          });

          if (watchListItemsResult.length !== 1) {
               return Response.json(["ERROR", "Unable to get the existing Watchlist Item"]);
          }

          const watchListItem = watchListItemsResult[0];

          if (name !== null) {
               watchListItem.WatchListItemName = name;
          }

          if (typeID !== null) {
               watchListItem.WatchListTypeID = typeID;
          }

          if (imdb_url !== null) {
               watchListItem.IMDB_URL = imdb_url;
          }

          if (imdb_poster !== null) {
               watchListItem.IMDB_Poster = imdb_poster;
          }

          if (imdb_json !== null) {
               watchListItem.IMDB_JSON = imdb_json;
          }

          if (notes !== null) {
               watchListItem.ItemNotes = notes;
          }

          if (archived !== null) {
               watchListItem.Archived = archived;
          }

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          logMessage(e.message)
          return Response.json(["ERROR", e.message]);
     }
}