import { NextRequest } from 'next/server';
import { getDB, getIMDBDetails, getRapidAPIKey, isLoggedIn, logMessage, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     if (await getRapidAPIKey() === "") {
          return Response.json(["ERROR", "API key is not set"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const imdb_id = searchParams.get("IMDB_ID");
     const findMissing = searchParams.get("FindMissing");

     if ((typeof imdb_id === "undefined" || imdb_id === null) && findMissing !== "true") {
          return Response.json(["ERROR", "IMDB ID was not provided"]);
     }

     const db: any = await getDB();

     const watchListItemsDB = db.WatchListItems;

     const result = await watchListItemsDB
          .filter((watchListItem: IWatchListItem) => {
               return (findMissing !== "true" && imdb_id !== null && (String(watchListItem.IMDB_URL).endsWith(imdb_id) || String(watchListItem.IMDB_URL).endsWith(imdb_id + "/")))
                    ||
                    (findMissing === "true" && (watchListItem.IMDB_JSON == null || typeof watchListItem.IMDB_JSON === "undefined") && typeof watchListItem.IMDB_URL !== "undefined" && watchListItem.IMDB_URL !== null && watchListItem.IMDB_URL !== "")
          })
          .map(async (watchListItem: IWatchListItem) => {
               console.log(`Processing ${watchListItem.WatchListItemID}`)
               const urlSplit = watchListItem.IMDB_URL.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    try {
                         const result = await getIMDBDetails(id);

                         if (result !== null) {
                              watchListItem["IMDB_JSON"] = JSON.stringify(result);

                              writeDB(db);
                         }
                    } catch (e) {
                         return Response.json(["ERROR", e.message]);
                    }
               }

               return watchListItem;
          });

     return Response.json(["OK"]);
}