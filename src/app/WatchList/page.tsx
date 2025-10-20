"use client"

import { useContext, useEffect } from "react";
import { APIStatus, WatchListContext } from "../data-context";
import IWatchList from "../interfaces/IWatchList";
import React from "react";

import "../page.css";
import NavBar from "../components/NavBar";
import { WatchListContextType } from "../interfaces/contexts/WatchListContextType";

import WatchListCard from "./WatchListCard";

export default function WatchList() {
     const {
          darkMode, filteredWatchList, hideTabs, isLoading, setActiveRoute, setIsAdding, setIsEditing, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     useEffect(() => {
          setActiveRoute("WatchList");
          setIsAdding(false);
          setIsEditing(false);
     }, [setActiveRoute, setIsAdding, setIsEditing]);

     return (
          <>
               {!isLoading && filteredWatchList && filteredWatchList.length > 0 &&
                    <>
                         <span className="top">
                              <NavBar />
                         </span>

                         <span className="topMarginContent">
                              <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"} ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList, index: number) => {
                                        return (
                                             <WatchListCard key={index} currentWatchList={currentWatchList} />
                                        );
                                   })}
                              </ul>
                         </span>

                         <span className="bottom">
                              <NavBar />
                         </span>
                    </>
               }

               {!isLoading && watchListSortingCheck === APIStatus.Success && filteredWatchList && filteredWatchList.length === 0 &&
                    <h1 className="topMargin100">No results</h1>
               }
          </>
     )
}