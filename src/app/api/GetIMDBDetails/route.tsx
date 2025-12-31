import { NextRequest } from 'next/server';
import { getDB, getIMDBDetails, isLoggedIn, writeLog, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const imdb_id = searchParams.get("IMDB_ID");
     const findMissing = searchParams.get("FindMissing");

     if ((typeof imdb_id === "undefined" || imdb_id === null) && findMissing !== "true") {
          return Response.json(["ERROR", "IMDB ID was not provided"]);
     }

     const db: any = await getDB();

     const watchListItemsDB = db.WatchListItems;

     await watchListItemsDB
          .filter((watchListItem: IWatchListItem) => {
               return (findMissing !== "true" && imdb_id !== null && (String(watchListItem.IMDB_URL).endsWith(imdb_id) || String(watchListItem.IMDB_URL).endsWith(imdb_id + "/")))
                    ||
                    (findMissing === "true" && (watchListItem.IMDB_JSON == null || typeof watchListItem.IMDB_JSON === "undefined") && typeof watchListItem.IMDB_URL !== "undefined" && watchListItem.IMDB_URL !== null && watchListItem.IMDB_URL !== "")
          })
          .map(async (watchListItem: IWatchListItem) => {
               writeLog(`Processing ${watchListItem.WatchListItemID}`)
               const urlSplit = watchListItem.IMDB_URL.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    try {
                         const result = await getIMDBDetails(id);

                         if (result !== null) {
                              writeLog(`Sucessfully processed ${watchListItem.WatchListItemID}`)
                              watchListItem["IMDB_JSON"] = JSON.stringify(result);

                              await writeDB(db);
                         }
                    } catch (e: any) {
                         return Response.json(["ERROR", e.message]);
                    }
               }

               return watchListItem;
          });

     return Response.json(["OK"]);
}