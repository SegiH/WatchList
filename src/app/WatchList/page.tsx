"use client"

import { useContext, useEffect, useState } from "react";
import { APIStatus, WatchListContext } from "../data-context";
import IWatchList from "../interfaces/IWatchList";
import React from "react";

import "../page.css";
import NavBar from "../components/NavBar";
import { WatchListContextType } from "../interfaces/contexts/WatchListContextType";

import WatchListCard from "./WatchListCard";
import IMDBCard from "../components/IMDBCard";

export default function WatchList() {
     const {
          darkMode, filteredWatchList, hideTabs, isLoading, setActiveRoute, setIsAdding, setIsEditing, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     const [imdbCardvisible, setImdbCardvisible] = useState(false);
     const [imdbJSON, setImdbJSON] = useState<any | null>(null);

     const closeIMDBCard = () => {
          setImdbJSON([]);
          setImdbCardvisible(false);
     }

     useEffect(() => {
          setActiveRoute("WatchList");
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
               {!isLoading && filteredWatchList && filteredWatchList.length > 0 && !imdbCardvisible &&
                    <>
                         <span className="top">
                              <NavBar />
                         </span>

                         <span className="topMarginContent">
                              <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"} ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList) => {
                                        return (
                                             <WatchListCard key={currentWatchList.WatchListID} currentWatchList={currentWatchList} setImdbJSON={setImdbJSON} />
                                        );
                                   })}
                              </ul>
                         </span>

                         <span className={`bottom ${hideTabs ? "noTabs" : ""}`}>
                              <NavBar IsBottomNav={true} />
                         </span>
                    </>
               }

               {!isLoading && watchListSortingCheck === APIStatus.Success && filteredWatchList && filteredWatchList.length === 0 &&
                    <h1 className="topMargin100">No results</h1>
               }

               {imdbCardvisible &&
                    <IMDBCard closeIMDBCard={closeIMDBCard} darkMode={darkMode} IMDB_JSON={imdbJSON} />
               }
          </>
     )
}