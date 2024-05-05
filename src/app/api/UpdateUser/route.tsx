import { NextRequest } from 'next/server';
import { encrypt, getModels, getUserSession} from "../lib";

export async function PUT(request: NextRequest) {
     const models = getModels();
     const userSession = await getUserSession(request);

     // Only admins can call this endpoint. this is to prevent a non-admin from making themselves an admin
     if (typeof userSession === "undefined" || (typeof userSession !== "undefined" && userSession.Admin === false)) {
          return Response.json(["ERROR", "Access denied"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const userID = searchParams.get("wl_userid");
     const userName = searchParams.get("wl_username");
     const realName = searchParams.get("wl_realname");
     const password = searchParams.get("wl_password");
     const admin = typeof searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true" || searchParams.get("wl_admin") === "false") ? (searchParams.get("wl_admin")=== "true" ? 1 : 0) : null;
     const enabled = typeof searchParams.get("wl_enabled") !== "undefined" && (searchParams.get("wl_enabled") === "true" || searchParams.get("wl_enabled") === "false") ? (searchParams.get("wl_enabled") === "true" ? 1 : 0) : null;

     if (userID === null) {
          return Response.json(["ERROR", "User ID was not provided"]);
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
          return Response.json(["ERROR", "No params were passed"]);
     }

     const updatedRowCount = await models.Users.update(
          updateColumns
          , {
               where: { UserID: userID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateUser: The error ${e.message} occurred while updating User with ID ${userID}`;
               return Response.json(["ERROR", errorMsg]);
          });

     return Response.json(["OK", updatedRowCount]);
}