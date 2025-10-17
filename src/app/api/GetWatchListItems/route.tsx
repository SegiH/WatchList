import { NextRequest } from 'next/server';
import { getDB, isLoggedIn, logMessage } from "../lib";
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

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

     if (startIndex === null || endIndex === null) {
          return Response.json(["ERROR", "Both start and end index need to be provided"]);
     }

     // WatchListItems applies to all users so no need to provide user ID
     try {
          const db: any = await getDB();

          const watchListItemsDB = db.WatchListItems;
          const watchListTypesDB = db.WatchListTypes;

          const result = await watchListItemsDB
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
                              return 0;
                    }
               })
               .filter((watchListItem: IWatchListItem) => {
                    return (
                         ((searchTerm === null || searchTerm === "") || (searchTerm !== null && searchTerm !== "" && (watchListItem.WatchListItemName?.toString().includes(searchTerm.toString()) || watchListItem.ItemNotes?.toString().includes(searchTerm.toString()))))
                         &&
                         (showMissingArtwork !== "true" || (showMissingArtwork === "true" && (typeof watchListItem.IMDB_Poster_Image === "undefined" || watchListItem.IMDB_Poster_Image === null || watchListItem.IMDB_Poster_Image === "")))
                         &&
                         ((archivedVisible !== "true" || (archivedVisible === "true" && watchListItem.Archived === 1)))
                         &&
                         (typeFilter === null || (typeFilter !== null && String(watchListItem.WatchListTypeID) === String(typeFilter)))
                    )
               })
               .map((watchListItem: IWatchListItem) => {
                    const watchListType = watchListTypesDB.filter((watchListType: IWatchListType) => {
                         return (
                              String(watchListType.WatchListTypeID) === String(watchListItem.WatchListTypeID)
                              || (typeFilter !== null && String(watchListType.WatchListTypeID) === String(typeFilter))
                              || ((searchTerm === null || searchTerm === "") || (searchTerm !== null && searchTerm !== "" && watchListType.WatchListTypeName?.toString().includes(searchTerm.toString())))
                         );
                    });

                    watchListItem.WatchListTypeName = watchListType.length > 0 ? watchListType[0].WatchListTypeName : "";

                    return watchListItem;
               }).slice(startIndex, endIndex)

          return Response.json(["OK", result]);
     } catch (e) {
          logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}

               /*.map((watchListItem: IWatchListItem) => {
                    if (typeof watchListItem.IMDB_Poster_Image === "undefined" || watchListItem.IMDB_Poster_Image === null || watchListItem.IMDB_Poster_Image === "") {
                         const missingPosterResult = getMissingArtwork([watchListItem.WatchListItemID]);

                         if (typeof missingPosterResult[1] !== "undefined") {
                              watchListItem.IMDB_Poster_Image = missingPosterResult[1];
                         }
                    }

                    return watchListItem;
               });*/