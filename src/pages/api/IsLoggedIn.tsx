import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { DBFile } from './default';
import { getUserSession, validateSettings } from './default';
import cookie from "cookie";

export const config = {
     api: {
          externalResolver: true,
     },
};

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
     const validationResult = await validateSettings();

     if (validationResult === false) {
          res.send(["ERROR", false]);
          return;
     } else if (validationResult != "") {
          res.send(["ERROR",validationResult]);
          return;
     }

     if (!fs.existsSync(DBFile)) {
          // Clear session cookie if it existed previously but DB doesn't exist
          res.setHeader('Set-Cookie', cookie.serialize('userData', "", {
               maxAge: 0
          }));

          res.send(["ERROR", false]);
          return;
     }

     const userSession = await getUserSession(req, res);

     if (userSession && userSession.UserID) {
          res.send([
               "OK",
               {
                    UserID: userSession.UserID,
                    Username: userSession.UserName,
                    RealName: userSession.RealName,
                    Admin: userSession.Admin,
               },
          ]);
     } else {
          res.send(["ERROR",""]);
     }
}

export default handler;