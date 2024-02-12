import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const models = getModels();

     const watchListID = typeof req.query.WatchListID !== "undefined" ? req.query.WatchListID : null;
     const watchListItemID = typeof req.query.WatchListItemID !== "undefined" ? req.query.WatchListItemID : null;
     const startDate = typeof req.query.StartDate !== "undefined" ? req.query.StartDate : null;
     const endDate = typeof req.query.EndDate !== "undefined" ? req.query.EndDate : null; // Optional
     const sourceID = typeof req.query.WatchListSourceID !== "undefined" ? req.query.WatchListSourceID : null;
     const season = typeof req.query.Season !== "undefined" ? req.query.Season : null;
     const archived = typeof req.query.Archived !== "undefined" ? req.query.Archived : null;
     const rating = typeof req.query.Rating !== "undefined" ? req.query.Rating : null;
     const notes = typeof req.query.Notes !== "undefined" ? req.query.Notes : null;

     if (watchListID === null) {
          res.send(["ERROR", "WatchList ID was not provided"]);
          return;
     }

     const updateColumns: any = {};

     if (watchListItemID !== null) {
          updateColumns['WatchListItemID'] = watchListItemID;
     }

     if (startDate !== null) {
          updateColumns['StartDate'] = startDate;
     }

     if (endDate !== null) {
          updateColumns['EndDate'] = endDate;
     }

     if (sourceID !== null) {
          updateColumns['WatchListSourceID'] = sourceID;
     }

     if (season !== null) {
          updateColumns['Season'] = season;
     }

     if (archived !== null) {
          updateColumns['Archived'] = (archived === "true" ? 1 : 0);
     }

     if (rating !== null) {
          updateColumns['Rating'] = rating;
     }

     if (notes !== null) {
          updateColumns['Notes'] = notes;
     }

     if (Object.keys(updateColumns).length == 0) { // No params were passed except for the mandatory column
          res.send(["ERROR", "No params were passed"]);
          return;
     }

     const updatedRowCount = await models.WatchList.update(
          updateColumns
          , {
               //logging: console.log,
               where: { WatchListID: watchListID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchList: The error ${e.message} occurred while updating WatchList with ID ${watchListID}`;
               res.send(["ERROR", errorMsg]);
               return;
          });

     res.send(["OK", updatedRowCount]);
}