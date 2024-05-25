import { NextRequest } from 'next/server';
import { execInsert } from "../lib";

/**
 * @swagger
 * /api/AddWatchListSource:
 *    put:
 *        tags:
 *          - WatchListSources
 *        summary: Add a WatchListItem source
 *        description: Add a WatchListItem source to indicate where a movie/show was watched at
 *        parameters:
 *           - name: WatchListSourceName
 *             in: query
 *             description: New WatchListSource Name
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListSourceName = searchParams.get("WatchListSourceName");

     if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     const SQL = "INSERT INTO WatchListSources(WatchListSourceName) VALUES(?);";
     const params = [watchListSourceName];

     const result = await execInsert(SQL, params);

     const newID = result.lastID;

     return Response.json(["OK", newID]);
}