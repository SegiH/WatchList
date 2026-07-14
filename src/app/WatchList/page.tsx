"use client"

import { useContext, useEffect, useState } from "react";
import { APIStatus, WatchListContext } from "../context";
import IWatchList from "../interfaces/IWatchList";

import { WatchListContextType } from "../contexts/WatchListContextType";

import IMDBCard from "../components/IMDBCard";
import PageNavigationBar from "../components/PageNavigationBar";
import WatchListCard from "./WatchListCard";

export default function WatchList() {
     const {
          filteredWatchList, hideTabs, imdbSearchEnabled, isLoading, lastPage, modalVisible, setActiveRoute, setIsAdding, setIsEditing, setModalVisible, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     const [imdbCardvisible, setImdbCardvisible] = useState(false);
     const [imdbJSON, setImdbJSON] = useState<[] | null>(null);

     const closeIMDBCard = () => {
          setImdbJSON(null);
          setImdbCardvisible(false);
          setModalVisible(false);
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
               {!isLoading && filteredWatchList && filteredWatchList.length > 0 && !imdbCardvisible && !modalVisible &&
                    <>
                         <span>
                              <ul className={`show-list ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList) => {
                                        return (
                                             <WatchListCard key={currentWatchList.WatchListID} currentWatchList={currentWatchList} setImdbJSON={setImdbJSON} />
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

               {!isLoading && watchListSortingCheck === APIStatus.Success && filteredWatchList && filteredWatchList.length === 0 && !imdbSearchEnabled &&
                    <h1 className="topMargin100">No results</h1>
               }

               {imdbCardvisible &&
                    <IMDBCard closeIMDBCard={closeIMDBCard} IMDB_JSON={imdbJSON} />
               }
          </>
     )
}