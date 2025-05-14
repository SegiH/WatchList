"use client"

import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import Search from "./components/Search";
import Settings from "./components/Settings";
import IWatchListSource from "./interfaces/IWatchListSource";
import IWatchListType from "./interfaces/IWatchListType";

import { APIStatus, DataContext, DataContextType } from "./data-context";

import "./page.css";
import IUserOption from "./interfaces/IUserOption";
import { Button } from "@mui/material";

const SharedLayout = () => {
     const {
          activeRoute,
          AddIconComponent,
          darkMode,
          demoMode,
          getDisplayName,
          hideTabs,
          imdbSearchEnabled,
          isAdmin,
          isEnabled,
          isError,
          isLoading,
          loggedInCheck,
          openDetailClickHandler,
          routeList,
          saveOptions,
          SearchIconComponent,
          searchInputVisible,
          searchModalVisible,
          searchTerm,
          setActiveRouteDisplayName,
          setSourceFilter,
          setStillWatching,
          SettingsIconComponent,
          settingsVisible,
          setActiveRoute,
          setCurrentPage,
          setIsLoading,
          setSearchInputVisible,
          setSearchModalVisible,
          setSearchTerm,
          setTypeFilter,
          setWatchListSortColumn,
          setWatchListSortDirection,
          showSettings,
          sourceFilter,
          typeFilter,
          stillWatching,
          watchListItemsSortColumns,
          watchListSortColumn,
          watchListSortColumns,
          watchListSortDirection,
          watchListSources,
          watchListSourcesLoadingCheck,
          watchListTypes,
          watchListTypesLoadingCheck
     } = useContext(DataContext) as DataContextType

     const [isClient, setIsClient] = useState(false);

     const inputRef = useRef<HTMLInputElement>(null);
     const router = useRouter();

     const settingChangeHandler = async (name: string, value: string | number | boolean) => {
          const options: IUserOption = {}

          setIsLoading(true);

          switch (name) {
               case "StillWatching":
                    options["StillWatching"] = (value === true ? 1 : 0);
                    setStillWatching(value as boolean);
                    break;
               case "SourceFilter":
                    options["SourceFilter"] = (value as number);
                    setSourceFilter(value as number);
                    break;
               case "TypeFilter":
                    options["TypeFilter"] = (value as number);
                    setTypeFilter(value as number);
                    break;
               case "SortColumn":
                    options["SortColumn"] = value;
                    setWatchListSortColumn(value as string);
                    break;
               case "SortDirection":
                    options["SortDirection"] = value;
                    setWatchListSortDirection(value as string);
                    break;
          }

          saveOptions(options);

          setCurrentPage(1);

          setIsLoading(false);
     }

     const tabChangeHandler = async (newTab: string) => {
          setActiveRoute(newTab);

          if (newTab === "WatchList" || newTab === "Items") {
               setCurrentPage(1);
          }

          router.push("/" + newTab);

          const displayName = getDisplayName(newTab);

          setActiveRouteDisplayName(displayName);
     }

     const toggleSearch = () => {
          if (!searchInputVisible) {
               setSearchTerm("");

               setTimeout(function () {
                    if (inputRef.current) {
                         inputRef.current.focus();
                    }
               }, 500);
          }

          setSearchInputVisible(!searchInputVisible);
     }

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);
     }, []);

     // This is the only way to really set the body class based on dark mode
     useEffect(() => {
          document.body.className = darkMode ? 'darkMode' : '';
     }, [darkMode]);

     if (loggedInCheck !== APIStatus.Success || !isClient) {
          return <></>
     }

     return (
          <span>
               {!isError &&
                    <>
                         {isLoading &&
                              <div className="bouncing-loader">
                                   <span className="bouncing-loader-text">Loading</span>
                                   <div className="bubble"></div>
                                   <div className="bubble"></div>
                                   <div className="bubble"></div>
                              </div>
                         }

                         {loggedInCheck === APIStatus.Success && watchListSourcesLoadingCheck === APIStatus.Success && watchListTypesLoadingCheck === APIStatus.Success && !isLoading && activeRoute !== "Stats" &&
                              <>
                                   <span className={`menuBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        {demoMode &&
                                             <span className={`leftMargin menuBarActiveRoute${!darkMode ? " lightMode" : " darkMode"}`}>Demo</span>
                                        }

                                        {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                             <>
                                                  <span className={`clickable leftMargin50${!darkMode ? " lightMode" : " darkMode"}`} onClick={toggleSearch}>
                                                       {SearchIconComponent}
                                                  </span>

                                                  <span className={`clickable leftMargin${!darkMode ? " lightMode" : " darkMode"} searchInputStyle ${searchInputVisible ? "visible" : ""}`}>
                                                       <input className={`inputStyle lightMode`} ref={inputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                                                  </span>
                                             </>
                                        }

                                        {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                             <>
                                                  {searchInputVisible && imdbSearchEnabled &&
                                                       <Button variant="contained" className={`imdbButton ${searchInputVisible ? "visible" : ""}`} style={{ marginLeft: "30px" }} onClick={() => setSearchModalVisible(true)}>IMDB</Button>
                                                  }

                                                  {!isError && (
                                                       <span className={`bottomMargin20 clickable customTopMargin leftMargin40 ${!darkMode ? " lightMode" : " darkMode"}`} onClick={() => openDetailClickHandler(-1)}>
                                                            {AddIconComponent}
                                                       </span>
                                                  )}
                                             </>
                                        }

                                        {hideTabs &&
                                             <>
                                                  <span className="leftMargin">
                                                       <span className={`stillWatching${!darkMode ? " lightMode" : " darkMode"}`}>Tab</span>
                                                  </span>

                                                  <span title="Section">
                                                       <select className="leftMargin selectStyle" value={activeRoute !== null ? activeRoute : ""} onChange={(event) => tabChangeHandler(event.target.value)}>
                                                            {Object.keys(routeList)
                                                                 .filter((routeName) => {
                                                                      return routeList[routeName].RequiresAuth === true
                                                                           && routeName !== "Setup"
                                                                           && routeName !== "Search"
                                                                           && (routeName !== "Admin" || (routeName === "Admin" && isAdmin() === true && isEnabled("Admin")))
                                                                           && (routeName !== "Items" || (routeName === "Items" && isEnabled("Items")))
                                                                           && (routeName !== "BugLogs" || (routeName === "BugLogs" && isEnabled("BugLogs") && !demoMode))
                                                                           && (routeName !== "Stats" || (routeName === "Stats" && isEnabled("Stats")))
                                                                 }
                                                                 )
                                                                 .sort().map((routeName, index) => {
                                                                      return (
                                                                           <option key={index} value={routeName}>
                                                                                {routeList[routeName].DisplayName}
                                                                           </option>
                                                                      );
                                                                 })}
                                                       </select>
                                                  </span>
                                             </>
                                        }

                                        {activeRoute === "WatchList" &&
                                             <>
                                                  <span className="firstItem leftMargin">
                                                       <span className={`stillWatching${!darkMode ? " lightMode" : " darkMode"}`}>Still Watching</span>
                                                  </span>

                                                  <span title="Stuff you are still watching">
                                                       <label className="leftMargin switch">
                                                            <input type="checkbox" checked={stillWatching} onChange={(event) => settingChangeHandler("StillWatching", event.target.checked)} />
                                                            <span className="slider round"></span>
                                                       </label>
                                                  </span>
                                             </>
                                        }

                                        {activeRoute === "WatchList" &&
                                             <>
                                                  <span className={`firstItem leftMargin${!darkMode ? " lightMode" : " darkMode"}`}>
                                                       <span>Source</span>
                                                  </span>


                                                  <span title="Filter by source">
                                                       <select className="selectStyle" value={sourceFilter} onChange={(event) => setSourceFilter(parseInt(event.target.value, 10))}>
                                                            <option value="-1">Please select</option>

                                                            {watchListSources?.map((watchListSource: IWatchListSource, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListSource.WatchListSourceID}>
                                                                           {watchListSource.WatchListSourceName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  </span>
                                             </>
                                        }

                                        {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                             <>
                                                  <span className={`firstItem leftMargin ${!darkMode ? " lightMode" : " darkMode"}`}>
                                                       <span>Type</span>
                                                  </span>

                                                  <span title="Filter by type">
                                                       <select className="selectStyle" value={typeFilter} onChange={(event) => settingChangeHandler("TypeFilter", parseInt(event.target.value, 10))}>
                                                            <option value="-1">Please select</option>

                                                            {watchListTypes?.map((watchListType: IWatchListType, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListType.WatchListTypeID}>
                                                                           {watchListType.WatchListTypeName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  </span>

                                                  <span className={`firstItem leftMargin${!darkMode ? " lightMode" : " darkMode"}`}>
                                                       <span>Sort By</span>
                                                  </span>

                                                  <span title="Sort by">
                                                       <select className="selectStyle" value={watchListSortColumn} onChange={(event) => settingChangeHandler("SortColumn", event.target.value)}>
                                                            {activeRoute === "WatchList" &&
                                                                 Object.keys(watchListSortColumns).filter((sortColumn) => {
                                                                      return sortColumn !== "EndDate" || (sortColumn === "EndDate" && !stillWatching);
                                                                 }).map((sortColumn: string, index: number) => {
                                                                      return (
                                                                           <option key={index} value={sortColumn}>
                                                                                {watchListSortColumns[sortColumn]}
                                                                           </option>
                                                                      );
                                                                 })
                                                            }

                                                            {activeRoute === "Items" &&
                                                                 Object.keys(watchListItemsSortColumns).map((sortColumn: string, index: number) => {
                                                                      return (
                                                                           <option key={index} value={sortColumn}>
                                                                                {watchListItemsSortColumns[sortColumn]}
                                                                           </option>
                                                                      );
                                                                 })
                                                            }
                                                       </select>
                                                  </span>

                                                  <span className="leftMargin" title="Sort direction">
                                                       <select className="selectStyle" value={watchListSortDirection} onChange={(event) => settingChangeHandler("SortDirection", event.target.value)}>
                                                            <option value="ASC">ASC</option>
                                                            <option value="DESC">DESC</option>
                                                       </select>
                                                  </span>
                                             </>
                                        }

                                        <span className={`clickable leftMargin settingsIcon${!darkMode ? " lightMode" : " darkMode"}`} onClick={showSettings}>
                                             {SettingsIconComponent}
                                        </span>
                                   </span>

                                   {searchModalVisible &&
                                        <Search />
                                   }

                                   {settingsVisible &&
                                        <Settings />
                                   }
                              </>
                         }
                    </>
               }
          </span>
     )
}

export default SharedLayout;