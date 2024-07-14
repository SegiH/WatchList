import { NextRequest } from 'next/server';
import { execSelect, execUpdateDelete, getIMDBDetails, isLoggedIn } from "../lib";
import WatchListItem from "../../interfaces/IWatchListItem";

/**
 * @swagger
 * /api/UpdateAllFromIMDB:
 *    get:
 *        tags:
 *          - Search
 *        summary: Update all items from IMDB based on the IMDB ID
 *        description: Update all items from IMDB based on the IMDB ID
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: falses
 *             schema:
 *                  type: string
 *           - name: ConfirmUpdate
 *             in: query
 *             description: If WatchListItemID was not provided, all items are updated. ConfirmUpdate=true must be provided to confirm that you want to update all items because each WatchListItems' IMDB ID is used to make an IP call
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK", ""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const confirmUpdate = searchParams.get("ConfirmUpdate");

     if (watchListItemID === null && confirmUpdate === null) {
          return Response.json(["ERROR", `WatchListItemID was not passed and confirmUpdate was not passed. Either one must be provided`]);
     }

     if (watchListItemID === null && confirmUpdate !== "true") {
          return Response.json(["ERROR", `confirmUpdate was provided but is not true`]);
     }

     try {
          if (watchListItemID !== null && isNaN(parseInt(watchListItemID, 10))) {
               return Response.json(["ERROR", `WatchListItemID is not a number`]);
          }
     } catch (e) {
          return Response.json(["ERROR", `WatchListItemID is not a number`]);
     }

     // Get all WatchListItems
     const wli = await execSelect("SELECT * FROM WatchListItems", []);

     if (watchListItemID !== null) {
          // Validate the WatchListItem ID
          const currentWatchListItemResult = wli?.filter((currentWatchListItems: WatchListItem) => {
               return currentWatchListItems?.WatchListItemID.toString() === watchListItemID.toString();
          });

          if (currentWatchListItemResult.length !== 1) {
               return Response.json(["ERROR", `WatchListItemID is not a valid WatchList Item ID`]);
          }
     }
     const errorResults: any = [];

     for (let i = 0; i < wli.length; i++) {
          if (watchListItemID !== null && wli[i].WatchListItemID.toString() !== watchListItemID.toString()) {
               continue;
          }

          // Derive IMDB ID from URL 
          const url = wli[i].IMDB_URL;

          if (url.toString().indexOf("imdb.com/title/") === -1) {
               continue;
          }

          const urlSplit = url.split("/");

          let id: string = "";

          if (urlSplit[2].toString().indexOf("imdb.com") !== -1 && urlSplit[3].toString() === "title") {
               id = urlSplit[4].toString();
          } else if (urlSplit[1].toString().indexOf("imdb.com") !== -1 && urlSplit[2].toString() === "title") {
               id = urlSplit[3].toString();
          } else {
               continue;
          }

          const result = await getIMDBDetails(id);

          if (result[0] === "OK" && result[1][0] === "OK") {
               const values: any = [JSON.stringify(result[1][1]), watchListItemID];

               const SQL = "UPDATE WatchListItems SET IMDB_JSON=? WHERE WatchListItemID=?";

               try {
                    await execUpdateDelete(SQL, [values])
               } catch (e) {
                    return Response.json(["ERROR", `The error occurred updating the WatchList Item with ID ${watchListItemID} with the error ${e.message}`]);
               }
          } else {
               errorResults.push([`An error occurred updating ${watchListItemID}. Unable to get IMDB detail`])
          }
     }

     return Response.json(["OK"]);
}