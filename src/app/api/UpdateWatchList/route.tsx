import { NextRequest } from 'next/server';
import { execUpdateDelete, isLoggedIn } from "../lib";

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
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

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

     let columns = "";
     const values: any = [];

     if (watchListItemID !== null) {
          columns += (columns !== "" ? "," : "") + "WatchListItemID=?";
          values.push(watchListItemID);
     }

     if (startDate !== null) {
          columns += (columns !== "" ? "," : "") + "StartDate=?";
          values.push(startDate);
     }

     if (endDate !== null) {
          columns += (columns !== "" ? "," : "") + "EndDate=?";
          values.push(endDate);
     }

     if (sourceID !== null) {
          columns += (columns !== "" ? "," : "") + "WatchListSourceID=?";
          values.push(sourceID);
     }

     if (season !== null) {
          columns += (columns !== "" ? "," : "") + "Season=?";
          values.push(season);
     }

     if (archived !== null) {
          columns += (columns !== "" ? "," : "") + "Archived=?";
          values.push((archived === "true" ? 1 : 0));
     }

     if (rating !== null) {
          columns += (columns !== "" ? "," : "") + "Rating=?";
          values.push(rating);
     }

     if (notes !== null) {
          columns += (columns !== "" ? "," : "") + "Notes=?";
          values.push(notes);
     }

     if (values.length === 0) {
          return Response.json(["ERROR", `No parameters were passed`]);
     }

     values.push(watchListID);

     try {
          const sql = `UPDATE WatchList SET ${columns} WHERE WatchListID=?`;

          await execUpdateDelete(sql, values);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `/UpdateWatchList: The error occurred updating the WatchList with ID ${watchListID} with the error ${e.message}`]);
     }
}