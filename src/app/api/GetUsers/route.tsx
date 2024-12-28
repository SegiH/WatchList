import { NextRequest } from 'next/server';
import { decrypt, execSelect, getUserID, isUserAdmin } from "../lib";
import User from "../../interfaces/IUser";
import IUser from '../../interfaces/IUser';

/**
 * @swagger
 * /api/GetUsers:
 *    get:
 *        tags:
 *          - Users
 *        summary: Get all users
 *        description: Get all users
 *        parameters:
 *           - name: Admin
 *             in: query
 *             description: Filter on admin status
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Enabled
 *             in: query
 *             description: Filter on Enabled status
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
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
          return Response.json(["ERROR", "Access denied"]);
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

     const SQL = `SELECT UserID, Username, Realname, Admin, Enabled FROM Users ${whereClause}`;

     try {
          const results: User[] = await execSelect(SQL, params);

          // Decrypt the encrypt values
          const decryptedUsers = results.map((currentUser: IUser) => {
               currentUser.Username = decrypt(currentUser.Username);
               currentUser.Realname = decrypt(currentUser.Realname);
               return currentUser;
          });

          return Response.json(["OK", decryptedUsers]);
     } catch (e) {
          return Response.json(["ERROR", `An error occurred getting the users with the error ${e.message}`]);
     }
}