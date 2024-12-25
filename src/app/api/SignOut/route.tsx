'use server'

import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/SignOut:
 *    get:
 *        tags:
 *          - Users
 *        summary: Sign the current user out
 *        description: Sign the current user out
 *        responses:
 *          200:
 *            description: '["OK",""] on success'
 */
export async function GET() {
     const currentCookies = await cookies();
     currentCookies.delete('userData');

     return Response.json(["OK"]);
}