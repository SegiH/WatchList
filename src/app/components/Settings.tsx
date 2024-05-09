const IWatchListSource = require("../interfaces/IWatchListSource");
const IWatchListType = require("../interfaces/IWatchListType");
const React = require("react");
const useContext = require("react").useContext;
import { DataContext, DataContextType } from "../data-context";

const Settings = () => {
     const {
          activeRoute,
          archivedVisible,
          autoAdd,
          buildDate,
          isLoggedIn,
          LogOutIconComponent,
          searchCount,
          searchTerm,
          setArchivedVisible,
          setAutoAdd,
          setSearchCount,
          setSearchTerm,
          setSettingsVisible,
          setShowMissingArtwork,
          setSourceFilter,
          setStillWatching,
          setTypeFilter,
          setWatchListSortColumn,
          setWatchListSortDirection,
          showMissingArtwork,
          signOut,
          sourceFilter,
          stillWatching,
          typeFilter,
          watchListItemsSortColumns,
          watchListSortColumn,
          watchListSortColumns,
          watchListSortDirection,
          watchListSources,
          watchListTypes
     } = useContext(DataContext) as DataContextType

     const searchCountOptions: any = {
          "10 results": 10,
          "20 results": 20,
          "30 results": 30,
          "40 results": 40,
          "50 results": 50
     };

     const closeDetail = async () => {
          setSettingsVisible(false);
     };

     return (
          <div className="modal">
               <div className="modal-content textLabel">
                    Settings
                    <span className="clickable closeButton" onClick={closeDetail}>
                         X
                    </span>

                    <ul className="menuContent">
                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li>
                                   <span className="firstItem">
                                        <span>Search</span>
                                   </span>

                                   <span>
                                        <input type="text" className="inputStyle smallInputField" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}></input>
                                   </span>
                              </li>
                         )}

                         {activeRoute === "WatchList" && archivedVisible === false && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span className="wordWrapLabel">Still Watching</span>
                                   </span>

                                   <span title="Stuff you are still watching">
                                        <label className="switch">
                                             <input type="checkbox" checked={stillWatching} onChange={(event) => setStillWatching(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Archived</span>
                                   </span>

                                   <span title="Archived Items">
                                        <label className="switch">
                                             <input type="checkbox" checked={archivedVisible} onChange={(event) => {
                                                  setArchivedVisible(event.target.checked);

                                                  if (event.target.checked === true) setStillWatching(false);
                                             }} />

                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {(activeRoute === "WatchListItems" || activeRoute === "SearchIMDB") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Auto Add</span>
                                   </span>

                                   <span title="Automatically add WatchList after adding new item">
                                        <label className="switch">
                                             <input type="checkbox" checked={autoAdd} onChange={(event) => setAutoAdd(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {activeRoute === "SearchIMDB" && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>IMDB results</span>
                                   </span>

                                   <span>
                                        <select className="leftMargin selectStyle selectWidth" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value, 10))}>
                                             {Object.keys(searchCountOptions)?.map(key => {
                                                  return (
                                                       <option key={key} value={searchCountOptions[key]}>
                                                            {key}
                                                       </option>
                                                  );
                                             })}
                                        </select>
                                   </span>
                              </li>
                         )}

                         {(activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span title="Show WatchListItems with missing images">
                                        <span className="wordWrapLabel">Missing images</span>
                                   </span>

                                   <span>
                                        <label className="switch">
                                             <input type="checkbox" checked={showMissingArtwork} onChange={(event) => setShowMissingArtwork(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {activeRoute === "WatchList" && (
                              <li className="topMargin">
                                   <span className="firstItem">
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
                              </li>
                         )}

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span className="firstItem">
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
                              </li>
                         )}

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span className="firstItem">
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
                              </li>
                         )}

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Sort Order</span>
                                   </span>

                                   <span title="Sort direction">
                                        <select className="selectStyle" value={watchListSortDirection} onChange={(event) => setWatchListSortDirection(event.target.value)}>
                                             <option value="ASC">Ascending</option>
                                             <option value="DESC">Descending</option>
                                        </select>
                                   </span>
                              </li>
                         )}

                         {isLoggedIn && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Sign Out</span>
                                   </span>

                                   <span>
                                        <span className="clickable customLeftMargin" onClick={signOut}>
                                             {LogOutIconComponent}
                                        </span>
                                   </span>
                              </li>
                         )}
                    </ul>

                    <span>
                         <span className="rightAligned small-text">Build Date: {buildDate}</span>
                    </span>
               </div>
          </div>
     );
};

export default Settings;
