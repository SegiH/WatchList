import { NextRequest } from 'next/server';
import { getDB, getUserID, isLoggedIn, logMessage } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListSource from '@/app/interfaces/IWatchListSource';
//import { sendCompressedJsonBrotli, sendCompressedJsonGZip } from '@/app/middleware';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     // Filter params
     const archivedVisible = searchParams.get("ArchivedVisible"); // WLI.Archive
     const searchTerm = searchParams.get("SearchTerm"); // WLI.WatchListItemName
     const sourceFilter = searchParams.get("SourceFilter"); // WL.WatchListSourceID
     const stillWatching = searchParams.get("StillWatching"); // WL.EndDate == null
     const typeFilter = searchParams.get("TypeFilter"); // WLI.WatchListTypeID

     // Order params
     const sortColumn = searchParams.get("SortColumn");
     const sortDirection = searchParams.get("SortDirection");

     // Chunk params
     const startIndex = searchParams.get("StartIndex");
     const endIndex = searchParams.get("EndIndex");

     if (userID === null) {
          return Response.json(["User ID is not set"]);
     }

     if (startIndex === null || endIndex === null) {
          return Response.json(["ERROR", "Both start and end index need to be provided"]);
     }

     try {
          const db: any = await getDB();

          const watchListDB = db.WatchList;
          const watchListItemsDB = db.WatchListItems;
          const watchListSourcesDB = db.WatchListSources;
          const watchListTypesDB = db.WatchListTypes;

          const result = await watchListDB
               .sort((a: IWatchList, b: IWatchList) => {
                    switch (sortColumn) {
                         case "ID":
                              return a.WatchListID > b.WatchListID ? (sortDirection === "ASC" ? 1 : -1) : sortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              const aName = a.WatchListItemName;
                              const bName = b.WatchListItemName;

                              return String(aName) > String(bName) ? (sortDirection === "ASC" ? 1 : -1) : sortDirection === "ASC" ? -1 : 1;
                         case "StartDate":
                              return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (sortDirection === "ASC" ? 1 : -1) : sortDirection === "ASC" ? -1 : 1;
                         case "EndDate":
                              return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (sortDirection === "ASC" ? 1 : -1) : sortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
                    }
               })
               .filter((watchList: IWatchList) => {
                    return (
                         (
                              (searchTerm === null || searchTerm === "")
                              || (searchTerm !== null && searchTerm !== ""
                                   && (watchList.WatchListItemName?.toString().includes(searchTerm.toString())
                                        || watchList.Notes?.toString().includes(searchTerm.toString())
                                   )
                              )
                         )
                         &&
                         (stillWatching !== "true" || (stillWatching === "true" && (watchList.EndDate === "" || watchList.EndDate == null)))
                         &&
                         (((archivedVisible !== "true" && watchList.Archived !== 1) || (archivedVisible === "true" && watchList.Archived === 1)))
                         &&
                         (sourceFilter === null || (sourceFilter !== null && String(sourceFilter) === String(watchList.WatchListSourceID)))
                         &&
                         (typeFilter === null || (typeFilter !== null && watchListItemsDB.filter((watchListItem: IWatchListItem) => { return watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(typeFilter) }).length > 0))
                    )
               })
               .map((watchList: IWatchList) => {
                    const watchListItem = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
                         return (
                              (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID))
                         );
                    });

                    const watchListSource = watchListSourcesDB.filter((watchListSource: IWatchListSource) => {
                         return (String(watchListSource.WatchListSourceID) === String(watchList.WatchListSourceID));
                    });

                    const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                         return (String(watchListType.WatchListTypeID) === String(watchListItem[0].WatchListTypeID));
                    });

                    if (watchListItem.length > 0) {
                         watchList.WatchListItemID = watchList.WatchListItemID;
                         watchList.WatchListItemName = watchListItem[0].WatchListItemName;
                         watchList.WatchListTypeID = watchListItem[0].WatchListTypeID;
                         watchList.WatchListTypeName = watchListType[0].WatchListTypeName;
                         watchList.IMDB_URL = watchListItem[0].IMDB_URL;
                         watchList.IMDB_Poster = watchListItem[0].IMDB_Poster;
                         watchList.Archived = watchListItem[0].Archived;
                         watchList.IMDB_JSON = watchListItem[0].IMDB_JSON;
                         watchList.WatchListSourceName = watchListSource[0]?.WatchListSourceName;
                    }

                    return watchList;
               }).slice(startIndex, endIndex);

          return Response.json(["OK", result]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}

// Return gzipped results
/*const compressedData = await sendCompressedJsonBrotli(["OK", result]);

return new Response(compressedData as unknown as BodyInit, {
     status: 200,
     headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'br', // use 'gzip' when using gzip
     },
});*/

/* const compressedData = await sendCompressedJsonGZip(["OK", result]);

 return new Response(compressedData as unknown as BodyInit, {
      status: 200,
      headers: {
           'Content-Type': 'application/json',
           'Content-Encoding': 'gzip',
      },
 });*/