import { NextApiRequest, NextApiResponse } from 'next'
import { getModels } from "./default";
import WatchListType from "../../app/interfaces/IWatchListType";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const watchListTypeName = typeof req.query.WatchListTypeName !== "undefined" ? req.query.WatchListTypeName : null;

     if (watchListTypeName === null) {
          res.send(["ERROR", "WatchList Source Name was not provided"]);
          return;
     }

     await models.WatchListTypes.create({
          WatchListTypeName: watchListTypeName
     }).then((result: WatchListType) => {
          // Return ID of newly inserted row
          res.send(["OK", result.WatchListTypeID]);
     }).catch(function (e: Error) {
          const errorMsg = `/AddWatchListType: The error ${e.message} occurred while adding the WatchList Type record`;
          console.error(errorMsg);
     });
}