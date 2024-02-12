import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt } from './default';
import { getModels } from "./default";
import { getUserSession } from './default';

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const models = getModels();
     const userSession = await getUserSession(req, res);

     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin === false)) {
          res.send(["ERROR", "Access denied"]);
          return;
     }

     const userID = typeof req.query.wl_userid !== "undefined" ? req.query.wl_userid : null;
     const userName = typeof req.query.wl_username !== "undefined" ? req.query.wl_username : null;
     const realName = typeof req.query.wl_realname !== "undefined" ? req.query.wl_realname : null;
     const password = typeof req.query.wl_password !== "undefined" ? req.query.wl_password : null;
     const admin = typeof req.query.wl_admin !== "undefined" && (req.query.wl_admin === "true" || req.query.wl_admin === "false") ? (req.query.wl_admin === "true" ? 1 : 0) : null;
     const enabled = typeof req.query.wl_enabled !== "undefined" && (req.query.wl_enabled === "true" || req.query.wl_enabled === "false") ? (req.query.wl_enabled === "true" ? 1 : 0) : null;

     if (userID === null) {
          res.send(["ERROR", "User ID was not provided"]);
          return;
     }

     const updateColumns: any = {};

     if (userName !== null) {
          updateColumns["Username"] = encrypt(String(userName));
     }

     if (realName !== null) {
          updateColumns["Realname"] = encrypt(String(realName));
     }

     if (password !== null) {
          updateColumns["Password"] = encrypt(String(password));
     }

     if (admin !== null) {
          updateColumns["Admin"] = admin;
     }

     if (enabled !== null) {
          updateColumns["Enabled"] = enabled;
     }

     if (Object.keys(updateColumns).length == 0) {
          res.send(["ERROR", "No params were passed"]);
          return;
     }

     const updatedRowCount = await models.Users.update(
          updateColumns
          , {
               where: { UserID: userID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateUser: The error ${e.message} occurred while updating User with ID ${userID}`;
               res.send(["ERROR", errorMsg]);
               return;
          });

     res.send(["OK", updatedRowCount]);
}