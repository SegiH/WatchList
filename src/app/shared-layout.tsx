"use client"

import { useContext, useEffect, useRef, useState } from "react";
import SearchIMDB from "./components/SearchIMDB";
import HamburgerMenu from "./components/HamburgerMenu";
import Loader from "./components/Loader";

import { APIStatus, SharedLayoutContext } from "./context";
import { SharedLayoutContextType } from "./contexts/SharedLayoutContextType";
import { Button } from "@mui/material";

const SharedLayout = () => {
     const {
          activeRoute, currentItemsPage, currentWatchListPage, demoModeNotificationVisible, IMDBSearchClickHandler, imdbSearchEnabled, imdbSearchResults, isError, isLoading, lastPage, loggedInCheck, modalVisible, searchTerm, setIMDBSearchResults, setModalVisible, setNewPage, setSearchTerm
     } = useContext(SharedLayoutContext) as SharedLayoutContextType

     const topRef = useRef<HTMLDivElement | null>(null);     
     const [isClient, setIsClient] = useState(false);

     const inputRef = useRef<HTMLInputElement>(null);     

     const pageClickHandler = (adjustValue: number) => {
          if (typeof topRef !== "undefined" && topRef !== null && topRef.current !== null && topRef.current.scrollIntoView !== null) {
               topRef.current?.scrollIntoView({ behavior: "smooth" });
          }

          setNewPage(adjustValue);
     }

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);

          inputRef.current?.focus();
     }, []);

     useEffect(() => {
          if (imdbSearchResults.length > 0) {
               setModalVisible(true);
          }
     }, [imdbSearchResults]);

     useEffect(() => {
          if (!modalVisible) {
               setIMDBSearchResults([]);
          }
     }, [modalVisible]);

     if (loggedInCheck !== APIStatus.Success || !isClient) {
          return <></>
     }

     return (
          <>
               {modalVisible && imdbSearchResults.length > 0 &&
                    <SearchIMDB imdbSearchResults={imdbSearchResults} setIMDBSearchResults={setIMDBSearchResults} />
               }

               {!modalVisible &&
                    <span className="sharedLayout">
                         <div ref={topRef}></div>

                         {((activeRoute === "WatchList" && currentWatchListPage > 1) || (activeRoute === "Items" && currentItemsPage > 1)) &&
                              <span className="pageNavigationBarLeftTop">
                                   <span onClick={() => pageClickHandler(-1)}>&#8592;</span>
                              </span>
                         }

                         {!isError && activeRoute !== "" &&
                              <>
                                   {isLoading &&
                                        <Loader />
                                   }

                                   {loggedInCheck === APIStatus.Success &&
                                        <span className={`leftMargin sharedLayoutControls ${demoModeNotificationVisible === true ? "demoNotificationVisible" : ""}`}>
                                             {!modalVisible &&
                                                  <span>
                                                       <HamburgerMenu />
                                                  </span>
                                             }

                                             <span className={`activeRoute leftMargin50 ${activeRoute === "WatchList" || activeRoute === "Items" ? "activeRouteHidden" : ""}`}>{activeRoute}</span>

                                             {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                                  <span>
                                                       <span className={`searchInputStyle`}>
                                                            <input ref={inputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                                                       </span>

                                                       {!isLoading && searchTerm !== "" && imdbSearchEnabled &&
                                                            <Button className="IMDBSearchButton" variant="contained" color="secondary" onClick={() => IMDBSearchClickHandler()}>IMDB</Button>
                                                       }
                                                  </span>
                                             }
                                        </span>
                                   }
                              </>
                         }

                         {(activeRoute === "WatchList" || activeRoute === "Items") && !lastPage &&
                              <span className={`pageNavigationBarRightTop`} onClick={() => pageClickHandler(1)}>&#8594;</span>
                         }
                    </span>
               }
          </>
     )
}

export default SharedLayout;