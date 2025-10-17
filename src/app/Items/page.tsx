"use client"

import { useContext, useEffect } from "react";
import { APIStatus, DataContext, DataContextType } from "../data-context";
import IWatchListItem from "../interfaces/IWatchListItem";
import React from "react";
import NavBar from "../components/NavBar";

const WatchListItemCard = React.lazy(() => import('./WatchListItemCard'));

export default function WatchListItems() {
     const {
          darkMode,
          filteredWatchListItems,
          hideTabs,
          isLoading,
          searchModalVisible,
          setActiveRoute,
          setIsAdding,
          setIsEditing,
          watchListItemsSortingCheck
     } = useContext(DataContext) as DataContextType;

     useEffect(() => {
          setActiveRoute("Items");
          setIsAdding(false);
          setIsEditing(false);
     }, [setActiveRoute, setIsAdding, setIsEditing]);

     return (
          <>
               {!isLoading && watchListItemsSortingCheck === APIStatus.Success &&
                    <>
                         {!searchModalVisible &&
                              <span className="top">
                                   <NavBar />
                              </span>
                         }

                         <span className="topMarginContent">
                              <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"} ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchListItems?.map((currentWatchListItem: IWatchListItem, index: number) => {
                                        return (
                                             <WatchListItemCard key={index} currentWatchListItem={currentWatchListItem} />
                                        );
                                   })}
                              </ul>
                         </span>

                         <span className="bottom">
                              <NavBar />
                         </span>
                    </>
               }

               {!isLoading && watchListItemsSortingCheck === APIStatus.Success && filteredWatchListItems && filteredWatchListItems.length === 0 &&
                    <h1>No results</h1>
               }
          </>
     )
}