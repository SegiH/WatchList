import { NextRequest } from 'next/server';
import { generateMetaData, getRapidAPIKey, isLoggedIn } from '../lib';

export async function GET(request: NextRequest) {
    if (!isLoggedIn(request)) {
        return Response.json(["ERROR", "Error. Not signed in"]);
    }

    const rapidapi_key = await getRapidAPIKey();

    if (rapidapi_key === "") {
        return Response.json(["OK", []]);
    }

    const metaData = await generateMetaData();

    return Response.json(["OK", metaData]);
}