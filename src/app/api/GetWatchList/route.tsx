import { NextRequest } from 'next/server';
import { getDB, getUserID, isLoggedIn, logMessage, matchMetadata, metaSearch } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListSource from '@/app/interfaces/IWatchListSource';
import { sendCompressedJsonBrotli } from '@/app/proxy';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const allData = searchParams.get("AllData");

     // Filter params
     const archivedVisible = searchParams.get("ArchivedVisible"); // WLI.Archive
     const searchTerm = searchParams.get("SearchTerm"); // WLI.WatchListItemName
     const sourceFilter = searchParams.get("SourceFilter"); // WL.WatchListSourceID
     const stillWatching = searchParams.get("StillWatching"); // WL.EndDate == null
     const typeFilter = searchParams.get("TypeFilter"); // WLI.WatchListTypeID
     const metaDataFiltersJSONStr = searchParams.get("MetadataFilters");
     const metaDataFilters = metaDataFiltersJSONStr !== null ? JSON.parse(decodeURIComponent(metaDataFiltersJSONStr)) : null;

     // Order params
     const sortColumn = searchParams.get("SortColumn");
     const sortDirection = searchParams.get("SortDirection");

     // Chunk params
     const startIndex = searchParams.get("StartIndex");
     const endIndex = searchParams.get("EndIndex");

     if (userID === null) {
          return Response.json(["User ID is not set"]);
     }

     if (allData === null && (startIndex === null || endIndex === null)) {
          return Response.json(["ERROR", "Both start and end index need to be provided"]);
     }

     try {
          const db: any = await getDB();

          const watchListDB = db.WatchList;
          const watchListItemsDB = db.WatchListItems;
          const watchListSourcesDB = db.WatchListSources;
          const watchListTypesDB = db.WatchListTypes;

          let results = await watchListDB
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
                              if (allData === "true") { // SORT DESC
                                   return b.WatchListID > a.WatchListID ? 1 : -1;
                              } else {
                                   return 0;
                              }
                    }
               })
               .filter((watchList: IWatchList) => {
                    const thisWLI = watchListItemsDB
                         .filter((watchListItem: IWatchListItem) => {
                              return (
                                   watchListItem.WatchListItemID === watchList.WatchListItemID
                              )
                         });

                    const IMDB_JSON = thisWLI.length === 1 && typeof thisWLI[0]["IMDB_JSON"] !== "undefined" ? JSON.parse(thisWLI[0]["IMDB_JSON"]) : null;

                    const metadataMatch = matchMetadata(IMDB_JSON, metaDataFilters);

                    return (
                         (allData == "true") ||
                         (
                              (searchTerm === null || searchTerm === "")
                              || (searchTerm !== null && searchTerm !== ""
                                   && (watchList.WatchListItemName?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                        || watchList.Notes?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                   )
                              )
                         )
                         && // When metadata filters are passed, StillWatcihng will prevent any results from showing up most of the time. 
                         ((stillWatching !== "true") || (stillWatching === "true" && metaDataFiltersJSONStr === null && (watchList.EndDate === "" || watchList.EndDate == null)))
                         &&
                         (((archivedVisible !== "true" && watchList.Archived !== 1) || (archivedVisible === "true" && watchList.Archived === 1)))
                         &&
                         (sourceFilter === null || (sourceFilter !== null && String(sourceFilter) === String(watchList.WatchListSourceID)))
                         &&
                         (typeFilter === null || (typeFilter !== null && watchListItemsDB.filter((watchListItem: IWatchListItem) => { return watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(typeFilter) }).length > 0))
                         &&
                         (metaDataFilters === null ||
                              (metaDataFilters !== null && metadataMatch)
                         )
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
               });

          if (allData != "true" && startIndex != null && endIndex !== null && results.length > (parseInt(endIndex, 10) - parseInt(startIndex, 10))) {
               results = results.slice(startIndex, endIndex);
          }

          if (process.env.NODE_ENV === 'development') {
               return Response.json(["OK", results]);
          } else {
               // Return gzipped results
               const compressedData = await sendCompressedJsonBrotli(["OK", results]);

               return new Response(compressedData as unknown as BodyInit, {
                    status: 200,
                    headers: {
                         'Content-Type': 'application/json',
                         'Content-Encoding': 'br',
                    },
               });
          }
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}