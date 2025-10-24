import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage, writeDB } from "../lib";
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import { sendCompressedJsonBrotli, sendCompressedJsonGZip } from '@/app/middleware';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const allData = searchParams.get("AllData");

     // Filter params
     const archivedVisible = searchParams.get("ArchivedVisible");
     const searchTerm = searchParams.get("SearchTerm");
     const showMissingArtwork = searchParams.get("ShowMissingArtwork");
     const typeFilter = searchParams.get("TypeFilter");

     // Order params
     const sortColumn = searchParams.get("SortColumn");
     const sortDirection = searchParams.get("SortDirection");

     // Chunk params
     const startIndex = searchParams.get("StartIndex");
     const endIndex = searchParams.get("EndIndex");

     if (allData === null && (startIndex === null || endIndex === null)) {
          return Response.json(["ERROR", "Both start and end index need to be provided"]);
     }

     // WatchListItems applies to all users so no need to provide user ID
     try {
          const db: any = await getDB();

          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          let results = await watchListItemsDB
               .sort((a: IWatchListItem, b: IWatchListItem) => {
                    switch (sortColumn) {
                         case "ID":
                              return a.WatchListItemID > b.WatchListItemID
                                   ? (sortDirection === "ASC" ? 1 : -1)
                                   : sortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              return String(a.WatchListItemName) > String(b.WatchListItemName) ? (sortDirection === "ASC" ? 1 : -1) : sortDirection === "ASC" ? -1 : 1;
                         //case "Type":
                         //     return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;     
                         default:
                              if (allData === "true") { // SORT DESC
                                   return b.WatchListItemID > a.WatchListItemID ? 1 : -1;
                              } else {
                                   return 0;
                              }
                    }
               })
               .filter((watchListItem: IWatchListItem) => {
                    return (
                         (allData === "true") ||
                         (
                              ((searchTerm === null || searchTerm === "")
                                   || (searchTerm !== null && searchTerm !== ""
                                        && (watchListItem.WatchListItemName?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                             || watchListItem.ItemNotes?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                        )
                                   )
                              )
                              &&
                              (showMissingArtwork !== "true" || (showMissingArtwork === "true" && (typeof watchListItem.IMDB_Poster === "undefined" || watchListItem.IMDB_Poster === null || watchListItem.IMDB_Poster === "")))
                              &&
                              ((archivedVisible !== "true" || (archivedVisible === "true" && watchListItem.Archived === 1)))
                              &&
                              (typeFilter === null || (typeFilter !== null && String(watchListItem.WatchListTypeID) === String(typeFilter)))
                         )
                    )
               })
               .map((watchListItem: IWatchListItem) => {
                    const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                         return (
                              String(watchListType.WatchListTypeID) === String(watchListItem.WatchListTypeID)
                         );
                    });

                    watchListItem.WatchListTypeName = watchListType.length > 0 ? watchListType[0].WatchListTypeName : "";

                    return watchListItem;
               })

          if (allData != "true" && startIndex != null && endIndex !== null && results.length > (parseInt(endIndex, 10) - parseInt(startIndex, 10))) {
               results = results.slice(startIndex, endIndex);
          }

          if (process.env.NODE_ENV === 'development') {
               return Response.json(["OK", results]);
          } else {
               const compressedData = await sendCompressedJsonBrotli(["OK", results]);

               return new Response(compressedData as unknown as BodyInit, {
                    status: 200,
                    headers: {
                         'Content-Type': 'application/json',
                         'Content-Encoding': 'br', // usse 'gzip' when using gzip
                    },
               });
          }
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
          'Content-Encoding': 'br', // usse 'gzip' when using gzip
     },
});*/