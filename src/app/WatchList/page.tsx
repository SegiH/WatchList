"use client"

import { useContext, useEffect } from "react";
import { DataContext, DataContextType } from "../data-context";
import IWatchList from "../interfaces/IWatchList";
import React from "react";

import "../page.css";
import NavBar from "../components/NavBar";

const WatchListCard = React.lazy(() => import('./WatchListCard'));

export default function WatchList() {
     const {
          darkMode,
          filteredWatchList,
          hideTabs,
          isLoading,
          setActiveRoute,
          setIsAdding,
          setIsEditing
     } = useContext(DataContext) as DataContextType;

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

               {!isLoading && filteredWatchList.length === 0 &&
                    <h3 className="topMargin100">No WatchList</h3>
               }
          </>
     )
}