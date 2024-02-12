import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";
import WatchListItem from "../../app/interfaces/IWatchListItem";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const name = typeof req.query.WatchListItemName !== "undefined" ? req.query.WatchListItemName : null;
     const type = typeof req.query.WatchListTypeID !== "undefined" ? req.query.WatchListTypeID : null;
     const imdb_url = typeof req.query.IMDB_URL !== "undefined" ? req.query.IMDB_URL : null;
     const imdb_poster = typeof req.query.IMDB_Poster !== "undefined" ? req.query.IMDB_Poster : null;
     const notes = typeof req.query.Notes !== "undefined" ? req.query.Notes : null;

     if (name === null) {
          res.send(["ERROR", "Name was not provided"]);
          return;
     } else if (type === null) {
          res.send(["ERROR", "Type was not provided"]);
          return;
     } else {
          const existingWatchListItem = await models.WatchListItems.findAll({
               where: {
                    IMDB_URL: imdb_url,
               },
          }).catch(function (err: Error) {
               return ["ERROR", `/GetOrder: The error ${err.message} occurred getting the order with the Order ID`];
          });

          if (existingWatchListItem.length > 0) {
               res.send(["ERROR-ALREADY-EXISTS", `The URL ${imdb_url} already exists with the name ${existingWatchListItem[0].WatchListItemName} and the ID ${existingWatchListItem[0].WatchListItemID}. It was NOT added!`]);
               return;
          }

          await models.WatchListItems.create({
               WatchListItemName: name,
               WatchListTypeID: type,
               IMDB_URL: imdb_url,
               IMDB_Poster: imdb_poster,
               ItemNotes: notes,
               Archived: 0,
          }).then((result: WatchListItem) => {
               // Return ID of newly inserted row
               res.status(200).json(["OK", result.WatchListItemID]);
               return;
          }).catch(function (e: Error) {
               res.send(["ERROR", `/AddWatchListItems: The error ${e.message} occurred while adding the WatchList Item record`]);
               return;
          });
     }
}