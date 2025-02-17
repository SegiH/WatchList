import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, writeDB } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListID = searchParams.get("WatchListID");
     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate"); // Optional
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const archived = searchParams.get("Archived");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
     }

     try {
          const db = getDB();

          const watchListDB = db.WatchList

          const watchListResult = watchListDB.filter((watchList: IWatchList) => {
               return String(watchList.WatchListID) === String(watchListID)
          });

          if (watchListResult.length !== 1) {
               return Response.json(["ERROR", "Unable to get the existing Watchlist"]);
          }

          const watchList = watchListResult[0];

          if (watchListItemID !== null) {
               watchList.WatchListItemID = watchListItemID;
          }

          if (startDate !== null) {
               watchList.StartDate = startDate;
          }

          if (endDate !== null) {
               watchList.EndDate = endDate;
          }

          if (sourceID !== null) {
               watchList.WatchListSourceID = sourceID;
          }

          if (season !== null) {
               watchList.Season = season;
          }

          if (archived !== null) {
               watchList.Archived = archived;
          }

          if (rating !== null) {
               watchList.Rating = rating;
          }

          if (notes !== null) {
               watchList.Notes = notes;
          }

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          console.log(e.message)
          return Response.json(["ERROR", e.message]);
     }
}