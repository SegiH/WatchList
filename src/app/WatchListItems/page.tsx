"use client"

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
          watchListSortDirection
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
               <span className="clickable customTopMargin" onClick={() => openDetailClickHandler(-1)}>
                    {AddIconComponent}
               </span>

               <ul className="clickable show-list">
                    {watchListItems?.filter(
                         (currentWatchListItem: typeof IWatchListItem) =>
                              currentWatchListItem.Archived === archivedVisible &&
                              (searchTerm === "" || (searchTerm !== "" && (String(currentWatchListItem.WatchListItemName).toLowerCase().includes(searchTerm) || String(currentWatchListItem.IMDB_URL) == searchTerm || String(currentWatchListItem.IMDB_Poster) == searchTerm))) &&
                              (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchListItem.WatchListTypeID) === String(typeFilter))) &&
                              (showMissingArtwork === false || (showMissingArtwork === true && currentWatchListItem.IMDB_Poster_Error === true)),
                    )
                         .map((currentWatchListItem: typeof IWatchListItem, index: number) => {
                              return (
                                   <React.Fragment key={index}>
                                        {watchListItemsSortingComplete && (
                                             <li className="show-item">
                                                  <span className="item-id" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID)}>
                                                       <div>{currentWatchListItem?.WatchListItemID}</div>
                                                  </span>

                                                  <a className="show-link" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID)}>
                                                       <div className="clickable image-crop">
                                                            {currentWatchListItem?.IMDB_Poster !== null && currentWatchListItem?.IMDB_Poster_Error !== true && <img alt={currentWatchListItem?.WatchListItemName} src={currentWatchListItem?.IMDB_Poster} onLoad={() => setImageLoaded(currentWatchListItem?.WatchListItemID)} onError={() => showDefaultSrc(currentWatchListItem?.WatchListItemID)} />}

                                                            {(currentWatchListItem?.IMDB_Poster === null || currentWatchListItem?.IMDB_Poster_Error === true) && <>{BrokenImageIconComponent}</>}
                                                       </div>
                                                  </a>

                                                  <div>
                                                       {typeof currentWatchListItem?.IMDB_URL !== "undefined" &&
                                                            <a href={currentWatchListItem?.IMDB_URL} target='_blank'>{currentWatchListItem?.WatchListItemName}</a>
                                                       }

                                                       {typeof currentWatchListItem?.IMDB_URL === "undefined" &&
                                                            <div>
                                                                 {currentWatchListItem?.WatchListItemName}
                                                            </div>
                                                       }

                                                       {currentWatchListItem?.Archived === true ? <span>&nbsp;(A)</span> : <></>}
                                                  </div>

                                                  <span>
                                                       <div>{currentWatchListItem?.WatchListType?.WatchListTypeName}</div>
                                                  </span>
                                             </li>
                                        )}
                                   </React.Fragment>
                              );
                         })}
               </ul>

               {/*{watchListItemDtlID !== null && (
                    <WatchListItemDetail
                         BrokenImageIcon={BrokenImageIcon}
                         CancelIcon={CancelIcon}
                         demoMode={demoMode}
                         EditIcon={EditIcon}
                         isAdding={isAdding}
                         isEditing={isEditing}
                         SaveIcon={SaveIcon}
                         setIsAdding={setIsAdding}
                         setIsEditing={setIsEditing}
                         setNewWatchListItemDtlID={setNewWatchListItemDtlID}
                         setWatchListItemDtlID={setWatchListItemDtlID}
                         setWatchListItemsLoadingComplete={setWatchListItemsLoadingComplete}
                         setWatchListItemsLoadingStarted={setWatchListItemsLoadingStarted}
                         watchListItemDtlID={watchListItemDtlID}
                         watchListTypes={watchListTypes}
                    />
               )}*/}
          </>
     )
}