"use client"

import { useContext, useEffect, useRef, useState } from "react";

import SearchIMDB from "./components/SearchIMDB";
import HamburgerMenu from "./components/HamburgerMenu/HamburgerMenu";

import { APIStatus, SharedLayoutContext } from "./context";

import "./page.css";
import Loader from "./components/Loader";
import { SharedLayoutContextType } from "./contexts/SharedLayoutContextType";

const SharedLayout = () => {
     const {
          activeRoute, darkMode, demoModeNotificationVisible, imdbSearchEnabled, isError, isLoading, loggedInCheck, searchModalVisible, searchTerm, setDemoModeNotificationVisible, setSearchTerm
     } = useContext(SharedLayoutContext) as SharedLayoutContextType

     const [isClient, setIsClient] = useState(false);

     const inputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);

          inputRef.current?.focus();
     }, []);

     // This is the only way to really set the body class based on dark mode
     useEffect(() => {
          document.body.className = darkMode ? 'darkMode' : '';
     }, [darkMode]);

     if (loggedInCheck !== APIStatus.Success || !isClient) {
          return <></>
     }

     return (
          <>
               <span>
                    {!isError && activeRoute !== "" &&
                         <>
                              {isLoading &&
                                   <Loader />
                              }

                              {loggedInCheck === APIStatus.Success &&
                                   <span>
                                        <span className={`leftMargin75 topBar ${!darkMode ? "lightMode" : "darkMode"} ${demoModeNotificationVisible === true ? "demoNotificationVisible" : ""}`}>
                                             {!searchModalVisible &&
                                                  <HamburgerMenu />
                                             }

                                             {(activeRoute === "Stats" || activeRoute === "Admin" || activeRoute === "BugLogs" || activeRoute === "Data") &&
                                                  <span className={`leftMargin50 topBarActiveRoute${!darkMode ? " lightMode" : " darkMode"}`}>{activeRoute}</span>
                                             }

                                             {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                                  <>
                                                       <span className={`clickable leftMargin60 maxWidth ${!darkMode ? " lightMode" : " darkMode"} searchInputStyle visible`}>
                                                            <input className={`inputStyle lightMode fullWidthInput ${imdbSearchEnabled ? " imdbSearchEnabled" : ""}`} ref={inputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                                                       </span>
                                                  </>
                                             }
                                        </span>

                                        {searchModalVisible &&
                                             <SearchIMDB />
                                        }
                                   </span>
                              }
                         </>
                    }
               </span>
          </>
     )
}

export default SharedLayout;