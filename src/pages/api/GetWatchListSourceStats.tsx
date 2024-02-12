import { NextApiRequest, NextApiResponse } from 'next';
import { getUserID } from './default';
import { sequelize } from './default';

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const userID = await getUserID(req, res);

     const getDetail = typeof req.query.GetDetail !== "undefined" && req.query.GetDetail === "true" ? 1 : 0;

     if (userID === null) {
          res.send(["ERROR", "User ID is not set"]);
          return;
     }

     const SQL = "SELECT WatchList.WatchListSourceID, WatchListSources.WatchListSourceName, COUNT(WatchList.WatchListSourceID) AS SourceCount FROM WatchList LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID WHERE UserID=:UserID AND  WatchListSources.WatchListSourceName IS NOT NULL GROUP BY WatchList.WatchListSourceID,WatchListSources.WatchListSourceName ORDER BY SourceCount DESC";

     const detailSQL = "SELECT * FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID WHERE UserID=:UserID ORDER BY StartDate DESC";

     sequelize.query(!getDetail ? SQL : detailSQL, { replacements: { UserID: userID } })
          .then((results: any) => {
               res.send(results[0]);
          })
          .catch(function (err) {
               res.send(["ERROR", `/GetWatchListSourceStats: The error ${err.message} occurred getting the WatchList Source Stats`]);
          });
}