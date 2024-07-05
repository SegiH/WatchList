"use client"

import Image from 'next/image';
const IWatchListItem = require("../interfaces/IWatchListItem");
const IWatchListSortColumn = require("../interfaces/IWatchListSortColumn");
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;

import { DataContext, DataContextType } from "../data-context";

export default function WatchListItems() {
     const {
          AddIconComponent,
          archivedVisible,
          BrokenImageIconComponent,
          isError,
          searchTerm,
          setIsAdding,
          setWatchListItems,
          setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete,
          setWatchListItemsSortingComplete,
          setWatchListLoadingStarted,
          setWatchListLoadingComplete,
          showMissingArtwork,
          typeFilter,
          watchList,
          watchListItems,
          watchListItemsLoadingComplete,
          watchListItemsSortingComplete,
          watchListSortColumn,
          watchListSortDirection,
          watchListTypes
     } = useContext(DataContext) as DataContextType;

     const router = useRouter();
     const watchListCount = watchList.length;

     const openDetailClickHandler = (watchListItemID: number) => {
          if (watchListItemID !== null) {
               if (watchListItemID === -1) {
                    setIsAdding(true);
               }

               router.push(`/WatchListItems/Dtl?WatchListItemID=${watchListItemID}`);
          }
     };

     const setImageLoaded = (watchListItemID: number) => (): void => {
          const newWatchListItems: typeof IWatchListItem = Object.assign(typeof WatchListItems, watchListItems);

          const currentWatchListItemsResult = newWatchListItems?.filter((currentWatchListItems: typeof IWatchListItem) => {
               return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
          });

          if (currentWatchListItemsResult === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentWatchListItems = currentWatchListItemsResult[0];

          currentWatchListItems["ImageLoaded"] = true;

          setWatchListItems(newWatchListItems);
     };

     const showDefaultSrc = (watchListItemID: number) => (): void => {
          const newWatchListItems = Object.assign([], watchListItems);

          const currentWatchListItemsResult = newWatchListItems?.filter((currentWatchListItems: typeof IWatchListItem) => {
               return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
          });

          if (currentWatchListItemsResult === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentWatchListItems = currentWatchListItemsResult[0];

          currentWatchListItems["IMDB_Poster_Error"] = true;

          setWatchListItems(newWatchListItems);
     };

     useEffect(() => {
          if (!watchListItemsSortingComplete && watchListItemsLoadingComplete) {
               const newWatchListItems = Object.assign([], watchListItems);

               newWatchListItems.sort((a: typeof IWatchListSortColumn, b: typeof IWatchListSortColumn) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return parseInt(a.WatchListItemID) > parseInt(b.WatchListItemID) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                    }
               });

               setWatchListItems(newWatchListItems);
               setWatchListItemsSortingComplete(true);
          }
     }, [setWatchListItems, setWatchListItemsSortingComplete, watchListItems, watchListItemsLoadingComplete, watchListSortColumn, watchListItemsSortingComplete, watchListSortDirection]);

     useEffect(() => {
          if (watchListCount === 0) {
               setWatchListLoadingStarted(false);
               setWatchListLoadingComplete(false);
          }

          if (watchListItems.length === 0) {
               setWatchListItemsLoadingStarted(false);
               setWatchListItemsLoadingComplete(false);
               setWatchListItemsSortingComplete(false);
          }
     }, [setWatchListLoadingStarted, setWatchListItemsLoadingStarted, setWatchListLoadingComplete, setWatchListItemsLoadingComplete, setWatchListItemsSortingComplete, watchListCount, watchListItems.length]);

     return (
          <>
               {!isError &&
                    <span className="clickable customTopMargin foregroundColor leftMargin40" onClick={() => openDetailClickHandler(-1)}>
                         {AddIconComponent}
                    </span>
               }

               <ul className="clickable foregroundColor show-list">
                    {watchListItems?.filter(
                         (currentWatchListItem: typeof IWatchListItem) =>
                              ((currentWatchListItem?.Archived === 1 && archivedVisible === true) || (currentWatchListItem?.Archived === 0 && archivedVisible === false))
                              &&
                              (searchTerm === "" || (searchTerm !== "" && (String(currentWatchListItem.WatchListItemName).toLowerCase().includes(searchTerm) || String(currentWatchListItem.IMDB_URL) == searchTerm || String(currentWatchListItem.IMDB_Poster) == searchTerm))) &&
                              (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchListItem.WatchListTypeID) === String(typeFilter)))
                              && (showMissingArtwork === false || (showMissingArtwork === true && (currentWatchListItem.IMDB_Poster_Error === true || currentWatchListItem.IMDB_Poster === null)))
                    ).map((currentWatchListItem: typeof IWatchListItem, index: number) => {
                              const IMDB_JSON =  currentWatchListItem?.IMDB_JSON !== null && typeof currentWatchListItem?.IMDB_JSON !== "undefined" && currentWatchListItem?.IMDB_JSON !== "" ? JSON.parse(currentWatchListItem?.IMDB_JSON) : null;

                              const type_name = watchListTypes?.filter((currentWatchList: typeof IWatchListItem) => {
                                   return String(currentWatchList.WatchListTypeID) === String(currentWatchListItem?.WatchListTypeID);
                              });

                              return (
                                   <React.Fragment key={index}>
                                        {watchListItemsSortingComplete && (
                                             <li className="show-item">
                                                  <span className="item-id" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID)}>
                                                       <div>{currentWatchListItem?.WatchListItemID}</div>
                                                  </span>

                                                  <a className="show-link" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID)}>
                                                       <div className="clickable image-crop">
                                                            {currentWatchListItem?.IMDB_Poster !== null && currentWatchListItem?.IMDB_Poster_Error !== true && <Image width="128" height="187" alt={currentWatchListItem?.WatchListItemName} src={currentWatchListItem?.IMDB_Poster} onLoad={() => setImageLoaded(currentWatchListItem?.WatchListItemID)} onError={() => showDefaultSrc(currentWatchListItem?.WatchListItemID)} />}

                                                            {(currentWatchListItem?.IMDB_Poster === null || currentWatchListItem?.IMDB_Poster_Error === true) && <>{BrokenImageIconComponent}</>}
                                                       </div>
                                                  </a>

                                                  <div>
                                                       {typeof currentWatchListItem?.IMDB_URL !== "undefined" &&
                                                            <a className="foregroundColor linkStyle" href={currentWatchListItem?.IMDB_URL} target='_blank'>{currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                                                       }

                                                       {typeof currentWatchListItem?.IMDB_URL === "undefined" &&
                                                            <div>
                                                                 {currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                                                            </div>
                                                       }

                                                       {currentWatchListItem?.Archived === true ? <span>&nbsp;(A)</span> : <></>}
                                                  </div>

                                                  <span>
                                                       <div>{type_name && type_name.length === 1 && type_name[0].WatchListTypeName}</div>
                                                  </span>
                                             </li>
                                        )}
                                   </React.Fragment>
                              );
                         })}
               </ul>
          </>
     )
}