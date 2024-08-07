"use client"

const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

const IWatchListSource = require("./interfaces/IWatchListSource");
const IWatchListType = require("./interfaces/IWatchListType");
import SearchIMDB from "./components/SearchIMDB";
import Settings from "./components/Settings";
import { DataContext, DataContextType } from "./data-context";

const SharedLayout = () => {
     const {
          activeRoute,
          activeRouteDisplayName,
          demoMode,
          isError,
          isLoggedIn,
          SearchIconComponent,
          searchVisible,
          setSourceFilter,
          setStillWatching,
          SettingsIconComponent,
          settingsVisible,
          setTypeFilter,
          setWatchListSortColumn,
          setWatchListSortDirection,
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
          watchListTypesLoadingComplete
     } = useContext(DataContext) as DataContextType

     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);
     }, []);

     if (!isLoggedIn || !isClient) {
          return <></>
     }

     return (
          <>
               {!isError &&
                    <>
                         {isLoggedIn && watchListSourcesLoadingComplete && watchListTypesLoadingComplete &&
                              <>
                                   <span className="menuBar">
                                        <span className="leftMargin menuBarActiveRoute">{activeRouteDisplayName}{demoMode ? " (Demo)" : ""}</span>

                                        {activeRoute === "WatchList" &&
                                             <>
                                                  <span className="firstItem leftMargin foregroundColor">
                                                       <span className="stillWatching">Still Watching</span>
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
                                                  <span className="firstItem leftMargin foregroundColor">
                                                       <span>Source</span>
                                                  </span>


                                                  <span title="Filter by source">
                                                       <select className="selectStyle" value={sourceFilter} onChange={(event) => setSourceFilter(parseInt(event.target.value, 10))}>
                                                            <option value="-1">Please select</option>

                                                            {watchListSources?.map((watchListSource: typeof IWatchListSource, index: number) => {
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

                                        {(activeRoute === "WatchList" || activeRoute === "WatchListItems") &&
                                             <>
                                                  <span className="firstItem leftMargin foregroundColor">
                                                       <span>Type</span>
                                                  </span>

                                                  <span title="Filter by type">
                                                       <select className="selectStyle" value={typeFilter} onChange={(event) => setTypeFilter(parseInt(event.target.value, 10))}>
                                                            <option value="-1">Please select</option>

                                                            {watchListTypes?.map((watchListType: typeof IWatchListType, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListType.WatchListTypeID}>
                                                                           {watchListType.WatchListTypeName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  </span>

                                                  <span className="firstItem foregroundColor leftMargin">
                                                       <span>Sort By</span>
                                                  </span>

                                                  <span title="Sort by">
                                                       <select className="selectStyle" value={watchListSortColumn} onChange={(event) => setWatchListSortColumn(event.target.value)}>
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

                                                            {activeRoute === "WatchListItems" &&
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
                                                       <select className="selectStyle" value={watchListSortDirection} onChange={(event) => setWatchListSortDirection(event.target.value)}>
                                                            <option value="ASC">ASC</option>
                                                            <option value="DESC">DESC</option>
                                                       </select>
                                                  </span>

                                                  <span className="clickable leftMargin searchIcon" style={{ color: "white" }} onClick={showSearch}>
                                                       {SearchIconComponent}
                                                  </span>
                                             </>
                                        }

                                        <span className="clickable leftMargin settingsIcon" style={{ color: "white" }} onClick={showSettings}>
                                             {SettingsIconComponent}
                                        </span>
                                   </span>
                              </>
                         }

                         {searchVisible &&
                              <SearchIMDB />
                         }

                         {settingsVisible &&
                              <Settings />
                         }
                    </>
               }
          </>
     )
}

export default SharedLayout;