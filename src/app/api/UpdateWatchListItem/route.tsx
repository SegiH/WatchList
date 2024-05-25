import { NextRequest } from 'next/server';
import { execUpdateDelete } from "../lib";

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
     }

     let columns = "";
     const values: any = [];

     if (name !== null) {
          columns += (columns !== "" ? "," : "") + "WatchListItemName=?";
          values.push(name);
     }
     
     if (typeID !== null) {
          columns += (columns !== "" ? "," : "") + "WatchListTypeID=?";
          values.push(typeID);
     }

     if (imdb_url !== null) {
          columns += (columns !== "" ? "," : "") + "IMDB_URL=?";
          values.push(imdb_url);
     }

     if (imdb_poster !== null) {
          columns += (columns !== "" ? "," : "") + "IMDB_Poster=?";
          values.push(imdb_poster);
     }

     if (imdb_json !== null) {
          columns += (columns !== "" ? "," : "") + "IMDB_JSON=?";
          values.push(imdb_json);
     }

     if (notes !== null) {
          columns += (columns !== "" ? "," : "") + "ItemNotes=?";
          values.push(notes);
     }

     if (archived !== null) {
          columns += (columns !== "" ? "," : "") + "Archived=?";
          values.push(archived);
     }

     if (values.length === 0) {
          return Response.json(["ERROR", `No parameters were passed`]);
     }

     values.push(watchListItemID);

     try {
          const sql = `UPDATE WatchListItems SET ${columns} WHERE WatchListItemID=?`;

          await execUpdateDelete(sql, values);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `/UpdateWatchListItem: The error occurred updating the WatchList Item with ID ${watchListItemID} with the error ${e.message}`]);
     }
}