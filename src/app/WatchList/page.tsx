"use client"

import Image from "next/image";
import { useContext, useEffect } from "react";

import { DataContext, DataContextType } from "../data-context";
import IWatchList from "../interfaces/IWatchList";

import "../page.css";

export default function WatchList() {
     const {
          archivedVisible,
          BrokenImageIconComponent,
          darkMode,
          openDetailClickHandler,
          ratingMax,
          searchTerm,
          setActiveRoute,
          setIsAdding,
          setIsEditing,
          setWatchList,
          setWatchListSortingComplete,
          stillWatching,
          sourceFilter,
          typeFilter,
          watchList,
          watchListLoadingComplete,
          watchListSortColumn,
          watchListSortDirection,
          watchListSortingComplete
     } = useContext(DataContext) as DataContextType;

     const showDefaultSrc = (watchListID: number): void => {
          const newWatchList = Object.assign([], watchList);

          const currentWatchListResult: IWatchList[] = newWatchList?.filter((currentWatchList: IWatchList) => {
               return String(currentWatchList.WatchListID) === String(watchListID);
          });

          if (currentWatchListResult.length === 0) { // this shouldn't ever happen!
               return;
          }

          const currentWatchList = currentWatchListResult[0];

          currentWatchList["IMDB_Poster_Error"] = true;

          setWatchList(newWatchList);
     };

     useEffect(() => {
          if (!watchListSortingComplete && watchListLoadingComplete && watchList.length > 0) {
               const newWatchList = Object.assign([], watchList);

               newWatchList.sort((a: IWatchList, b: IWatchList) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return a.WatchListID > b.WatchListID ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              const aName = a.WatchListItemName;
                              const bName = b.WatchListItemName;

                              return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "StartDate":
                              return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "EndDate":
                              return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
                    }
               });

               setWatchList(newWatchList);
               setWatchListSortingComplete(true);
          }
     }, [setWatchList, setWatchListSortingComplete, watchList, watchListLoadingComplete, watchListSortColumn, watchListSortDirection, watchListSortingComplete]);

     useEffect(() => {
          setActiveRoute("WatchList");
          setIsAdding(false);
          setIsEditing(false);
     }, []);

     return (
          <span className="topMarginContent">
               {watchList.length > 0 &&
                    <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"}`}>
                         {watchList?.filter(
                              (currentWatchList: IWatchList) =>
                                   ((currentWatchList?.Archived === 1 && archivedVisible === true) || (currentWatchList?.Archived === 0 && archivedVisible === false
                                        &&
                                        ((stillWatching === false && currentWatchList?.EndDate !== null) || (stillWatching === true && currentWatchList?.EndDate === null && currentWatchList?.Archived === 0))
                                   ))
                                   &&
                                   (searchTerm === "" || (searchTerm !== "" && currentWatchList?.WatchListItemName?.toLowerCase().includes(searchTerm)))
                                   &&
                                   (sourceFilter === -1 || sourceFilter === null || (sourceFilter !== -1 && sourceFilter !== null && currentWatchList?.WatchListSourceID === sourceFilter))
                                   &&
                                   (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchList?.WatchListTypeID) === String(typeFilter)))
                         ).map((currentWatchList: IWatchList, index: number) => {
                              const IMDB_JSON = currentWatchList?.IMDB_JSON !== null && typeof currentWatchList?.IMDB_JSON !== "undefined" && currentWatchList?.IMDB_JSON !== "" ? JSON.parse(currentWatchList?.IMDB_JSON) : null;

                              return (
                                   <div key={index} className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                        {watchListSortingComplete && (
                                             <li className="show-item" key={index}>
                                                  <span className="item-id">
                                                       <div>{currentWatchList?.WatchListID}</div>
                                                  </span>

                                                  <a className="clickable image-crop show-link" onClick={() => openDetailClickHandler(currentWatchList?.WatchListID)}>
                                                       <div>
                                                            {typeof currentWatchList?.IMDB_Poster !== "undefined" && currentWatchList?.IMDB_Poster !== null && currentWatchList?.IMDB_Poster !== "" && currentWatchList?.IMDB_Poster_Error !== true && <Image width="128" height="187" alt={currentWatchList?.WatchListItemName ?? ""} src={currentWatchList?.IMDB_Poster ?? ""} onError={() => showDefaultSrc(currentWatchList?.WatchListID)} />}

                                                            {(typeof currentWatchList?.IMDB_Poster === "undefined" || currentWatchList?.IMDB_Poster === null || currentWatchList?.IMDB_Poster_Error === true) && <>{BrokenImageIconComponent}</>}
                                                       </div>
                                                  </a>

                                                  <div className="show-title">
                                                       {typeof currentWatchList?.IMDB_URL !== "undefined" &&
                                                            <a href={currentWatchList?.IMDB_URL} target='_blank'>{currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                                                       }

                                                       {typeof currentWatchList?.IMDB_URL === "undefined" &&
                                                            <span>
                                                                 {currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                                                            </span>
                                                       }

                                                       {currentWatchList?.Archived === 1 ? <span>&nbsp;(A)</span> : <></>}
                                                  </div>

                                                  {currentWatchList?.WatchListTypeID === 2 && <div>Season {currentWatchList?.Season}</div>}

                                                  <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                       {currentWatchList?.StartDate}
                                                       {currentWatchList?.EndDate !== null && currentWatchList?.EndDate !== currentWatchList?.StartDate ? ` - ${currentWatchList?.EndDate}` : ""}
                                                  </div>

                                                  <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                       {currentWatchList?.WatchListTypeName}
                                                  </div>

                                                  <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                       {currentWatchList.WatchListSourceName}
                                                  </div>

                                                  {currentWatchList?.Rating !== null && (
                                                       <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                            {currentWatchList?.Rating}/{ratingMax}
                                                       </div>
                                                  )}
                                             </li>
                                        )}
                                   </div>
                              );
                         })}
                    </ul>
               }
          </span>
     )
}