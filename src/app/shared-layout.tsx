"use client"

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchIMDB from "./components/SearchIMDB";
import Settings from "./components/Settings";
import IWatchListSource from "./interfaces/IWatchListSource";
import IWatchListType from "./interfaces/IWatchListType";

import { DataContext, DataContextType } from "./data-context";

import "./page.css";

const SharedLayout = () => {
     const {
          activeRoute,
          activeRouteDisplayName,
          AddIconComponent,
          darkMode,
          demoMode,
          getDisplayName,
          hideTabs,
          isAdmin,
          isEnabled,
          isError,
          isLoggedIn,
          openDetailClickHandler,
          routeList,
          SearchIconComponent,
          searchVisible,
          setActiveRouteDisplayName,
          setSourceFilter,
          setStillWatching,
          SettingsIconComponent,
          settingsVisible,
          setActiveRoute,
          setTypeFilter,
          setWatchListItemsSortingComplete,
          setWatchListSortColumn,
          setWatchListSortDirection,
          setWatchListSortingComplete,
          showSearch,
          showSettings,
          sourceFilter,
          typeFilter,
          stillWatching,
          watchListItemsSortColumns,
          watchListSortColumn,
          watchListSortColumns,
          watchListSortDirection,
          watchListSources,
          watchListSourcesLoadingComplete,
          watchListTypes,
          watchListTypesLoadingComplete,
     } = useContext(DataContext) as DataContextType

     const [isClient, setIsClient] = useState(false);

     const router = useRouter();

     const resort = () => {
          if (activeRoute === "WatchList") {
               setWatchListSortingComplete(false);
          } else if (activeRoute === "Items") {
               setWatchListItemsSortingComplete(false);
          }
     }

     const tabChangeHandler = async (newTab: string) => {
          setActiveRoute(newTab);

          router.push("/" + newTab);

          const displayName = getDisplayName(newTab);

          setActiveRouteDisplayName(displayName);
     }

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);
     }, []);

     // This is the only way to really set the  body class based on dark mode
     useEffect(() => {
          document.body.className = darkMode ? 'darkMode' : '';
     }, [darkMode]);

     if (!isLoggedIn || !isClient) {
          return <></>
     }

     return (
          <span>
               {!isError &&
                    <>
                         {isLoggedIn && watchListSourcesLoadingComplete && watchListTypesLoadingComplete &&
                              <>
                                   <span className={`menuBar ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        {demoMode &&
                                             <span className={`leftMargin menuBarActiveRoute${!darkMode ? " lightMode" : " darkMode"}`}>Demo</span>
                                        }

                                        {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                             <>
                                                  <span className={`clickable leftMargin50${!darkMode ? " lightMode" : " darkMode"}`} onClick={showSearch}>
                                                       {SearchIconComponent}
                                                  </span>

                                                  {isLoggedIn && !isError && (
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
                                                                           && routeName !== "SearchIMDB"
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
                                                            <input type="checkbox" checked={stillWatching} onChange={(event) => setStillWatching(event.target.checked)} />
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
                                                       <select className="selectStyle" value={typeFilter} onChange={(event) => setTypeFilter(parseInt(event.target.value, 10))}>
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
                                                       <select className="selectStyle" value={watchListSortColumn} onChange={(event) => { setWatchListSortColumn(event.target.value); resort(); }}>
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
                                                       <select className="selectStyle" value={watchListSortDirection} onChange={(event) => { setWatchListSortDirection(event.target.value); resort(); }}>
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

                                   {searchVisible &&
                                        <SearchIMDB />
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