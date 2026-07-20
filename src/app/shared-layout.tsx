"use client"

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import SearchIMDB from "./components/SearchIMDB";
import HamburgerMenu from "./components/HamburgerMenu";
import Loader from "./components/Loader";

import { APIStatus, SharedLayoutContext } from "./context";
import { SharedLayoutContextType } from "./contexts/SharedLayoutContextType";
import { Button } from "@mui/material";
import ISearchImdb from "./interfaces/ISearchImdb";

const SharedLayout = () => {
     const {
          activeRoute, autoAdd, currentWatchListPage, darkMode, demoModeNotificationVisible, imdbSearchEnabled, isError, isLoading, lastPage, loggedInCheck, modalVisible, searchTerm, setIsAdding, setModalVisible, setNewPage, setSearchTerm
     } = useContext(SharedLayoutContext) as SharedLayoutContextType

     const router = useRouter();
     const topRef = useRef<HTMLDivElement | null>(null);

     const [imdbSearchResults, setIMDBSearchResults] = useState<ISearchImdb[]>([]);
     const [isClient, setIsClient] = useState(false);

     const inputRef = useRef<HTMLInputElement>(null);

     const IMDBSearchClickHandler = async () => {
          if (searchTerm !== "") {
               const searchIMDBResponse = await fetch(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${5}`, { credentials: 'include' });

               const searchIMDBResult = await searchIMDBResponse.json();

               if (searchIMDBResult[0] !== "OK" && searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS") {
                    alert(searchIMDBResult[1]);
                    return;
               }

               if (/^tt\d{7,}$/.test(searchTerm)) {
                    if (!autoAdd && searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS") {
                         alert("The WatchList Item has been added");
                         return;
                    }

                    if (autoAdd) {
                         setIsAdding(true);

                         setModalVisible(true);

                         router.push(`/WatchList/Dtl?WatchListItemID=${searchIMDBResult[0] !== "ERROR-ALREADY-EXISTS" ? searchIMDBResult[2] : searchIMDBResult[2]}`);
                    }

                    return;
               } else {
                    // Will return [{}] if no results
                    if (searchIMDBResult[1].lengh <= 1) {
                         alert("No Results");
                    } else {
                         setIMDBSearchResults(searchIMDBResult[1]);
                    }
               }
          }
     }

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

     // This is the only way to really set the body class based on dark mode
     useEffect(() => {
          document.body.className = darkMode ? 'darkMode' : '';
     }, [darkMode]);

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

                         {(activeRoute === "WatchList" || activeRoute === "Items") && currentWatchListPage > 1 &&
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
                                        <span>
                                             <span className={`leftMargin125 ${demoModeNotificationVisible === true ? "demoNotificationVisible" : ""}`}>
                                                  {!modalVisible &&
                                                       <HamburgerMenu />
                                                  }

                                                  <span className={`activeRoute leftMargin50 ${activeRoute === "WatchList" || activeRoute === "Items" ? "activeRouteHidden" : ""}`}>{activeRoute}</span>

                                                  {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                                       <span className="searchContainer">
                                                            <span className={`clickable searchInputStyle`}>
                                                                 <input ref={inputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                                                            </span>

                                                            {!isLoading && searchTerm !== "" && imdbSearchEnabled &&
                                                                 <Button className="IMDBSearchButton" variant="contained" color="secondary" onClick={() => IMDBSearchClickHandler()}>IMDB</Button>
                                                            }
                                                       </span>
                                                  }
                                             </span>
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