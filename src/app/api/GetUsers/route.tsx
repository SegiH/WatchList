import { NextRequest } from 'next/server';
import { getDB, decrypt, getUserID, isUserAdmin, writeLog } from "../lib";
import IUser from '../../interfaces/IUser';

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     const isAdminResult = await isUserAdmin(request);

     if (!isAdminResult) {
          return Response.json(["ERROR", "Access denied"]);
     }

     const admin = searchParams.get("Admin");
     const enabled = searchParams.get("Enabled");
     const userID = await getUserID(request);

     if (typeof userID != "number") {
          return Response.json(["ERROR", "Access denied due to unexpected non number"]);
     }

     let whereClause = '';
     const params: string[] = [];

     if (enabled !== null) {
          whereClause = "WHERE Enabled=?";
          params.push(enabled);
     }

     if (admin !== null) {
          whereClause = (whereClause === '' ? 'WHERE ' : ' AND ') + 'Admin=?';
          params.push(admin);
     }

     try {
          const db: any = await getDB();

          const usersDB = db.Users;

          const decryptedUsers: IUser[] = [];

          usersDB.map((currentUser: IUser) => {
               decryptedUsers.push({
                    UserID: currentUser.UserID,
                    Username: decrypt(currentUser.Username),
                    Realname: decrypt(currentUser.Realname),
                    Password: "",
                    Admin: currentUser.Admin,
                    Enabled: currentUser.Enabled,
                    IsModified: 0,
                    Options: currentUser.Options
               });
          }).sort((a: IUser, b: IUser) => {
               return b.UserID < a.UserID ? -1 : 1;
          });

          return Response.json(["OK", decryptedUsers]);
     } catch (e: any) {
          writeLog(e.message);
          return Response.json(["ERROR", e.message]);
     }
}