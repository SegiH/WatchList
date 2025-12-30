import { NextRequest } from 'next/server';
import { generateMetaData, isLoggedIn } from '../lib';

export async function GET(request: NextRequest) {
    if (!isLoggedIn(request)) {
        return Response.json(["ERROR", "Error. Not signed in"]);
    }

    const metaData = await generateMetaData();

    return Response.json(["OK", metaData]);
}