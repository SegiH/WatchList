import { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from "./default";
import { DBFile } from './default';
import { DBType } from './default';
import fs from 'fs';

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     if (DBType === "SQLite") {
          try {
               if (fs.existsSync(DBFile)) {
                    res.send(["ERROR", `Error! The WatchList database file already exists. Please move or rename this file`]);
                    return;
               }
          } catch (err) {
               res.send(["ERROR", err]);
               return;
          }
     }

     addUser(req, res, true);
}