import { NextRequest } from 'next/server';
import { getDB, getMissingArtwork, logMessage, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

//const delayInSeconds = 2;

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
               logMessage("No results when looking for missing posters");
               return Response.json(["OK"]);
          }

          console.log(new Date().toTimeString() + " " + missingPosters.length)

          for (let i = missingPosters.length - 1; i >= 0; i--) {
               //if (i == missingPosters.length - 10) {
               //     console.log("BREAKING when ID = " + missingPosters[i].WatchListItemID + "!!!!!!!!!!!!!!!!")
               //     break;
               //}

               const missingPosterResult: any = await getMissingArtwork(missingPosters[i].WatchListItemID);

               if (missingPosterResult.Status === "OK" && typeof missingPosterResult.IMDB_Poster !== "undefined") {
                    missingPosters[i].IMDB_Poster = missingPosterResult.IMDB_Poster;

                    resultsSummary.push(missingPosterResult);
                    dbModified = true;
               } else {
                    resultsSummary.push(missingPosterResult);
               }

               // Pause before checking next image
               //if (i % 10 === 0) {
               //     logMessage(`Pausing for ${delayInSeconds} seconds`);

               //     await new Promise(r => setTimeout(r, delayInSeconds * 1000));
               //}
          }

          if (dbModified) {
               writeDB(db);
          }

          return Response.json(["OK", resultsSummary]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}


//const searchParams = request.nextUrl.searchParams;

//const watchListItemsProcessIds = searchParams.get("IDs");
//const watchListItemsFindMissing = searchParams.get("FindMissing");

/*if (watchListItemsProcessIds === null) {
     return Response.json({ "ERROR": "IDs were not provided" });
}

const parseNumberList = str => str.split(',').map(s => { if (isNaN(s = s.trim()) || s === '') throw new Error(`Invalid number: "${s}"`); return Number(s); });

const processIds = parseNumberList(watchListItemsProcessIds);

const resultsSummary = await getMissingArtwork(processIds);

return Response.json(["OK", resultsSummary]);*/