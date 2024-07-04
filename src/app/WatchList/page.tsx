"use client"

const React = require("react");
import Image from 'next/image';
const useCallback = require("react").useCallback;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const IWatchList = require("../interfaces/IWatchList");
const IWatchListSource = require("../interfaces/IWatchListSource");

import { DataContext, DataContextType } from "../data-context";

export default function WatchList() {
     const {
          AddIconComponent,
          archivedVisible,
          BrokenImageIconComponent,
          isError,
          isLoggedIn,
          ratingMax,
          searchTerm,
          setIsAdding,
          setWatchList,
          setWatchListSortingComplete,
          stillWatching,
          sourceFilter,
          typeFilter,
          watchList,
          watchListLoadingComplete,
          watchListSortColumn,
          watchListSortDirection,
          watchListSortingComplete,
          watchListSources
     } = useContext(DataContext) as DataContextType;

     const router = useRouter();

     const openDetailClickHandler = useCallback((watchListID: number) => {
          if (watchListID !== null) {
               if (watchListID === -1) {
                    setIsAdding(true);
               }

               router.push(`/WatchList/Dtl${watchListID !== -1 ? `?WatchListID=${watchListID}` : ""}`);
          }
     }, [setIsAdding]);

     const showDefaultSrc = (watchListID: number) => (): void => {
          const newWatchList = Object.assign([], watchList);

          const currentWatchListResult = newWatchList?.filter((currentWatchList: typeof IWatchList) => {
               return String(currentWatchList.WatchListID) === String(watchListID);
          });

          if (currentWatchListResult === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentWatchList = currentWatchListResult[0];

          currentWatchList["IMDB_Poster_Error"] = true;

          setWatchList(newWatchList);
     };

     useEffect(() => {
          if (!watchListSortingComplete && watchListLoadingComplete && watchList !== null) {
               const newWatchList = Object.assign([], watchList);

               newWatchList.sort((a: typeof IWatchList, b: typeof IWatchList) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return parseInt(a.WatchListID) > parseInt(b.WatchListID) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              const aName = a.WatchListItem?.WatchListItemName;
                              const bName = b.WatchListItem?.WatchListItemName;

                              return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "StartDate":
                              return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "EndDate":
                              return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                    }
               });

               setWatchList(newWatchList);
               setWatchListSortingComplete(true);
          }
     }, [setWatchList, setWatchListSortingComplete, watchList, watchListLoadingComplete, watchListSortColumn, watchListSortDirection, watchListSortingComplete]);

     return (
          <>
               {isLoggedIn && !isError && (
                    <span className="clickable customTopMargin foregroundColor" onClick={() => openDetailClickHandler(-1)}>
                         {AddIconComponent}
                    </span>
               )}

               {watchList.length > 0 &&
                    <ul className="clickable show-list">
                         {watchList?.filter(
                              (currentWatchList: typeof IWatchList) =>
                                   ((currentWatchList?.Archived === 1 && archivedVisible === true) || (currentWatchList?.Archived === 0 && archivedVisible === false
                                        &&
                                        ((stillWatching === false && currentWatchList?.EndDate !== null) || (stillWatching === true && currentWatchList?.EndDate === null && currentWatchList?.Archived === 0))
                                   ))
                                   &&
                                   (searchTerm === "" || (searchTerm !== "" && currentWatchList?.WatchListItemName.toLowerCase().includes(searchTerm)))
                                   &&
                                   (sourceFilter === -1 || sourceFilter === null || (sourceFilter !== -1 && sourceFilter !== null && String(currentWatchList?.WatchListSourceID) === String(sourceFilter)))
                                   &&
                                   (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchList?.WatchListTypeID) === String(typeFilter)))
                         ).map((currentWatchList: typeof IWatchList, index: number) => {
                              const IMDB_JSON = currentWatchList?.IMDB_JSON !== null && typeof currentWatchList?.IMDB_JSON !== "undefined" && currentWatchList?.IMDB_JSON !== "" ? JSON.parse(currentWatchList?.IMDB_JSON) : null;

                              const source_name = watchListSources?.filter((currentWatchListSource: typeof IWatchListSource) => {
                                   return String(currentWatchListSource.WatchListSourceID) === String(currentWatchList?.WatchListSourceID);
                              });

                              return (
                                   <div key={index} className="foregroundColor">
                                        {watchListSortingComplete && (
                                             <li className="show-item" key={index}>
                                                  <span className="item-id">
                                                       <div>{currentWatchList?.WatchListID}</div>
                                                  </span>

                                                  <a className="clickable foregroundColor image-crop show-link" onClick={() => openDetailClickHandler(currentWatchList?.WatchListID)}>
                                                       <div>
                                                            {currentWatchList?.IMDB_Poster !== null && currentWatchList?.IMDB_Poster_Error !== true && <Image width="128" height="187" alt={currentWatchList?.WatchListItemName} src={currentWatchList?.IMDB_Poster} onError={() => showDefaultSrc(currentWatchList?.WatchListID)} />}

                                                            {(currentWatchList?.IMDB_Poster === null || currentWatchList?.IMDB_Poster_Error === true) && <>{BrokenImageIconComponent}</>}
                                                       </div>
                                                  </a>

                                                  <div className="show-title">
                                                       {typeof currentWatchList?.WatchListItem?.IMDB_URL !== "undefined" &&
                                                            <a className="foregroundColor linkStyle" href={currentWatchList?.IMDB_URL} target='_blank'>{currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                                                       }

                                                       {typeof currentWatchList?.IMDB_URL === "undefined" &&
                                                            <span className="foregroundColor">
                                                                 {currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                                                            </span>
                                                       }

                                                       {currentWatchList?.Archived === true ? <span>&nbsp;(A)</span> : <></>}
                                                  </div>

                                                  {currentWatchList?.WatchListTypeID === 2 && <div>Season {currentWatchList?.Season}</div>}

                                                  <div>
                                                       {currentWatchList?.StartDate}
                                                       {currentWatchList?.EndDate !== null && currentWatchList?.EndDate !== currentWatchList?.StartDate ? ` - ${currentWatchList?.EndDate}` : ""}
                                                  </div>

                                                  <div>
                                                       {currentWatchList?.WatchListTypeName}
                                                  </div>

                                                  <div>
                                                       {source_name && source_name.length === 1 && source_name[0].WatchListSourceName}
                                                  </div>

                                                  {currentWatchList?.Rating !== null && (
                                                       <div>
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
          </>
     )
}