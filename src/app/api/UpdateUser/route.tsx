import { NextRequest } from 'next/server';
import { encrypt, execUpdateDelete, getUserSession } from "../lib";

/**
 * @swagger
 * /api/UpdateUser:
 *    put:
 *        tags:
 *          - Users
 *        summary: Add a user
 *        description: Add a user
 *        parameters:
 *           - name: wl_userid
 *             in: query
 *             description: New user id
 *             required: true
 *             schema:
 *                  type: number
 *           - name: wl_username
 *             in: query
 *             description: Updated username
 *             required: false
 *             schema:
 *                  type: string
 *           - name: wl_realname
 *             in: query
 *             description: Updated name of the user
 *             required: false
 *             schema:
 *                  type: string
 *           - name: wl_password
 *             in: query
 *             description: Updated password
 *             required: false
 *             schema:
 *                  type: string
 *           - name: wl_admin
 *             in: query
 *             description: Update whether the user is an admin
 *             required: false
 *             schema:
 *                  type: string
 *           - name: wl_enabled
 *             in: query
 *             description: Update whether the user account is enabled
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
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
     const admin = typeof searchParams.get("wl_admin") !== "undefined" && (searchParams.get("wl_admin") === "true" || searchParams.get("wl_admin") === "false") ? (searchParams.get("wl_admin") === "true" ? 1 : 0) : null;
     const enabled = typeof searchParams.get("wl_enabled") !== "undefined" && (searchParams.get("wl_enabled") === "true" || searchParams.get("wl_enabled") === "false") ? (searchParams.get("wl_enabled") === "true" ? 1 : 0) : null;

     if (userID === null) {
          return Response.json(["ERROR", "User ID was not provided"]);
     }

     let columns = "";
     const values: any = [];

     if (userName !== null) {
          columns += (columns !== "" ? "," : "") + "Username=?";
          values.push(encrypt(String(userName)));
     }

     if (realName !== null) {
          columns += (columns !== "" ? "," : "") + "Realname=?";
          values.push(encrypt(String(realName)));
     }

     if (password !== null) {
          columns += (columns !== "" ? "," : "") + "Password=?";
          values.push(encrypt(String(password)));
     }

     if (admin !== null) {
          columns += (columns !== "" ? "," : "") + "Admin=?";
          values.push(admin);
     }

     if (enabled !== null) {
          columns += (columns !== "" ? "," : "") + "Enabled=?";
          values.push(enabled);
     }

     if (values.length === 0) {
          return Response.json(["ERROR", `No parameters were passed`]);
     }

     values.push(userID);

     try {
          const sql = `UPDATE Users SET ${columns} WHERE UserID=?`;

          await execUpdateDelete(sql, values);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `An error occurred updating the User with ID ${userID} with the error ${e.message}`]);
     }
}