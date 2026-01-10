import { NextRequest } from 'next/server';
import { getDB, getMissingArtwork, writeLog, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListItemsProcessIds = searchParams.get("IDs");

     const parseNumberList = str => str.split(',').map(s => { if (isNaN(s = s.trim()) || s === '') throw new Error(`Invalid number: "${s}"`); return Number(s); });

     const processIds = watchListItemsProcessIds !== null ? parseNumberList(watchListItemsProcessIds) : null;

     if (processIds === null || processIds.length === 0) {
          return Response.json(["OK"]);
     }

     try {
          const db: any = await getDB();

          let dbModified = false;

          const resultsSummary: any = [];

          const watchListItemsDB = db.WatchListItems;

          const missingPosters = await watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (
                    (watchListItem.IMDB_URL !== null && watchListItem.IMDB_URL !== "") &&
                    ((typeof watchListItem.IMDB_Poster === "undefined" || watchListItem.IMDB_Poster === null || watchListItem.IMDB_Poster === "") ||
                    (processIds === null || (processIds !== null && processIds.includes(watchListItem.WatchListItemID))))
               )
          });

          if (missingPosters.length === 0) {
               writeLog("No results when looking for missing posters");
               return Response.json(["OK"]);
          }

          for (let i = missingPosters.length - 1; i >= 0; i--) {
               const missingPosterResult: any = await getMissingArtwork(missingPosters[i].WatchListItemID);

               if (typeof missingPosterResult !==  "undefined" && missingPosterResult !== null && missingPosterResult.Status === "OK" && typeof missingPosterResult.IMDB_Poster !== "undefined") {
                    missingPosters[i].IMDB_Poster = missingPosterResult.IMDB_Poster;

                    resultsSummary.push(missingPosterResult);
                    dbModified = true;
               } else {
                    resultsSummary.push(missingPosterResult);
               }
          }

          if (dbModified) {
               writeDB(db);
          }

          return Response.json(["OK", resultsSummary]);
     } catch (e) {
          writeLog(e.message);
          return Response.json(["ERROR", e.message]);
     }
}