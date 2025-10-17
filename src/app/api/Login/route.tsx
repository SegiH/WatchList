import { headers } from 'next/headers'

import { login, validateSettings } from '../lib';

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