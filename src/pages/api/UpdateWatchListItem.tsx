import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const models = getModels();

     const watchListItemID = typeof req.query.WatchListItemID !== "undefined" ? req.query.WatchListItemID : null;
     const name = typeof req.query.WatchListItemName !== "undefined" ? req.query.WatchListItemName : null;
     const typeID = typeof req.query.WatchListTypeID !== "undefined" ? req.query.WatchListTypeID : null;
     const imdb_url = typeof req.query.IMDB_URL !== "undefined" ? req.query.IMDB_URL : null;
     const imdb_poster = typeof req.query.IMDB_Poster !== "undefined" ? req.query.IMDB_Poster : null;
     const notes = typeof req.query.ItemNotes !== "undefined" ? req.query.ItemNotes : null;
     const archived = typeof req.query.Archived !== "undefined" ? req.query.Archived : null;

     if (watchListItemID === null) {
          res.send(["ERROR", "ID was not provided"]);
          return;
     } else {
          const updateColumns: any = {};

          if (name !== null) {
               updateColumns['WatchListItemName'] = name;
          }

          if (typeID !== null) {
               updateColumns['WatchListTypeID'] = typeID;
          }

          if (imdb_url !== null) {
               updateColumns['IMDB_URL'] = imdb_url;
          }

          if (imdb_poster !== null) {
               updateColumns['IMDB_Poster'] = imdb_poster;
          }

          if (notes !== null) {
               updateColumns['ItemNotes'] = notes;
          }

          if (archived !== null) {
               updateColumns['Archived'] = archived;
          }

          if (Object.keys(updateColumns).length == 0) { // No params were passed except for the mandatory column
               res.send(["ERROR", "No params were passed"]);
               return;
          }

          const updatedRowCount = await models.WatchListItems.update(
               updateColumns
               , {
                    where: { WatchListItemID: watchListItemID }
               }).catch(function (e: Error) {
                    const errorMsg = `/UpdateWatchListItems: The error ${e.message} occurred while updating WatchList Item with ID ${watchListItemID}`;
                    res.send(["ERROR", errorMsg]);
                    return;
               });

          res.send(["OK", updatedRowCount]);
     }
}