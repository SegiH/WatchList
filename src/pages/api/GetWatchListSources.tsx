import { NextApiRequest, NextApiResponse } from 'next';
import WatchListSource from "../../app/interfaces/IWatchListSource";
import { getModels } from "./default";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     models.WatchListSources.findAll({
          order: [["WatchListSourceName", "DESC"]],
     }).then((results: WatchListSource) => {
          res.send(results);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetWatchListSources: The error ${err.message} occurred getting the WatchList Sources`]);
     });
}