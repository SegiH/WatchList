import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import { getUserID } from '../lib';
import WatchList from "../../../app/interfaces/IWatchList";

/**
 * @swagger
 * /api/AddWatchList:
 *    put:
 *        tags:
 *          - WatchList
 *        summary: Add a WatchList record
 *        description: Add a WatchList record to log a watched movie/TV show
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: New WatchListItem ID (ID of the movie or TV Show)
 *             required: true
 *             schema:
 *                  type: number
 *           - name: UserID
 *             in: query
 *             description: User ID of the person adding the log
 *             required: true
 *             schema:
 *                  type: number
 *           - name: StartDate
 *             in: query
 *             description: Start date that the movie/show was watched
 *             required: true
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
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const models = getModels();

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate")
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");

     if (userID === null) {
          return Response.json({ "ERROR": "User ID is not set" });
     } else if (watchListItemID === null) {
          return Response.json(["Item ID was not provided"]);
     } else if (startDate === null) {
          return Response.json(["Start Date was not provided"]);
     } else {
          return await models.WatchList.create({
               UserID: userID,
               WatchListItemID: watchListItemID,
               StartDate: startDate,
               EndDate: endDate,
               WatchListSourceID: sourceID,
               Season: season,
               Archived: 0,
               Rating: rating,
               Notes: notes,
          }).then((result: WatchList) => {
               // Return ID of newly inserted row
               return Response.json(["OK", result.WatchListID]);
          }).catch(function (e: Error) {
               const errorMsg = `/AddWatchList: The error ${e.message} occurred while adding the WatchList record`;
               console.error(errorMsg);
               return Response.json(errorMsg);
          });
     }
}