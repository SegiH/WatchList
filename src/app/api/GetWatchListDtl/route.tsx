import { NextRequest } from 'next/server';
import { execSelect } from "../lib";

/**
 * @swagger
 * /api/GetWatchListDtl:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get WatchList record based on the provided WatchListID
 *        description: Get WatchList record based on the provided WatchListID
 *        parameters:
 *           - name: WatchListID
 *             in: query
 *             description: WatchList ID of the record to return
 *             required: true
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListID = searchParams.get("WatchListID");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
     }
     
     const SQL = `SELECT WatchList.*,WatchListItems.WatchListItemName,WatchListItems.WatchListTypeID,IMDB_URL, IMDB_Poster, IMDB_JSON, ItemNotes, WatchListSourceName, WatchListTypeName FROM WatchList
                LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID
                LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID
                LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID
                WHERE WatchListID=?
                `;
                
     try {
          const results = await execSelect(SQL, [watchListID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListDtl: The error ${e.message} occurred getting the WatchList Detail`]);
     }
}