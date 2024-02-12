const exact = require("prop-types-exact");
const MuiIcon = require("@mui/icons-material").MuiIcon;

const IWatchListSortColumn = require("./interfaces/IWatchListSortColumn");
const IWatchListItemsSortColumn = require("./interfaces/IWatchListItemsSortColumn");
const IWatchListSource = require("./interfaces/IWatchListSource");
const IWatchListType = require("./interfaces/IWatchListType");
const PropTypes = require("prop-types");
const React = require("react");

const Settings = ({ activeRoute, archivedVisible, autoAdd, isLoggedIn, LogOutIconComponent, searchCount, searchTerm, setSearchCount, setSearchTerm, setArchivedVisible, setAutoAdd, setSettingsVisible, setShowMissingArtwork, setSourceFilter, setStillWatching, setTypeFilter, setWatchListSortColumn, setWatchListSortDirection, showMissingArtwork, signOut, stillWatching, sourceFilter, typeFilter, watchListItemsSortColumns, watchListSortColumn, watchListSortColumns, watchListSortDirection, watchListSources, watchListTypes }
     :
     {
          activeRoute: string,
          archivedVisible: boolean,
          autoAdd: boolean,
          isLoggedIn: boolean,
          LogOutIconComponent: typeof MuiIcon,
          searchCount: number,
          searchTerm: string,
          setSearchCount: (arg0: number) => void,
          setSearchTerm: (arg0: string) => void,
          setArchivedVisible: (arg0: boolean) => void,
          setAutoAdd: (arg0: boolean) => void,
          setSettingsVisible: (arg0: boolean) => void,
          setShowMissingArtwork: (arg0: boolean) => void,
          setSourceFilter: (arg0: string) => void,
          setStillWatching: (arg0: boolean) => void,
          setTypeFilter: (arg0: string) => void,
          setWatchListSortColumn: (arg0: string) => void,
          setWatchListSortDirection: (arg0: string) => void,
          showMissingArtwork: boolean,
          signOut: typeof MuiIcon,
          stillWatching: boolean,
          sourceFilter: string,
          typeFilter: string,
          watchListItemsSortColumns: typeof IWatchListItemsSortColumn,
          watchListSortColumn: string,
          watchListSortColumns: typeof IWatchListSortColumn,
          watchListSortDirection: string,
          watchListSources: typeof IWatchListSource,
          watchListTypes: typeof IWatchListType
     }) => {
     const buildDate = "02-11-24";

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
               <div className={`modal-content`}>
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
                                        <select className="leftMargin selectStyle selectWidth" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value,10))}>
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
                                        <select className="selectStyle" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
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
                                        <select className="selectStyle" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
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

Settings.propTypes = exact({
     activeRoute: PropTypes.string.isRequired,
     archivedVisible: PropTypes.bool.isRequired,
     autoAdd: PropTypes.bool.isRequired,
     isLoggedIn: PropTypes.bool.isRequired,
     LogOutIconComponent: PropTypes.object.isRequired,
     searchCount: PropTypes.number.isRequired,
     searchTerm: PropTypes.string.isRequired,
     setSearchCount: PropTypes.func.isRequired,
     setSearchTerm: PropTypes.func.isRequired,
     setArchivedVisible: PropTypes.func.isRequired,
     setAutoAdd: PropTypes.func.isRequired,
     setSettingsVisible: PropTypes.func.isRequired,
     setShowMissingArtwork: PropTypes.func.isRequired,
     setSourceFilter: PropTypes.func.isRequired,
     setStillWatching: PropTypes.func.isRequired,
     setTypeFilter: PropTypes.func.isRequired,
     setWatchListSortColumn: PropTypes.func.isRequired,
     setWatchListSortDirection: PropTypes.func.isRequired,
     showMissingArtwork: PropTypes.bool.isRequired,
     signOut: PropTypes.func.isRequired,
     stillWatching: PropTypes.bool.isRequired,
     sourceFilter: PropTypes.string.isRequired,
     typeFilter: PropTypes.string.isRequired,
     watchListItemsSortColumns: PropTypes.object.isRequired,
     watchListSortColumn: PropTypes.string.isRequired,
     watchListSortColumns: PropTypes.object.isRequired,
     watchListSortDirection: PropTypes.string.isRequired,
     watchListSources: PropTypes.array.isRequired,
     watchListTypes: PropTypes.array.isRequired,
});

export default Settings;
