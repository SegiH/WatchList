import { NextRequest } from 'next/server';
import { getIMDBDetails, getModels } from "../lib";
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
 *             description: If WatchListItemID was not provided, all items are updated. ConfirmUpdate=true must be provided to confirm that you want to update all items because each WatcHListItems' IMDB ID is used to make an IP call
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK", ""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const confirmUpdate = searchParams.get("ConfirmUpdate");

     if (watchListItemID === null && confirmUpdate === null) {
          return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: WatchListItemID was not passed and confirmUpdate was not passed. Either one must be provided`]);
     }

     if (watchListItemID === null && confirmUpdate !== "true") {
          return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: confirmUpdate was provided but is not true`]);
     }

     try {
          if (watchListItemID !== null && isNaN(parseInt(watchListItemID, 10))) {
               return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: WatchListItemID is not a number`]);
          }
     } catch (e) {
          return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: WatchListItemID is not a number`]);
     }

     const models = getModels();

     // Get all WatchListItems
     const wli = await models.WatchListItems.findAll({
     }).then((results: WatchListItem) => {
          return results;
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: The error ${JSON.stringify(err)} occurred getting the WatchList Items`]);
     });

     if (watchListItemID !== null) {
          // Validate the WatchListItem ID
          const currentWatchListItemResult = wli?.filter((currentWatchListItems: WatchListItem) => {
               return currentWatchListItems?.WatchListItemID.toString() === watchListItemID.toString();
          });

          if (currentWatchListItemResult.length !== 1) {
               return Response.json(["ERROR", `/UpdateWatchListItemsFromIMDB: WatchListItemID is not a valid WatchList Item ID`]);
          }
     }
     const errorResults: any = [];

     for (let i = 0; i< wli.length; i++) {
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
               const updateColumns: any = {};

               updateColumns['IMDB_JSON'] = JSON.stringify(result[1][1]);

               const updatedRowCount = await models.WatchListItems.update(
                    updateColumns
                    , {
                         where: { WatchListItemID: wli[i].WatchListItemID }
                    }).catch(function (e: Error) {
                         const errorMsg = `/UpdateAllFromIMDB: The error ${e.message} occurred while updating WatchList Item with ID ${wli[i].WatchListItemID}`;
                         return Response.json(["ERROR", errorMsg]);
                    });

               if (updatedRowCount !== 1) {
                    errorResults.push([`An error occurred updating ${wli[i].WatchListItemID}. 0 rows were updated when updating it with the IMDB JSON`])
               }
          } else {
               errorResults.push([`An error occurred updating ${wli[i].WatchListItemID}. 0 rows were updated when updating it with the IMDB JSON`])
          }
     }

     return Response.json(["OK"]);
}