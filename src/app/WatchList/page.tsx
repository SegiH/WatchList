"use client"

import { useContext, useEffect, useState } from "react";
import { APIStatus, WatchListContext } from "../context";
import IWatchList from "../interfaces/IWatchList";

import { WatchListContextType } from "../contexts/WatchListContextType";

import PageNavigationBar from "../components/PageNavigationBar";
import WatchListCard from "./WatchListCard";

export default function WatchList() {
     const {
          filteredWatchList, hideTabs, isLoading, lastPage, modalVisible, setActiveRoute, setIsAdding, setIsEditing, tmdbSearchEnabled, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     useEffect(() => {
          setActiveRoute("WatchList");
          setIsAdding(false);
          setIsEditing(false);
     }, [setActiveRoute, setIsAdding, setIsEditing]);

     return (
          <>
               {!isLoading && filteredWatchList && filteredWatchList.length > 0 && !modalVisible &&
                    <>
                         <span>
                              <ul className={`show-list ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList) => {
                                        return (
                                             <WatchListCard key={currentWatchList.WatchListID} currentWatchList={currentWatchList} />
                                        );
                                   })}
                              </ul>
                         </span>

                         {!modalVisible &&
                              <span className={`bottom ${lastPage ? "lastPage" : ""} ${hideTabs ? "noTabs" : ""}`}>
                                   <PageNavigationBar isBottomNav={true} />
                              </span>
                         }
                    </>
               }

               {!isLoading && watchListSortingCheck === APIStatus.Success && filteredWatchList && filteredWatchList.length === 0 && !tmdbSearchEnabled &&
                    <h1 className="topMargin100">No results</h1>
               }
          </>
     )
}