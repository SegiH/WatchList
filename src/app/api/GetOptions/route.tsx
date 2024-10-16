import { NextRequest } from 'next/server';
import { execSelect, execInsert, getUserID, getUserSession } from "../lib";
/**
 * @swagger
 * /api/GetOptions
 *    get:
 *        tags:
 *          - Options
 *        summary: Get all options
 *        description: Get all options
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams; // This is here to prevent this endpoint from being built as a static endpoint when running npm run build

     const userID = await getUserID(request);

     if (typeof userID != "number") {
          return Response.json(["ERROR", "Access denied"]);
     }

     const getOptionsSQL = `SELECT * FROM Options WHERE UserID=?`;
     const params = [userID];

     const userSession = await getUserSession(request);

     try {
          // There may be no options the first time ever getting the options
          const resultsFirstCheck = await execSelect(getOptionsSQL, params);

          if (resultsFirstCheck.length === 0) {
               const visibleSectionsChoicesResult = await execSelect(`SELECT * FROM VisibleSections ${userSession.Admin === 0 ? " WHERE name != 'Admin'" : ""}`, []);
               const visibleSectionsChoices= JSON.stringify(visibleSectionsChoicesResult);

               //await execInsert("INSERT INTO Options (UserID, ArchivedVisible, AutoAdd, DarkMode, SearchCount, StillWatching, ShowMissingArtwork, SourceFilter, TypeFilter, WatchListSortColumn, WatchListSortDirection, VisibleSections) VALUES (" + userID + ", false, true, true, 5, true, false, -1, -1, \"Name\", \"ASC\", '\"[{\\\"name\\\":\\\"Items\\\",\\\"id\\\":1},{\\\"name\\\":\\\"Admin\\\",\\\"id\\\":3},{\\\"name\\\":\\\"Stats\\\",\\\"id\\\":2}]\"');", []);
               await execInsert("INSERT INTO Options (UserID, ArchivedVisible, AutoAdd, DarkMode, DemoMode, SearchCount, StillWatching, ShowMissingArtwork, SourceFilter, TypeFilter, WatchListSortColumn, WatchListSortDirection, VisibleSections) VALUES (" + userID + ", false, true, true, false, 5, true, false, -1, -1,\"Name\", \"ASC\",'" + visibleSectionsChoices + "');", []);

               const resultsSecondCheck = await execSelect(getOptionsSQL, params);

               return Response.json(["OK", resultsSecondCheck]);
          } else {
               return Response.json(["OK", resultsFirstCheck]);
          }
     } catch (e) {
          return Response.json(["ERROR", `An error occurred getting the options with the error ${e.message}`]);
     }
}