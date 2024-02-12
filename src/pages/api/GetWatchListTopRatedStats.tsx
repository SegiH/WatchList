import { NextApiRequest, NextApiResponse } from 'next';
import { DBType } from './default';
import { getUserID } from './default';
import { sequelize } from './default';

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const userID = await getUserID(req, res);

     if (userID === null) {
          res.send(["ERROR", "User ID is not set"]);
          return;
     }

     const SQL = `SELECT ${DBType === "MSSQL" ? ` TOP(10) ` : ``} WatchListItemName,Season,Rating,IMDB_URL FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID WHERE Rating IS NOT NULL AND UserID=:UserID ORDER BY Rating DESC ${DBType == "SQLite" ? " LIMIT 10" : ""}`;

     sequelize
          .query(SQL, { replacements: { UserID: userID } })
          .then((results: any) => {
               res.send(results[0]);
          })
          .catch(function (err) {
               res.send(["ERROR", `/GetWatchListTopRatedStats: The error ${err.message} occurred getting the WatchList Top Rated Stats`]);
          });
}