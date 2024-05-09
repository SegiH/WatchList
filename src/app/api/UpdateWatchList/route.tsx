import { NextRequest } from 'next/server';
import { getModels } from "../lib";

/**
 * @swagger
 * /api/UpdateWatchList:
 *    put:
 *        tags:
 *          - WatchList
 *        summary: Update a WatchList record
 *        description: Update a WatchList record
 *        parameters:
 *           - name: WatchListID
 *             in: query
 *             description: WatchList ID to update
 *             required: true
 *             schema:
 *                  type: number
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID to update
 *             required: false
 *             schema:
 *                  type: number
 *           - name: StartDate
 *             in: query
 *             description: Start date that the movie/show was watched
 *             required: false
 *             schema:
 *                  type: string
 *           - name: EndDate
 *             in: query
 *             description: End date that the movie/show was watched
 *             required: false
 *             schema:
 *                  type: string
 *           - name: WatchListSourceID
 *             in: query
 *             description: Source ID of the movie/show where it was watched
 *             required: false
 *             schema:
 *                  type: number
 *           - name: Season
 *             in: query
 *             description: Season of the show
 *             required: false
 *             schema:
 *                  type: number
 *           - name: Rating
 *             in: query
 *             description: Rating of the movie/show
 *             required: false
 *             schema:
 *                  type: number
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

     const watchListID = searchParams.get("WatchListID");
     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate"); // Optional
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const archived = searchParams.get("Archived");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");

     if (watchListID === null) {
          return Response.json(["ERROR", "WatchList ID was not provided"]);
     }

     const updateColumns: any = {};

     if (watchListItemID !== null) {
          updateColumns['WatchListItemID'] = watchListItemID;
     }

     if (startDate !== null) {
          updateColumns['StartDate'] = startDate;
     }

     if (endDate !== null) {
          updateColumns['EndDate'] = endDate;
     }

     if (sourceID !== null) {
          updateColumns['WatchListSourceID'] = sourceID;
     }

     if (season !== null) {
          updateColumns['Season'] = season;
     }

     if (archived !== null) {
          updateColumns['Archived'] = (archived === "true" ? 1 : 0);
     }

     if (rating !== null) {
          updateColumns['Rating'] = rating;
     }

     if (notes !== null) {
          updateColumns['Notes'] = notes;
     }

     if (Object.keys(updateColumns).length == 0) { // No params were passed except for the mandatory column
          return Response.json(["ERROR", "No params were passed"]);
     }

     const updatedRowCount = await models.WatchList.update(
          updateColumns
          , {
               //logging: console.log,
               where: { WatchListID: watchListID }
          }).catch(function (e: Error) {
               const errorMsg = `/UpdateWatchList: The error ${e.message} occurred while updating WatchList with ID ${watchListID}`;
               return Response.json(["ERROR", errorMsg]);
          });

     return Response.json(["OK", updatedRowCount]);
}