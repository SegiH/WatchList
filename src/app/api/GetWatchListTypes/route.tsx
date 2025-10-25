import { NextRequest } from 'next/server';
import { getDB, logMessage } from '../lib';
import { sendCompressedJsonBrotli, sendCompressedJsonGZip } from '@/app/proxy';

export async function GET(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     try {
          const db: any = await getDB();

          if (process.env.NODE_ENV === 'development') {
               return Response.json(["OK", db.WatchListTypes]);
          } else {
               // Return gzipped results
               const compressedData = await sendCompressedJsonBrotli(["OK", db.WatchListTypes]);

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