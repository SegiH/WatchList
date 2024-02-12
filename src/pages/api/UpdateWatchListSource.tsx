import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const models = getModels();

     const watchListSourceID = typeof req.query.WatchListSourceID !== "undefined" ? req.query.WatchListSourceID : null;
     const watchListSourceName = typeof req.query.WatchListSourceName !== "undefined" ? req.query.WatchListSourceName : null;

     if (watchListSourceID === null) {
          res.send(["ERROR", "WatchList Source ID was not provided"]);
          return;
     } else if (watchListSourceName === null) {
          res.send(["ERROR", "WatchList Source Name was not provided"]);
          return;
     }

     const updatedRowCount = await models.WatchListSources.update(
          { WatchListSourceName: watchListSourceName }
          , {
               //logging: console.log,
               where: { WatchListSourceID: watchListSourceID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchList: The error ${e.message} occurred while updating WatchList Sources with ID ${watchListSourceID}`;
               res.send(["ERROR", errorMsg]);
               return;
          });

     res.send(["OK", updatedRowCount]);
}