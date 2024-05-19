import { NextRequest } from 'next/server';
import { getModels } from "../lib";

/**
 * @swagger
 * /api/UpdateWatchListItem:
 *    put:
 *        tags:
 *          - WatchListItems
 *        summary: Update a WatchListItem record
 *        description: Update a WatchListItem record
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchListItem ID
 *             required: true
 *             schema:
 *                  type: string
 *           - name: WatchListItemName
 *             in: query
 *             description: WatchListItem Name
 *             required: false
 *             schema:
 *                  type: string
 *           - name: WatchListTypeID
 *             in: query
 *             description: Type ID of the movie/show
 *             required: false
 *             schema:
 *                  type: number
 *           - name: IMDB_URL
 *             in: query
 *             description: IMDB URL of the movie/show
 *             required: false
 *             schema:
 *                  type: number
 *           - name: IMDB_Poster
 *             in: query
 *             description: IMDB Poster of the movie/show
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Notes
 *             in: query
 *             description: Notes for the movie/show
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Archived
 *             in: query
 *             description: Archived status
 *             required: false
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const models = getModels();
     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const name = searchParams.get("WatchListItemName");
     const typeID = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("ItemNotes");
     const archived = searchParams.get("Archived");
     const imdb_json = searchParams.get("IMDB_JSON");

     if (watchListItemID === null) {
          return Response.json(["ERROR", "ID was not provided"]);
     } else {
          const updateColumns: any = {};

          if (name !== null) {
               updateColumns['WatchListItemName'] = name;
          }

          if (typeID !== null) {
               updateColumns['WatchListTypeID'] = typeID;
          }

          if (imdb_url !== null) {
               updateColumns['IMDB_URL'] = imdb_url;
          }

          if (imdb_poster !== null) {
               updateColumns['IMDB_Poster'] = imdb_poster;
          }

          if (notes !== null) {
               updateColumns['ItemNotes'] = notes;
          }

          if (archived !== null) {
               updateColumns['Archived'] = archived;
          }

          if (imdb_json !== null) {
               updateColumns['IMDB_JSON'] = imdb_json;
          }

          if (Object.keys(updateColumns).length == 0) { // No params were passed except for the mandatory column
               return Response.json(["ERROR", "No params were passed"]);
          }

          const updatedRowCount = await models.WatchListItems.update(
               updateColumns
               , {
                    where: { WatchListItemID: watchListItemID }
               }).catch(function (e: Error) {
                    const errorMsg = `/UpdateWatchListItems: The error ${e.message} occurred while updating WatchList Item with ID ${watchListItemID}`;
                    return Response.json(["ERROR", errorMsg]);
               });

          return Response.json(["OK", updatedRowCount]);
     }
}