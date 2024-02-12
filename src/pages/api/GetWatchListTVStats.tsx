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

     const SQL =
          `WITH GetFrequentItems AS (SELECT UserID,WLI.WatchListItemName,MIN(StartDate) AS StartDate,MAX(StartDate) AS EndDate,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE WLI.WatchListTypeID=2 AND WL.EndDate IS NOT NULL GROUP BY UserID,WatchListItemName) SELECT ${DBType === "MSSQL" ? ` TOP(10) ` : ``} *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=:UserID AND ItemCount > 1 ORDER BY ItemCount DESC ${DBType == "SQLite" ? " LIMIT 10" : ""}`;

     sequelize
          .query(SQL, { replacements: { UserID: userID } })
          .then((results) => {
               res.send(results[0]);
          })
          .catch(function (err) {
               res.send(["ERROR", `/GetWatchListTVStats: The error ${err.message} occurred getting the WatchList TV Stats`]);
          });
}