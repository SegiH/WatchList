"use client"

const axios = require("axios");
const ChevronRightIcon = require("@mui/icons-material/ChevronRight").default;
const ExpandMoreIcon = require("@mui/icons-material/ExpandMore").default;
const IWatchListMovieStat = require("../interfaces/IWatchListMovieStat");
const IWatchListSourceDetailSortOption = require("../interfaces/IWatchListSourceDetailSortOption");
const IWatchListSourceStat = require("../interfaces/IWatchListSourceStat");
const IWatchListSourceDtlStat = require("../interfaces/IWatchListSourceDtlStat");
const IWatchListTopRatedStat = require("../interfaces/IWatchListTopRatedStat");
const IWatchListTVStat = require("../interfaces/IWatchListTVStat");
const React = require("react");
const TreeItem = require("@mui/lab/TreeItem").default;
const TreeView = require("@mui/lab/TreeView").default;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

import "./watchliststats.css";

export default function WatchListStats() {
     const {
          demoMode,
          isLoggedIn,
          isLoggedInCheckComplete,
          ratingMax,
          setIsError,
          setIsErrorMessage
     } = useContext(DataContext) as DataContextType

     const [watchListMovieStats, setWatchListMovieStats] = useState([]);
     const [watchListMovieStatsLoadingStarted, setWatchListMovieStatsLoadingStarted] = useState(false);
     const [watchListMovieStatsLoadingComplete, setWatchListMovieStatsLoadingComplete] = useState(false);

     const [watchListSourceStats, setWatchListSourceStats] = useState([]);
     const [watchListSourceStatsLoadingStarted, setWatchListSourceStatsLoadingStarted] = useState(false);
     const [watchListSourceStatsLoadingComplete, setWatchListSourceStatsLoadingComplete] = useState(false);

     const [watchListTopRatedStats, setWatchListTopRatedStats] = useState([]);
     const [watchListTopRatedStatsLoadingStarted, setWatchListTopRatedStatsLoadingStarted] = useState(false);
     const [watchListTopRatedStatsLoadingComplete, setWatchListTopRatedStatsLoadingComplete] = useState(false);

     const [watchListTVStats, setWatchListTVStats] = useState([]);
     const [watchListTVStatsLoadingStarted, setWatchListTVStatsLoadingStarted] = useState(false);
     const [watchListTVStatsLoadingComplete, setWatchListTVStatsLoadingComplete] = useState(false);

     const [watchListSourceDtlStats, setWatchListSourceDtlStats] = useState([]);
     const [watchListSourceDtlLoadingStarted, setWatchListSourceDtlLoadingStarted] = useState(false);
     const [watchListSourceDtlLoadingComplete, setWatchListSourceDtlLoadingComplete] = useState(false);

     const [watchListSourceStatsFilter, setWatchListSourceStatsFilter] = useState("StartDate");

     const watchListSourceDetailSortOptions: typeof IWatchListSourceDetailSortOption = {
          WatchListID: "ID",
          Name: "Name",
          StartDate: "Start Date",
          EndDate: "End Date",
     };

     const movieStats = (
          <>
               {watchListMovieStats && watchListMovieStats?.map((currentWatchListMovieStat: typeof IWatchListMovieStat, index: number) => {
                    return (
                         <table key={index} className="datagrid">
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             {currentWatchListMovieStat.IMDB_URL === null && (
                                                  <div className="textLabel">
                                                       {currentWatchListMovieStat.WatchListItemName} watched {currentWatchListMovieStat.ItemCount} time(s)
                                                  </div>
                                             )}

                                             {currentWatchListMovieStat.IMDB_URL !== null && (
                                                  <>
                                                       <a href={currentWatchListMovieStat.IMDB_URL} target="_blank">
                                                            {currentWatchListMovieStat.WatchListItemName}
                                                       </a>

                                                       {" "}
                                                       watched {currentWatchListMovieStat.ItemCount} time(s)
                                                  </>
                                             )}
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    );
               })}
          </>
     );

     const sourceStats = (
          <>
               {watchListSourceStats && watchListSourceStats?.map((currentWatchListSourceStat: typeof IWatchListSourceStat, index: number) => {
                    return (
                         <table key={index} className="datagrid">
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             <div className="testLabel">
                                                  {/* This monstrosity watchListSourceDtlStats.filter accounts for items where StartDate is null which should never be and factors that into the total count */}
                                                  {currentWatchListSourceStat.WatchListSourceName} watched {
                                                       currentWatchListSourceStat.SourceCount
                                                       -
                                                       parseInt(watchListSourceDtlStats.filter((currentWatchListSourceDtlStat: typeof IWatchListSourceDtlStat, index: number) => { return String(currentWatchListSourceDtlStat.WatchListSourceID) === String(currentWatchListSourceStat.WatchListSourceID) && (currentWatchListSourceDtlStat.StartDate === null) }).length)
                                                  } time(s)

                                                  <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />} sx={{ flexGrow: 1, overflowY: "auto" }}>
                                                       <TreeItem nodeId="1" label="Details">
                                                            <span>
                                                                 <span className="sortBy">Sort By</span>
                                                                 <select className="selectStyle" value={watchListSourceStatsFilter} onChange={(event) => setWatchListSourceStatsFilter(event.target.value)}>
                                                                      {Object.keys(watchListSourceDetailSortOptions)?.map((watchListSourceDetailSortOption, index) => {
                                                                           return (
                                                                                <option key={index} value={watchListSourceDetailSortOption}>
                                                                                     {watchListSourceDetailSortOptions[watchListSourceDetailSortOption]}
                                                                                </option>
                                                                           );
                                                                      })}
                                                                 </select>
                                                            </span>

                                                            <ul className="noBulletPoints">
                                                                 {watchListSourceDtlStats?.filter((currentWatchListSourceDtlStat: typeof IWatchListSourceDtlStat, index: number) => {
                                                                      return (
                                                                           String(currentWatchListSourceDtlStat.WatchListSourceID) === String(currentWatchListSourceStat.WatchListSourceID) && currentWatchListSourceDtlStat.StartDate !== null
                                                                      )
                                                                 })
                                                                      .sort((a: typeof IWatchListSourceStat, b: typeof IWatchListSourceStat) => {
                                                                           switch (watchListSourceStatsFilter) {
                                                                                case "WatchListID":
                                                                                     return parseInt(a.WatchListID) > parseInt(b.WatchListID) ? 1 : -1;
                                                                                case "Name":
                                                                                     const aName = a.WatchListItemName;
                                                                                     const bName = b.WatchListItemName;

                                                                                     return String(aName) > String(bName) ? 1 : -1;
                                                                                case "StartDate":
                                                                                     return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? 1 : -1;
                                                                                case "EndDate":
                                                                                     return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? 1 : -1;
                                                                           }
                                                                      })
                                                                      .map((currentWatchListSourceDtlStat: typeof IWatchListSourceDtlStat, index: number) => {
                                                                           return (
                                                                                <li key={index}>
                                                                                     {currentWatchListSourceDtlStat.WatchListItemName} {currentWatchListSourceDtlStat.Season !== null ? ` (Season ${currentWatchListSourceDtlStat.Season})` : ``} {currentWatchListSourceDtlStat.StartDate !== null ? `watched` : ``}{" "}
                                                                                     {currentWatchListSourceDtlStat.EndDate !== null && currentWatchListSourceDtlStat.EndDate !== currentWatchListSourceDtlStat.StartDate ? ` from ${currentWatchListSourceDtlStat.StartDate} to ${currentWatchListSourceDtlStat.EndDate}` : currentWatchListSourceDtlStat.StartDate !== null ? `on ${currentWatchListSourceDtlStat.StartDate}` : ``}
                                                                                </li>
                                                                           );
                                                                      })}
                                                            </ul>
                                                       </TreeItem>
                                                  </TreeView>
                                             </div>
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    );
               })}
          </>
     );

     const topRated = (
          <>
               {watchListTopRatedStats && watchListTopRatedStats?.map((currentWatchListTopRatedStat: typeof IWatchListTopRatedStat, index: number) => {
                    return (
                         <table key={index} className="datagrid">
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             <div className="textLabel">
                                                  {currentWatchListTopRatedStat.IMDB_URL !== null && (
                                                       <a href={currentWatchListTopRatedStat.IMDB_URL} target="_blank">
                                                            {currentWatchListTopRatedStat.WatchListItemName}
                                                       </a>
                                                  )}

                                                  {currentWatchListTopRatedStat.IMDB_URL === null && <span>{currentWatchListTopRatedStat.WatchListItemName} </span>}
                                                  {currentWatchListTopRatedStat.Season !== null && currentWatchListTopRatedStat.Season !== 0 ? ": Season " + currentWatchListTopRatedStat.Season : ""} rated {currentWatchListTopRatedStat.Rating}/{ratingMax}
                                             </div>
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    );
               })}
          </>
     );

     const tvStats = (
          <>
               {watchListTVStats && watchListTVStats?.map((currentWatchListTVStat: typeof IWatchListTVStat, index: number) => {
                    return (
                         <table key={index} className="datagrid">
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             {currentWatchListTVStat.IMDB_URL === null && (
                                                  <div className="textLabel">
                                                       {currentWatchListTVStat.WatchListItemName} watched {currentWatchListTVStat.ItemCount} time(s)
                                                  </div>
                                             )}

                                             {currentWatchListTVStat.IMDB_URL !== null && (
                                                  <>
                                                       <a href={currentWatchListTVStat.IMDB_URL} target="_blank">
                                                            {currentWatchListTVStat.WatchListItemName}
                                                       </a>{" "}
                                                       watched {currentWatchListTVStat.ItemCount} time(s)
                                                  </>
                                             )}
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    );
               })}
          </>
     );

     // Get WatchListMovieStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieStatsPayload = require("../demo/index").watchListMovieStats;
               setWatchListMovieStats(demoWatchListMovieStatsPayload);
               setWatchListMovieStatsLoadingStarted(true);
               setWatchListMovieStatsLoadingComplete(true);
               return;
          }

          if (!watchListMovieStatsLoadingStarted && !watchListMovieStatsLoadingComplete) {
               setWatchListMovieStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListMovieStats`, { withCredentials: true })
                    .then((res: typeof IWatchListMovieStat) => {
                         if (res.data[0] === "OK") {
                              setWatchListMovieStats(res.data[1]);
                              setWatchListMovieStatsLoadingComplete(true);
                         } else {
                              setIsErrorMessage(`The following error occurred getting the WatchList Movie Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage("Failed to get WatchList Movie Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListMovieStatsLoadingStarted, watchListMovieStatsLoadingComplete]);

     // Get WatchListSourceStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceStatsPayload = require("../demo/index").WatchListSourceStats;
               setWatchListSourceStats(demoWatchListSourceStatsPayload);
               setWatchListSourceStatsLoadingStarted(true);
               setWatchListSourceStatsLoadingComplete(true);
               return;
          }

          if (watchListMovieStatsLoadingComplete && !watchListSourceStatsLoadingStarted && !watchListSourceStatsLoadingComplete) {
               setWatchListSourceStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListSourceStats`, { withCredentials: true })
                    .then((res: typeof IWatchListSourceStat) => {
                         if (res.data[0] === "OK") {
                              setWatchListSourceStats(res.data[1]);
                              setWatchListSourceStatsLoadingComplete(true);
                         } else {
                              setIsErrorMessage(`The following error occurred getting the WatchList Source Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage("Failed to get WatchList Source Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListMovieStatsLoadingComplete, watchListSourceStatsLoadingStarted, watchListSourceStatsLoadingComplete]);

     // Get WatchListTopRatedStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTopRatedStatsPayload = require("../demo/index").WatchListTopRatedStats;
               setWatchListTopRatedStats(demoWatchListTopRatedStatsPayload);
               setWatchListTopRatedStatsLoadingStarted(true);
               setWatchListTopRatedStatsLoadingComplete(true);
               return;
          }

          if (watchListSourceStatsLoadingComplete && !watchListTopRatedStatsLoadingStarted && !watchListTopRatedStatsLoadingComplete) {
               setWatchListTopRatedStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListTopRatedStats`, { withCredentials: true })
                    .then((res: typeof IWatchListTopRatedStat) => {
                         if (res.data[0] === "OK") {
                              setWatchListTopRatedStats(res.data[1]);
                              setWatchListTopRatedStatsLoadingComplete(true);
                         } else {
                              setIsErrorMessage(`The following error occurred getting the WatchList Top Rated Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage("Failed to get WatchList Top Rated Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListSourceStatsLoadingComplete, watchListTopRatedStatsLoadingStarted, watchListTopRatedStatsLoadingComplete]);

     // Get WatchListTVStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVStatsPayload = require("../demo/index").WatchListTVStats;
               setWatchListTVStats(demoWatchListTVStatsPayload);
               setWatchListTVStatsLoadingStarted(true);
               setWatchListTVStatsLoadingComplete(true);
               return;
          }

          if (watchListTopRatedStatsLoadingComplete && !watchListTVStatsLoadingStarted && !watchListTVStatsLoadingComplete) {
               setWatchListTVStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListTVStats`, { withCredentials: true })
                    .then((res: typeof IWatchListTVStat) => {
                         if (res.data[0] === "OK") {
                              setWatchListTVStats(res.data[1]);
                              setWatchListTVStatsLoadingComplete(true);
                         } else {
                              setIsErrorMessage(`The following error occurred getting the WatchList TV Rated Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage("Failed to get WatchList TV Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListTopRatedStatsLoadingComplete, watchListTVStatsLoadingStarted, watchListTVStatsLoadingComplete]);

     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceDtlStatsPayload = require("../demo/index").WatchListSourceDtlStats;
               setWatchListSourceDtlStats(demoWatchListSourceDtlStatsPayload);
               setWatchListSourceDtlLoadingStarted(true);
               setWatchListSourceDtlLoadingComplete(true);
               return;
          }

          if (!watchListSourceDtlLoadingStarted && !watchListSourceDtlLoadingComplete) {
               setWatchListSourceDtlLoadingStarted(true);

               axios.get(`/api/GetWatchListSourceStats?GetDetail=true`)
                    .then((res: typeof IWatchListSourceDtlStat) => {
                         if (res.data[0] === "OK") {
                              setWatchListSourceDtlStats(res.data[1]);
                              setWatchListSourceDtlLoadingComplete(true);
                         } else {
                              setIsErrorMessage(`The following error occurred getting the WatchList Source Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage(`The fatal error ${err.message} occurred while getting the detail`);
                         setIsError(true);
                    });
          }
     }, [watchListSourceDtlLoadingStarted, watchListSourceDtlLoadingComplete]);

     return (
          <>
               {watchListSourceStats?.length === 0 && watchListTopRatedStats?.length === 0 && watchListMovieStats?.length === 0 && watchListTVStats?.length === 0 &&
                    <div className="flex-container foregroundColor">
                         No stats are available
                    </div>
               }

               <div className="flex-container foregroundColor">
                    {sourceStats !== null && watchListSourceStats?.length > 0 &&
                         <div className="col-1">
                              <h1>Most Watched Sources</h1>
                              <div>{sourceStats}</div>
                         </div>
                    }

                    {topRated !== null && watchListTopRatedStats?.length > 0 &&
                         <div className="col-2">
                              <h1>Top Rated</h1>
                              <div>{topRated}</div>
                         </div>
                    }

                    {movieStats !== null && watchListMovieStats?.length > 0 &&
                         <div className="col-3">
                              <h1>Top 10 Movies</h1>
                              <div>{movieStats}</div>
                         </div>
                    }

                    {tvStats !== null && watchListTVStats?.length > 0 &&
                         <div className="col-4">
                              <h1>Top 10 TV Shows</h1>
                              <div>{tvStats}</div>
                         </div>
                    }
               </div>
          </>
     );
}