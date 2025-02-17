import { NextRequest } from 'next/server';
import { getDB, getIMDBDetails, isLoggedIn, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const name = searchParams.get("WatchListItemName");
     const type = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("Notes");
     const archived = searchParams.get("Archived") !== null ? searchParams.get("Archived") : 0;

     if (name === null) {
          return Response.json(["ERROR", "Name was not provided"]);
     } else if (type === null) {
          return Response.json(["ERROR", "Type was not provided"]);
     } else {
          if (imdb_url !== null) {
               try {
                    const db = getDB();

                    const watchListItemsDB = db.WatchListItems;

                    const existingWatchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
                         return watchListItem.IMDB_URL === imdb_url
                    });

                    if (existingWatchListItem.length > 0) {
                         return Response.json(["ERROR-ALREADY-EXISTS", `The URL ${imdb_url} already exists with the name ${existingWatchListItem[0].WatchListItemName} and the ID ${existingWatchListItem[0].WatchListItemID}. It was NOT added!`]);
                    }
               } catch (e) {
                    console.log(e)
                    return Response.json(["OK", []]);
               }
          }

          let imdb_json: string | null = null;

          if (imdb_url !== null && imdb_url.toString().indexOf("imdb.com/title/") !== -1) {
               const urlSplit = imdb_url?.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    const result = await getIMDBDetails(id);

                    if (result[0] === "OK" && result[1][0] === "OK") {
                         imdb_json = JSON.stringify(result[1][1]);
                    }
               }
          }

          try {
               const db = getDB();

               const watchListItemsDB = db.WatchListItems;

               const highestWatchListItemID = Math.max(...watchListItemsDB.map(o => o.WatchListItemID));

               watchListItemsDB.push({
                    "WatchListItemID": (highestWatchListItemID !== null ? highestWatchListItemID : 0) + 1,
                    "WatchListItemName": name,
                    "WatchListTypeID": parseInt(type, 10),
                    "IMDB_URL": imdb_url,
                    "IMDB_Poster":  imdb_poster,
                    "IMDB_JSON": imdb_json,
                    "ItemNotes": notes,
                    "Archived": parseInt(archived as string, 10),
               });

               writeDB(db)

               return Response.json(["OK", watchListItemsDB.length]); // New ID
          } catch (e) {
               console.log(e.message);
               return Response.json(["ERROR", e.message]);
          }
     }
}