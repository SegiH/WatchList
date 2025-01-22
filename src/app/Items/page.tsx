"use client"

import React, { useContext, useEffect } from "react";
import Image from "next/image";
import IWatchListItem from "../interfaces/IWatchListItem";

import { DataContext, DataContextType } from "../data-context";

export default function WatchListItems() {
     const {
          archivedVisible,
          BrokenImageIconComponent,
          darkMode,
          openDetailClickHandler,
          searchTerm,
          setActiveRoute,
          setIsAdding,
          setIsEditing,
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
          watchListSortDirection
     } = useContext(DataContext) as DataContextType;

     const watchListCount = watchList.length;

     const setImageLoaded = (watchListItemID: number): void => {
          const newWatchListItems: IWatchListItem[] = Object.assign(typeof WatchListItems, watchListItems);

          const currentWatchListItemsResult: IWatchListItem[] = newWatchListItems?.filter((currentWatchListItems: IWatchListItem) => {
               return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
          });

          if (currentWatchListItemsResult.length === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentWatchListItems = currentWatchListItemsResult[0];

          currentWatchListItems["ImageLoaded"] = true;

          setWatchListItems(newWatchListItems);
     };

     const showDefaultSrc = (watchListItemID: number): void => {
          const newWatchListItems: IWatchListItem[] = Object.assign([], watchListItems);

          const currentWatchListItemsResult: IWatchListItem[] = newWatchListItems?.filter((currentWatchListItems: IWatchListItem) => {
               return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
          });

          if (currentWatchListItemsResult.length === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentWatchListItems = currentWatchListItemsResult[0];

          currentWatchListItems["IMDB_Poster_Error"] = true;

          setWatchListItems(newWatchListItems);
     };

     useEffect(() => {
          if (!watchListItemsSortingComplete && watchListItemsLoadingComplete) {
               const newWatchListItems: IWatchListItem[] = Object.assign([], watchListItems);

               newWatchListItems.sort((a: IWatchListItem, b: IWatchListItem) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return a.WatchListItemID > b.WatchListItemID
                                   ? (watchListSortDirection === "ASC" ? 1 : -1)
                                   : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
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

     useEffect(() => {
          setActiveRoute("Items");
          setIsAdding(false);
          setIsEditing(false);
     }, []);

     return (
          <span className="topMarginContent">
               <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"}`}>
                    {watchListItems?.filter(
                         (currentWatchListItem: IWatchListItem) =>
                              ((currentWatchListItem?.Archived === 1 && archivedVisible === true) || (currentWatchListItem?.Archived === 0 && archivedVisible === false))
                              &&
                              (searchTerm === "" || (searchTerm !== "" && (String(currentWatchListItem.WatchListItemName).toLowerCase().includes(searchTerm) || String(currentWatchListItem.IMDB_URL) == searchTerm || String(currentWatchListItem.IMDB_Poster) == searchTerm))) &&
                              (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchListItem.WatchListTypeID) === String(typeFilter)))
                              && (showMissingArtwork === false || (showMissingArtwork === true && (currentWatchListItem.IMDB_Poster_Error === true || currentWatchListItem.IMDB_Poster === null)))
                    ).map((currentWatchListItem: IWatchListItem, index: number) => {
                              const IMDB_JSON =  currentWatchListItem?.IMDB_JSON !== null && typeof currentWatchListItem?.IMDB_JSON !== "undefined" && currentWatchListItem?.IMDB_JSON !== "" ? JSON.parse(currentWatchListItem?.IMDB_JSON) : null;

                              return (
                                   <div key={index} className={`${!darkMode ? "lightMode" : "darkMode"}`}>
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
                                                            <a  className={`${!darkMode ? "lightMode" : "darkMode"}`} href={currentWatchListItem?.IMDB_URL} target='_blank'>{currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                                                       }

                                                       {typeof currentWatchListItem?.IMDB_URL === "undefined" &&
                                                            <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                                 {currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                                                            </div>
                                                       }

                                                       {currentWatchListItem?.Archived === 1 ? <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>&nbsp;(A)</span> : <></>}
                                                  </div>

                                                  <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                       <div>{currentWatchListItem?.WatchListTypeName}</div>
                                                  </span>
                                             </li>
                                        )}
                                   </div>
                              );
                         })}
               </ul>
          </span>
     )
}