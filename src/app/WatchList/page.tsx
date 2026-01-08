"use client"

import { useContext, useEffect, useRef, useState } from "react";
import { APIStatus, WatchListContext } from "../context";
import IWatchList from "../interfaces/IWatchList";
import React from "react";

import "../page.css";
import NavBar from "../components/NavBar";
import { WatchListContextType } from "../contexts/WatchListContextType";

import WatchListCard from "./WatchListCard";
import IMDBCard from "../components/IMDBCard";
import { Button } from "@mui/material";

export default function WatchList() {
     const {
          darkMode, filteredWatchList, hideTabs, imdbSearchEnabled, isLoading, lastPage, searchModalVisible, searchTerm, setActiveRoute, setIsAdding, setIsEditing, setSearchModalVisible, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     const [imdbCardvisible, setImdbCardvisible] = useState(false);
     const [imdbJSON, setImdbJSON] = useState<[] | null>(null);

     const topRef = useRef<HTMLDivElement | null>(null);

     const closeIMDBCard = () => {
          setImdbJSON(null);
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
               <div ref={topRef} ></div>

               {!isLoading && searchTerm !== "" && imdbSearchEnabled &&
                    <h1 className="topMargin100">{filteredWatchList.length === 0 ? "No Results" : ""}<Button variant="contained" color="secondary" style={{ marginLeft: "20px" }} onClick={() => setSearchModalVisible(true)}>IMDB</Button></h1>
               }

               {!isLoading && filteredWatchList && filteredWatchList.length > 0 && !imdbCardvisible &&
                    <>
                         {!searchModalVisible &&
                              <span className="top">
                                   <NavBar topRef={topRef} />
                              </span>
                         }

                         <span className="topMarginContent">
                              <ul className={`show-list${!darkMode ? " lightMode" : " darkMode"} ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList) => {
                                        return (
                                             <WatchListCard key={currentWatchList.WatchListID} currentWatchList={currentWatchList} setImdbJSON={setImdbJSON} />
                                        );
                                   })}
                              </ul>
                         </span>

                         {!searchModalVisible &&
                              <span className={`${lastPage ? "lastPage" : ""} ${hideTabs ? "noTabs" : ""}`}>
                                   <NavBar IsBottomNav={true} topRef={topRef} />
                              </span>
                         }
                    </>
               }

               {!isLoading && watchListSortingCheck === APIStatus.Success && filteredWatchList && filteredWatchList.length === 0 && !imdbSearchEnabled &&
                    <h1 className="topMargin100">No results</h1>
               }

               {imdbCardvisible &&
                    <IMDBCard closeIMDBCard={closeIMDBCard} darkMode={darkMode} IMDB_JSON={imdbJSON} />
               }
          </>
     )
}