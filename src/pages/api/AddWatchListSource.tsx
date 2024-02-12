import { NextApiRequest, NextApiResponse } from 'next'
import { getModels } from "./default";
import WatchListSource from "../../app/interfaces/IWatchListSource";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const watchListSourceName = typeof req.query.WatchListSourceName !== "undefined" ? req.query.WatchListSourceName : null;

     if (watchListSourceName === null) {
          res.send(["ERROR", "WatchList Source Name was not provided"]);
          return;
     }

     await models.WatchListSources.create({
          WatchListSourceName: watchListSourceName
     }).then((result: WatchListSource) => {
          // Return ID of newly inserted row
          res.send(["OK", result.WatchListSourceID]);
     }).catch(function (e: Error) {
          const errorMsg = `/AddWatchListSource: The error ${e.message} occurred while adding the WatchList Source record`;
          console.error(errorMsg);
     });
}