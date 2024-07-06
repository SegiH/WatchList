import { NextRequest } from 'next/server';
import { execInsert } from "../lib";

/**
 * @swagger
 * /api/AddWatchListType:
 *    put:
 *        tags:
 *          - WatchListTypes
 *        summary: Add a WatchListItem Type
 *        description: Add a WatchListItem Type to indicate where a movie/show was watched at
 *        parameters:
 *           - name: WatchListTypeName
 *             in: query
 *             description: New WatchListType Name
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListTypeName = searchParams.get("WatchListTypeName");

     if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList WatchListType Name was not provided"]);
     }

     const SQL = "INSERT INTO WatchListTypes(WatchListTypeName) VALUES(?);";
     const params = [watchListTypeName];

     const result = await execInsert(SQL, params);

     const newID = result.lastID;

     return Response.json(["OK", newID]);
}