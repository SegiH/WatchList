'use server'

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
     cookies().delete('userData');

     return Response.json(["OK"]);
}