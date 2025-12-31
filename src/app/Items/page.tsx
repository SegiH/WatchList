"use client"

import { useContext, useEffect, useState } from "react";
import { APIStatus, ItemsContext } from "../context";
import IWatchListItem from "../interfaces/IWatchListItem";
import React from "react";
import NavBar from "../components/NavBar";
import { ItemsContextType } from "../contexts/ItemsContextType";
import IMDBCard from "../components/IMDBCard";

const WatchListItemCard = React.lazy(() => import('./WatchListItemCard'));

export default function WatchListItems() {
     const {
          darkMode, filteredWatchListItems, hideTabs, isLoading, searchModalVisible, setActiveRoute, setIsAdding, setIsEditing, watchList, watchListItemsSortingCheck
     } = useContext(ItemsContext) as ItemsContextType;

     const [imdbCardvisible, setImdbCardvisible] = useState(false);
     const [imdbJSON, setImdbJSON] = useState([]);

     const closeIMDBCard = () => {
          setImdbJSON([]);
          setImdbCardvisible(false);
     }

     useEffect(() => {
          setActiveRoute("Items");
          setIsAdding(false);
          setIsEditing(false);
     }, [setActiveRoute, setIsAdding, setIsEditing]);

     useEffect(() => {
          if (typeof imdbJSON !== "undefined" && imdbJSON !== null && Object.keys(imdbJSON).length > 0 && !imdbCardvisible) {
               setImdbCardvisible(true);
          }
     }, [imdbJSON]);

     return (
          <>
               {!isLoading && watchListItemsSortingCheck === APIStatus.Success && !imdbCardvisible &&
                    <>
                         {!searchModalVisible &&
                              <span className="top">
                                   <NavBar />
                              </span>
                         }

                         <span className="displayInline topMarginContent">
                              <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"} ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchListItems?.map((currentWatchListItem: IWatchListItem, index: number) => {
                                        return (
                                             <WatchListItemCard key={index} currentWatchListItem={currentWatchListItem} setImdbJSON={setImdbJSON} />
                                        );
                                   })}
                              </ul>
                         </span>

                         <span className="bottom">
                              <NavBar IsBottomNav={true} />
                         </span>
                    </>
               }

               {!isLoading && watchListItemsSortingCheck === APIStatus.Success && filteredWatchListItems && filteredWatchListItems.length === 0 &&
                    <h1>No results</h1>
               }

               {imdbCardvisible &&
                    <IMDBCard closeIMDBCard={closeIMDBCard} darkMode={darkMode} IMDB_JSON={imdbJSON} />
               }
          </>
     )
}