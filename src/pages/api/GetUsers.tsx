import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from './default';
import { getModels } from "./default";
import { getUserID } from './default';
import User from "../../app/interfaces/IUser";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const admin = typeof req.query.Admin !== "undefined" ? req.query.Admin : null;
     const enabled = typeof req.query.Enabled !== "undefined" ? req.query.Enabled : null;
     const userID = await getUserID(req, res);

     if (typeof userID != "number") {
          res.send(["ERROR", "Access denied"]);
          return;
     }

     models.Users.findAll({
          attributes: ['UserID', 'Username', 'Realname', 'Admin', 'Enabled'],
          where: {
               ...(enabled !== null && {
                    Enabled: enabled,
               }),
               ...(admin !== null && {
                    Admin: admin,
               }),
          },
     }).then((results: User[]) => {
          // Decrypt the encrypt values
          const decryptedUsers = results.map((currentUser: any) => {
               currentUser.Username = decrypt(currentUser.Username);
               currentUser.Realname = decrypt(currentUser.Realname);
               return currentUser;
          });

          res.send(decryptedUsers);
     }).catch(function (err: Error) {
          res.send(["ERROR", `/GetUsers: The error ${err} occurred getting the users`]);
     });
}