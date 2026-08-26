"use client"

import { useContext, useEffect, useState } from "react";
import { APIStatus, ItemsContext } from "../context";
import IWatchListItem from "../interfaces/IWatchListItem";
import React from "react";
import PageNavigationBar from "../components/PageNavigationBar";
import { ItemsContextType } from "../contexts/ItemsContextType";
import WatchListItem from "../interfaces/IWatchListItem";

const ItemCard = React.lazy(() => import('./ItemCard'));

export default function WatchListItems() {
     const {
          filteredWatchListItems, hideTabs, isLoading, setActiveRoute, setIsAdding, setIsEditing, tmdbSearchEnabled, watchListItemsSortingCheck
     } = useContext(ItemsContext) as ItemsContextType;

     const [mediaDetailsVisible, setMediaDetailsVisible] = useState(false);
     const [mediaDetailItem, setMediaDetailItem] = useState<WatchListItem>(null);

     useEffect(() => {
          setActiveRoute("Items");
          setIsAdding(false);
          setIsEditing(false);
     }, [setActiveRoute, setIsAdding, setIsEditing]);

     useEffect(() => {
          if (typeof mediaDetailItem !== "undefined" &&  mediaDetailItem !== null && !mediaDetailsVisible) {
               setMediaDetailsVisible(true);
          }
     }, [mediaDetailItem]);

     return (
          <>
               {!isLoading && watchListItemsSortingCheck === APIStatus.Success && !mediaDetailsVisible &&
                    <>
                         <span className="displayInline">
                              <ul className={`show-list ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchListItems?.map((currentWatchListItem: IWatchListItem, index: number) => {
                                        return (
                                             <ItemCard key={index} currentWatchListItem={currentWatchListItem} setMediaDetailItem={setMediaDetailItem} />
                                        );
                                   })}
                              </ul>
                         </span>

                         <span className="bottom">
                              <PageNavigationBar isBottomNav={true} />
                         </span>
                    </>
               }

               {!isLoading && watchListItemsSortingCheck === APIStatus.Success && filteredWatchListItems && filteredWatchListItems.length === 0 && !tmdbSearchEnabled &&
                    <h1>No results</h1>
               }
          </>
     )
}