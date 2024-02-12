import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt, DBType, sequelize, validateSettings } from './default';
import cookie from "cookie";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const username = typeof req.headers["wl_username"] !== "undefined" ? req.headers["wl_username"] : null;
     const password = typeof req.headers["wl_password"] !== "undefined" ? req.headers["wl_password"] : null;

     const validationResult = await validateSettings();

     if (validationResult != "") {
          res.send(["ERROR",validationResult]);
          return;
     }

     if (username === null || password === null) {
          return res.status(403).send("Unauthorized 1");
     } else {
          const sanitizedUsername = typeof username === "string" && username.length < 50 ? username : null;
          const sanitizedPassword = typeof password === "string" && password.length < 50 ? password : null;

          if (sanitizedUsername === null) {
               return res.status(403).send("Unauthorized 2");
          }

          if (sanitizedPassword === null) {
               return res.status(403).send("Unauthorized 3");
          }

          try {
               const SQL =
                    DBType === "MSSQL"
                         ? "OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;SELECT TOP(1) UserID,CONVERT(VARCHAR(50),DECRYPTBYKEY(Username)) AS Username,CONVERT(VARCHAR(50),DECRYPTBYKEY(Realname)) AS Realname,Admin FROM Users WHERE :Username = CONVERT(VARCHAR(50),DECRYPTBYKEY(Username))AND :Password = CONVERT(VARCHAR(50),DECRYPTBYKEY(Password)) AND Enabled=1;CLOSE SYMMETRIC KEY WatchListKey"
                         : "SELECT UserID,Username,Password,Realname,Admin FROM Users WHERE Enabled=1 LIMIT 1";

               return new Promise((resolve, reject) => {
                    sequelize
                         .query(SQL)
                         .then((results: any) => {
                              if (results[0].length === 0) {
                                   res.send(["ERROR", "Invalid username or password"]);
                                   return;
                              }

                              // Since the encryption is done in the API, we have to get the username and password and decrypt it in this endpoint
                              const currentUser = results[0].filter((currentUser: any) => {
                                   return sanitizedUsername === decrypt(currentUser.Username) && sanitizedPassword === decrypt(currentUser.Password)
                              });

                              if (currentUser.length !== 1) {
                                   res.send(["ERROR", "Invalid username or password"]);
                                   return;
                              }

                              const userData = {
                                   UserID: currentUser[0].UserID,
                                   Username: decrypt(currentUser[0].Username),
                                   Realname: decrypt(currentUser[0].Realname),
                                   Admin: results[0][0]["Admin"]
                              }

                              res.setHeader('Set-Cookie', cookie.serialize('userData', JSON.stringify(userData)))

                              res.send(["OK", userData]);
                         })
                         .catch(function (err: Error) {
                              console.dir(err);
                              res.send(["ERROR", `/Login: The error ${err} occurred logging in`]);
                         });
               });
          } catch (err: any) {
               return res.status(403).send("Unauthorized 4: " + err.message);
          }
     }
}