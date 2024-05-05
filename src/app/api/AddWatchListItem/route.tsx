import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import { getUserID } from '../lib';
import WatchListItem from "../../../app/interfaces/IWatchListItem";

export async function PUT(request: NextRequest) {
     const models = getModels();

     const searchParams = request.nextUrl.searchParams;

     //const watchListItemID = searchParams.get("WatchListItemID");
     const name = searchParams.get("WatchListItemName");
     const type = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("Notes");
     
     if (name === null) {
          return Response.json(["ERROR", "Name was not provided"]);
     } else if (type === null) {
          return Response.json(["ERROR", "Type was not provided"]);
     } else {
          const existingWatchListItem = await models.WatchListItems.findAll({
               where: {
                    IMDB_URL: imdb_url,
               },
          }).catch(function (err: Error) {
               return ["ERROR", `/GetOrder: The error ${err.message} occurred getting the order with the Order ID`];
          });

          if (existingWatchListItem.length > 0) {
               return Response.json(["ERROR-ALREADY-EXISTS", `The URL ${imdb_url} already exists with the name ${existingWatchListItem[0].WatchListItemName} and the ID ${existingWatchListItem[0].WatchListItemID}. It was NOT added!`]);
          }

          return await models.WatchListItems.create({
               WatchListItemName: name,
               WatchListTypeID: type,
               IMDB_URL: imdb_url,
               IMDB_Poster: imdb_poster,
               ItemNotes: notes,
               Archived: 0,
          }).then((result: WatchListItem) => {
               // Return ID of newly inserted row
               return Response.json(["OK", result.WatchListItemID]);
          }).catch(function (e: Error) {
               return Response.json(["ERROR", `/AddWatchListItems: The error ${e.message} occurred while adding the WatchList Item record`]);
          });
     }
}