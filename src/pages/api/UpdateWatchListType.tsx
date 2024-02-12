import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const models = getModels();

     const watchListTypeID = typeof req.query.WatchListTypeID !== "undefined" ? req.query.WatchListTypeID : null;
     const watchListTypeName = typeof req.query.WatchListTypeName !== "undefined" ? req.query.WatchListTypeName : null;

     if (watchListTypeID === null) {
          res.send(["ERROR", "WatchList Type ID was not provided"]);
          return;
     } else if (watchListTypeName === null) {
          res.send(["ERROR", "WatchList Type Name was not provided"]);
          return;
     }

     const updatedRowCount = await models.WatchListTypes.update(
          { WatchListTypeName: watchListTypeName }
          , {
               //logging: console.log,
               where: { WatchListTypeID: watchListTypeID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchList: The error ${e.message} occurred while updating WatchList Types with ID ${watchListTypeID}`;
               res.send(["ERROR", errorMsg]);
               return;
          });

     res.send(["OK", updatedRowCount]);
}