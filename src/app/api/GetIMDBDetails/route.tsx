import { NextRequest } from 'next/server';
import { getDB, getPosterURL, isLoggedIn, writeLog, writeDB, fetchTMDBDataByTT } from "../lib";
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
                    (findMissing === "true" && typeof watchListItem.IMDB_URL !== "undefined" && watchListItem.IMDB_URL !== null && watchListItem.IMDB_URL !== "")
          })
          .map(async (watchListItem: IWatchListItem) => {
               writeLog(`Processing ${watchListItem.WatchListItemID}`)
               const urlSplit = watchListItem.IMDB_URL.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    try {
                         const detail = await fetchTMDBDataByTT(id);

                         if (detail !== null) {
                              writeLog(`Sucessfully processed ${watchListItem.WatchListItemID}`)

                              watchListItem.IMDBId = id;
                              watchListItem.Year = detail["release_date"] !== "undefined" ? detail["release_date"].split("-")[0] : null;
                              watchListItem.Released = detail["release_date"] ?? "";

                              if (typeof watchListItem.WatchListTypeID === "undefined" || watchListItem.WatchListTypeID === null) {
                                   switch (detail["media_type"]) {
                                        case "movie":
                                             watchListItem.WatchListTypeID = 1;
                                             break;
                                        case "tv":
                                             watchListItem.WatchListTypeID = 2;
                                             break;
                                   }
                              }

                              watchListItem.Plot = detail["overview"] ?? "";
                              watchListItem.Language = detail["original_language"];
                              watchListItem.Country = detail["origin_country"];
                              watchListItem.IMDB_Poster = getPosterURL(detail["poster_path"]);
                              
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