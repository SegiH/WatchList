import { NextRequest } from 'next/server';
import { encrypt, getDB, isUserAdmin, writeLog, writeDB } from "../lib";
import IUser from '@/app/interfaces/IUser';

export async function PUT(request: NextRequest) {
     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     const isAdminResult = await isUserAdmin(request);

     if (!isAdminResult) {
          return Response.json(["ERROR", "Access denied"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const userID = searchParams.get("wl_userid");
     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const admin = typeof searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true" || searchParams.get("wl_admin") === "false") ? (searchParams.get("wl_admin") === "true" ? 1 : 0) : null;
     const enabled = typeof searchParams.get("wl_enabled") !== "undefined" && (searchParams.get("wl_enabled") === "true" || searchParams.get("wl_enabled") === "false") ? (searchParams.get("wl_enabled") === "true" ? 1 : 0) : null;

     if (userID === null) {
          return Response.json(["ERROR", "User ID was not provided"]);
     }

     try {
          const db: any = await getDB();

          const usersDB = db.Users;

          const userResult = usersDB.filter((user: IUser) => {
               return String(user.UserID) === String(userID)
          });

          if (userResult.length !== 1) {
               return Response.json(["ERROR", "Unable to get the existing user record"]);
          }

          const user = userResult[0];

          if (userName !== null) {
               user.Username = encrypt(String(userName));
          }

          if (realName !== null) {
               user.Realname = encrypt(String(realName));
          }

          if (password !== null) {
               user.Password = encrypt(String(password));
          }

          if (admin !== null) {
               user.Admin = admin;
          }

          if (enabled !== null) {
               user.Enabled = enabled;
          }

          writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          writeLog(e.message)
          return Response.json(["ERROR", e.message]);
     }
}