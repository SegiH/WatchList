import { NextRequest } from 'next/server';
import { decrypt, getModels, getUserID } from "../lib";
import User from "../../interfaces/IUser";

export async function GET(request: NextRequest) {
     const models = getModels();

     const searchParams = request.nextUrl.searchParams;

     const admin = searchParams.get("Admin");
     const enabled = searchParams.get("Enabled");
     const userID = await getUserID(request);

     if (typeof userID != "number") {
          return Response.json(["ERROR", "Access denied"]);
     }

     return models.Users.findAll({
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

          return Response.json(decryptedUsers);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetUsers: The error ${err} occurred getting the users`]);
     });
}