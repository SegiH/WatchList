import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";

/**
 * @swagger
 * /api/GetWatchListWeeklyBreakdown:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get weekly breakdown of how many TV seasons and movies you watched
 *        description: Get weekly breakdown of how many TV seasons and movies you watched
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const weeklyTVSQL = `WITH GetWeekCount AS (
                               SELECT STRFTIME('%Y',startdate) AS Year, STRFTIME('%W',StartDate) AS WeekNum FROM WatchList WL
                               LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID
                               LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID
                               WHERE UserID=? AND WLT.WatchListTypeName='TV' AND Year IS NOT NULL)
                         SELECT Year, WeekNum,COUNT(*) AS TVCount FROM GetWeekCount GROUP BY Year, WeekNum ORDER BY Year, WeekNum;`;

     const weeklyMovieSQL = `WITH GetWeekCount AS (
                               SELECT STRFTIME('%Y',startdate) AS Year, STRFTIME('%W',StartDate) AS WeekNum FROM WatchList WL
                               LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID
                               LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID
                               WHERE UserID=? AND WLT.WatchListTypeName='Movie' AND Year IS NOT NULL)
                         SELECT Year, WeekNum,COUNT(*) AS MovieCount FROM GetWeekCount GROUP BY Year, WeekNum ORDER BY Year, WeekNum;`;

     try {
          const tvResults = await execSelect(weeklyTVSQL, [userID]);

          const movieResults = await execSelect(weeklyMovieSQL, [userID]);

          return Response.json(["OK", tvResults, movieResults]);
     } catch (e) {
          return Response.json(["ERROR", `GetWatchListWeeklyBreakdown: The error ${e.message} occurred getting the WatchList weekly breakdown`]);
     }
}