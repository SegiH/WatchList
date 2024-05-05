import { NextRequest } from 'next/server';

import { addUser } from "../lib";

export async function PUT(request: NextRequest) {
     addUser(request);
}