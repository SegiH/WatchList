import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     models.WatchListTypes.findAll({
          order: [["WatchListTypeName", "DESC"]],
     }).then((results: any) => {
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchListTypes: The error ${err.message} occurred getting the WatchList Types`]);
     });
}