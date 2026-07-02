"use client"

import { useContext, useEffect, useRef, useState } from "react";
import { APIStatus, WatchListContext } from "../context";
import IWatchList from "../interfaces/IWatchList";

import "../page.css";
import { WatchListContextType } from "../contexts/WatchListContextType";

import { Button } from "@mui/material";
import IMDBCard from "../components/IMDBCard";
import PageNavigationBar from "../components/PageNavigationBar/PageNavigationBar";
import WatchListCard from "./WatchListCard";
import { useRouter } from "next/navigation";

export default function WatchList() {
     const {
          autoAdd, filteredWatchList, hideTabs, imdbSearchEnabled, isLoading, lastPage, searchModalVisible, searchTerm, setActiveRoute, setIsAdding, setIsEditing, setSearchModalVisible, watchListSortingCheck
     } = useContext(WatchListContext) as WatchListContextType;

     const router = useRouter();

     const [imdbCardvisible, setImdbCardvisible] = useState(false);
     const [imdbJSON, setImdbJSON] = useState<[] | null>(null);

     const topRef = useRef<HTMLDivElement | null>(null);

     const closeIMDBCard = () => {
          setImdbJSON(null);
          setImdbCardvisible(false);
     }

     const searchModalVisibleClickHandler = async (showHide: boolean) => {
          if (searchTerm !== "") {
               if (/^tt\d{7,}$/.test(searchTerm)) {
                    const searchIMDBResponse = await fetch(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${1}`, { credentials: 'include' });

                    const searchIMDBResult = await searchIMDBResponse.json();

                    if (searchIMDBResult[0] !== "OK" && searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS") {
                         alert(searchIMDBResult[1]);
                         return;
                    }

                    if (!autoAdd && searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS") {
                         alert("The WatchList Item has been added");
                         return;
                    }

                    if (autoAdd) {
                         setIsAdding(true);

                         router.push(`/WatchList/Dtl?WatchListItemID=${searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS" ? searchIMDBResult[2] : searchIMDBResult[2]}`);
                    }

                    return;
               } else {
                    setSearchModalVisible(showHide);
               }
          }
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
                    <h1 className="topMargin100"><Button variant="contained" color="secondary" style={{ marginLeft: "10px" }} onClick={() => searchModalVisibleClickHandler(true)}>IMDB</Button></h1>
               }

               {!isLoading && filteredWatchList && filteredWatchList.length > 0 && !imdbCardvisible &&
                    <>
                         {!searchModalVisible &&
                              <span className="top">
                                   <PageNavigationBar topRef={topRef} />
                              </span>
                         }

                         <span className="topMarginContent">
                              <ul className={`show-list ${hideTabs ? "noTabs" : ""}`}>
                                   {filteredWatchList?.map((currentWatchList: IWatchList) => {
                                        return (
                                             <WatchListCard key={currentWatchList.WatchListID} currentWatchList={currentWatchList} setImdbJSON={setImdbJSON} />
                                        );
                                   })}
                              </ul>
                         </span>

                         {!searchModalVisible &&
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