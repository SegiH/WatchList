import { NextRequest } from 'next/server';
import { getDB, getUserID, getUserSession, writeDB } from "../lib";
import IUserOption from '@/app/interfaces/IUser';
import ISectionChoice from '@/app/interfaces/ISectionChoice';

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams; // This is here to prevent this endpoint from being built as a static endpoint when running npm run build

     const userID = await getUserID(request);

     if (typeof userID != "number") {
          return Response.json(["ERROR", "Access denied"]);
     }

     const userSession = await getUserSession(request);

     try {
          // There may be no options the first time ever getting the options
          const db: any = await getDB();

          const optionsDB = db.Options;

          const filteredOptions = optionsDB.filter((currentOption: IUserOption) => {
               return currentOption.UserID === userID;
          });

          if (filteredOptions.length === 0) {
               const visibleSectionsDB = db.VisibleSections;

               const filteredVisibleSections = visibleSectionsDB.filter((visibleSection: ISectionChoice) => {
                    return (visibleSection.label !== "Admin" || (visibleSection.label === "Admin" && userSession.Admin));
               });

               const filteredVisibleSectionsJSON = JSON.stringify(filteredVisibleSections);

               const newOptions = {
                    "OptionID": optionsDB.length + 1,
                    "UserID": 1,
                    "ArchivedVisible": 0,
                    "AutoAdd": 1,
                    "DarkMode": 1,
                    "HideTabs": 0,
                    "SearchCount": 5,
                    "StillWatching": 0,
                    "ShowMissingArtwork": 0,
                    "SourceFilter": -1,
                    "TypeFilter": -1,
                    "WatchListSortColumn": "Name",
                    "WatchListSortDirection": "ASC",
                    "VisibleSections": filteredVisibleSectionsJSON
               };

               optionsDB.push(newOptions);

               writeDB(db);

               return Response.json(["OK", newOptions]);
          } else {
               return Response.json(["OK", filteredOptions[0]]);
          }
     } catch (e: any) {
          return Response.json(["ERROR", `An error occurred getting the options with the error ${e.message}`]);
     }
}