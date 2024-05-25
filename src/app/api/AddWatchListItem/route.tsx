import { NextRequest } from 'next/server';
import { execInsert, execSelect, getIMDBDetails } from "../lib";

/**
 * @swagger
 * /api/AddWatchListItem:
 *    put:
 *        tags:
 *          - WatchListItems
 *        summary: Add a WatchListItem record
 *        description: Add a WatchListItem record to add a movie/TV show
 *        parameters:
 *           - name: WatchListItemName
 *             in: query
 *             description: New WatchListItem Name (name of the movie or TV Show)
 *             required: true
 *             schema:
 *                  type: string
 *           - name: WatchListTypeID
 *             in: query
 *             description: Type ID of the movie/show
 *             required: true
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
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const name = searchParams.get("WatchListItemName");
     const type = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("Notes");

     if (name === null) {
          return Response.json(["ERROR", "Name was not provided"]);
     } else if (type === null) {
          return Response.json(["ERROR", "Type was not provided"]);
     } else {
          if (imdb_url !== null) {
               const existingWatchListItem = await execSelect("SELECT * FROM WatchListItems WHERE IMDB_URL=?", [imdb_url]);

               if (existingWatchListItem.length > 0) {
                    return Response.json(["ERROR-ALREADY-EXISTS", `The URL ${imdb_url} already exists with the name ${existingWatchListItem[0].WatchListItemName} and the ID ${existingWatchListItem[0].WatchListItemID}. It was NOT added!`]);
               }
          }

          let imdb_json: string | null = null;

          if (imdb_url !== null && imdb_url.toString().indexOf("imdb.com/title/") !== -1) {
               const urlSplit = imdb_url?.split("/");

               if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
                    const id = urlSplit[4].toString();

                    const result = await getIMDBDetails(id);

                    if (result[0] === "OK" && result[1][0] === "OK") {
                         imdb_json = JSON.stringify(result[1][1]);
                    }
               }
          }

          const SQL="INSERT INTO WatchListItems(WatchListItemName, WatchListTypeID, IMDB_URL, IMDB_Poster, IMDB_JSON, ItemNotes, Archived) VALUES(?, ?, ?, ?, ?, ?, ?);";

          const params = [name, type, imdb_url, imdb_poster, imdb_json, notes, 0];

          const result = await execInsert(SQL, params);

          const newID = result.lastID;

          return Response.json(["OK", newID]);
     }
}