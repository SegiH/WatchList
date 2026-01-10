import { cookies } from 'next/headers';

export async function GET() {
     const currentCookies = await cookies();
     currentCookies.delete('userData');

     return Response.json(["OK"]);
}