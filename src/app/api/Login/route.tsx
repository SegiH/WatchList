import { cookies, headers } from 'next/headers'

import { decrypt, DBType, sequelize, validateSettings } from '../lib';

/**
 * @swagger
 * /api/Login:
 *    put:
 *        tags:
 *          - Users
 *        summary: Log the user into the WatchList application
 *        description: Log the user into the WatchList application
 *        parameters:
 *           - name: wl_username
 *             in: header
 *             description: Username
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_password
 *             in: header
 *             description: Password
 *             required: true
 *             schema:
 *                  type: string
 *                  format: password
 *        responses:
 *          200:
 *            description: '["OK",{userData}] on success, ["ERROR","error message"] on error'
 */
export async function PUT() {
     const headersList = headers();

     const username = headersList.get("wl_username");
     const password = headersList.get("wl_password");

     const validationResult = await validateSettings();

     if (validationResult != "") {
          return Response.json(["ERROR", validationResult]);
     }

     if (username === null || password === null) {
          return Response.json("Unauthorized 1");
     } else {
          const sanitizedUsername = typeof username === "string" && username.length < 50 ? username : null;
          const sanitizedPassword = typeof password === "string" && password.length < 50 ? password : null;

          if (sanitizedUsername === null) {
               return Response.json("Unauthorized 2");
          }

          if (sanitizedPassword === null) {
               return Response.json("Unauthorized 3");
          }

          try {
               const SQL =
                    DBType === "MSSQL"
                         ? "OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;SELECT TOP(1) UserID,CONVERT(VARCHAR(50),DECRYPTBYKEY(Username)) AS Username,CONVERT(VARCHAR(50),DECRYPTBYKEY(Realname)) AS Realname,Admin FROM Users WHERE :Username = CONVERT(VARCHAR(50),DECRYPTBYKEY(Username))AND :Password = CONVERT(VARCHAR(50),DECRYPTBYKEY(Password)) AND Enabled=1;CLOSE SYMMETRIC KEY WatchListKey"
                         : "SELECT UserID,Username,Password,Realname,Admin FROM Users WHERE Enabled=1 LIMIT 1";

               return sequelize
                    .query(SQL)
                    .then((results: any) => {
                         if (results[0].length === 0) {
                              return Response.json(["ERROR", "Invalid username or password"]);
                         }

                         // Since the encryption is done in the API, we have to get the username and password and decrypt it in this endpoint
                         const currentUser = results[0].filter((currentUser: any) => {
                              return sanitizedUsername === decrypt(currentUser.Username) && sanitizedPassword === decrypt(currentUser.Password)
                         });

                         if (currentUser.length !== 1) {
                              return Response.json(["ERROR", "Invalid username or password"]);
                         }

                         const userData = {
                              UserID: currentUser[0].UserID,
                              Username: decrypt(currentUser[0].Username),
                              Realname: decrypt(currentUser[0].Realname),
                              Admin: results[0][0]["Admin"]
                         }

                         cookies().set('userData', JSON.stringify(userData));

                         return Response.json(["OK", userData]);
                    })
                    .catch(function (err: Error) {
                         console.dir(err);
                         return Response.json(["ERROR", `/Login: The error ${err} occurred logging in`]);
                    });
          } catch (err: any) {
               return Response.json("Unauthorized 4: " + err.message);
          }
     }
}