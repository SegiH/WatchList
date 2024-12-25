import { headers } from 'next/headers'

import { login, validateSettings } from '../lib';

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
     const headersList = await headers();

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

          return login(sanitizedUsername, sanitizedPassword);
     }
}