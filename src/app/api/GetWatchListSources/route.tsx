import { getDB, defaultSources, isLoggedIn, writeDB, logMessage } from "../lib";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     try {
          const db = getDB();

          if (db.WatchListSources.length === 0) {
               defaultSources.forEach(async (element, index) => {
                    db.WatchListSources.push({
                         "WatchListSourceID": (index + 1),
                         "WatchListSourceName": element
                    });
               });

               writeDB(db);
          }

          return Response.json(["OK", db.WatchListSources]);
     } catch (e) {
          logMessage(e)
          return Response.json(["OK", []]);
     }
}