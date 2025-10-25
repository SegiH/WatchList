import { getDB, defaultSources, isLoggedIn, writeDB, logMessage } from "../lib";
import { NextRequest } from 'next/server';
import { sendCompressedJsonBrotli, sendCompressedJsonGZip } from '@/app/proxy';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     try {
          const db: any = await getDB();

          if (db.WatchListSources.length === 0) {
               defaultSources.forEach(async (element, index) => {
                    db.WatchListSources.push({
                         "WatchListSourceID": (index + 1),
                         "WatchListSourceName": element
                    });
               });

               writeDB(db);
          }

          if (process.env.NODE_ENV === 'development') {
               return Response.json(["OK", db.WatchListSources]);
          } else {
               // Return gzipped results
               const compressedData = await sendCompressedJsonBrotli(["OK", db.WatchListSources]);

               return new Response(compressedData as unknown as BodyInit, {
                    status: 200,
                    headers: {
                         'Content-Type': 'application/json',
                         'Content-Encoding': 'br', // use 'gzip' when using gzip
                    },
               });
          }
     } catch (e) {
          logMessage(e)
          return Response.json(["OK", []]);
     }
}