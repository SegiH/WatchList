import { NextRequest } from 'next/server';
import { execInsert, getUserID, isLoggedIn } from '../lib';

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

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");
     const startDate = searchParams.get("StartDate");
     const endDate = searchParams.get("EndDate")
     const sourceID = searchParams.get("WatchListSourceID");
     const season = searchParams.get("Season");
     const rating = searchParams.get("Rating");
     const notes = searchParams.get("Notes");
     const archived = typeof searchParams.get("Archived") !== "undefined" && searchParams.get("Archived") !== null && searchParams.get("Archived") === "true" ? searchParams.get("Archived") : 0;

     if (userID === null) {
          return Response.json({ "ERROR": "User ID is not set" });
     } else if (watchListItemID === null) {
          return Response.json(["Item ID was not provided"]);
     } else if (startDate === null) {
          return Response.json(["Start Date was not provided"]);
     } else {
          const SQL = "INSERT INTO WatchList(UserID, WatchListItemID, StartDate, EndDate, WatchListSourceID, Season, Archived, Rating, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
          const params = [userID, watchListItemID, startDate, endDate, sourceID, season, archived, rating, notes];

          const result = await execInsert(SQL, params);

          const newID = result.lastID;

          return Response.json(["OK", newID]);
     }
}