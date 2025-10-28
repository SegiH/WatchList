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
     const update = searchParams.get("Update");
     const findMissing = searchParams.get("FindMissing");

     let dbModified = false;

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
          //.slice(0, 1) // DELETE ME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          .map(async (watchListItem: IWatchListItem) => {
               const urlSplit = watchListItem.IMDB_URL.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    console.log("processing " + watchListItem.WatchListItemID + " with id " + id)

                    try {
                         const result = await getIMDBDetails(id);

                         if (result !== null && update === "true") {
                              console.log("writing it " + watchListItem.WatchListItemID + " with id " + id)
                              watchListItem["IMDB_JSON"] = JSON.stringify(result);

                              writeDB(db);
                         }
                    } catch (e) {
                         console.log(watchListItem.WatchListItemID + " ran into error " + e.message);
                         //return Response.json(["ERROR"]);
                    }
               }

               return watchListItem;
          });

     return Response.json(["OK"]);
     /*if (watchListItemsResult.length === 0) {
          if (findMissing !== "true") {
               return Response.json(["OK", []]);
          } else {
               return Response.json(["OK", "Nothing to fix"]);
          }
     }

     return await watchListItemsResult.slice(0, 1).map(async (watchListItem: IWatchListItem) => {
          const urlSplit = watchListItem.IMDB_URL.split("/");

          if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
               const id = urlSplit[4].toString();

               console.log("processing " + watchListItem.WatchListItemID + " with id " + id)

               try {
                    const result = await getIMDBDetails(id);

                    if (result === null && findMissing !== "true") {
                         return Response.json(["OK", []]);
                    }
               } catch (e) {

               }

          }
     });*/

     //return Response.json(["OK", results]);

     /*if (findMissing !== "true") {
          if (result === null) {
               return Response.json(["OK", []]);
          }

          if (update === "true") {
               watchListItem["IMDB_JSON"] = JSON.stringify(result);

               writeDB(db);
          }

          return Response.json(["OK", result]);
     } else {
          if (result !== null) {
               watchListItem["IMDB_JSON"] = JSON.stringify(result);

               dbModified = true;
          }
     }*/
     /*}

     return watchListItem;
});*/

     /* if (dbModified) {
           writeDB(db);
      }
 
      if (watchListItemsResult.length === 0) {
           return Response.json(["ERROR", "Unable to find any Watchlist Items to fix"]);
      } else {
           return Response.json(["OK"]);
      }*/
}