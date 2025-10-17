import { NextRequest } from 'next/server';
import { getDB, logMessage } from '../lib';

export async function GET(request: NextRequest) {
     // This needs to be here even though this endpoint doesn't take any parameters because without this,
     // when you do 'npm run build', Next.js will compile this route as a static route which causes a bug where
     // repeated calls to this endpoint return stale data even after the DB  has been updated.
     const searchParams = request.nextUrl.searchParams;

     try {
          const db: any = await getDB();

          return Response.json(["OK", db.WatchListTypes]);
     } catch (e) {
          logMessage(e)
          return Response.json(["OK", []]);
     }
}