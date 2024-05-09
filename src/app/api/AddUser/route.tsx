import { NextRequest } from 'next/server';

import { addUser } from "../lib";

/**
 * @swagger
 * /api/AddUser:
 *    put:
 *        tags:
 *          - Users
 *        summary: Add a user
 *        description: Add a user
 *        parameters:
 *           - name: wl_username
 *             in: query
 *             description: New username
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_realname
 *             in: query
 *             description: Name of the user
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_password
 *             in: query
 *             description: New password
 *             required: true
 *             schema:
 *                  type: string
 *           - name: wl_admin
 *             in: query
 *             description: Whether the new user is an admin
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     return addUser(request);
}