const axios = require("axios");
const AccordionControl = require("./AccordionControl").default;
const exact = require("prop-types-exact");
const IWatchListMovieStat = require("./interfaces/IWatchListMovieStat");
const IWatchListSourceDetailSortOption = require("./interfaces/IWatchListSourceDetailSortOption");
const IWatchListSourceStat = require("./interfaces/IWatchListSourceStat");
const IWatchListSourceDtlStat = require("./interfaces/IWatchListSourceDtlStat");
const IWatchListTopRatedStat = require("./interfaces/IWatchListTopRatedStat");
const IWatchListTVStat = require("./interfaces/IWatchListTVStat");

const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;
const useState = require("react").useState;
const TreeView = require("@mui/lab/TreeView").default;
const ExpandMoreIcon = require("@mui/icons-material/ExpandMore").default;
const ChevronRightIcon = require("@mui/icons-material/ChevronRight").default;
const TreeItem = require("@mui/lab/TreeItem").default;

const WatchListStats = ({ demoMode, isLoggedIn, isLoggedInCheckComplete, ratingMax }
     :
     {
          demoMode: boolean,
          isLoggedIn: boolean,
          isLoggedInCheckComplete: boolean,
          ratingMax: number
     }) => {
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

     const sourceStats = (
          <>
               {watchListSourceStats.map((currentWatchListSourceStat: typeof IWatchListSourceStat, index: number) => {
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
               {watchListTopRatedStats.map((currentWatchListTopRatedStat: typeof IWatchListTopRatedStat, index: number) => {
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

     const movieStats = (
          <>
               {watchListMovieStats.map((currentWatchListMovieStat: typeof IWatchListMovieStat, index: number) => {
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

     const tvStats = (
          <>
               {watchListTVStats.map((currentWatchListTVStat: typeof IWatchListTVStat, index: number) => {
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

     const accordionData = {
          "Most Frequently Watched Sources": sourceStats,
          "Top Rated": topRated,
          "Top 10 Movies": movieStats,
          "Top 10 Shows": tvStats,
     };

     // Get WatchListMovieStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieStatsPayload = require("./demo/index").watchListMovieStats;
               setWatchListMovieStats(demoWatchListMovieStatsPayload);
               setWatchListMovieStatsLoadingStarted(true);
               setWatchListMovieStatsLoadingComplete(true);
               return;
          }

          if (!watchListMovieStatsLoadingStarted && !watchListMovieStatsLoadingComplete) {
               setWatchListMovieStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListMovieStats`, { withCredentials: true })
                    .then((res: typeof IWatchListMovieStat) => {
                         setWatchListMovieStats(res.data);
                         setWatchListMovieStatsLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         alert("Failed to get WatchList Movie Stats with the error " + err.message);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListMovieStatsLoadingStarted, watchListMovieStatsLoadingComplete]);

     // Get WatchListSourceStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceStatsPayload = require("./demo/index").WatchListSourceStats;
               setWatchListSourceStats(demoWatchListSourceStatsPayload);
               setWatchListSourceStatsLoadingStarted(true);
               setWatchListSourceStatsLoadingComplete(true);
               return;
          }

          if (watchListMovieStatsLoadingComplete && !watchListSourceStatsLoadingStarted && !watchListSourceStatsLoadingComplete) {
               setWatchListSourceStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListSourceStats`, { withCredentials: true })
                    .then((res: typeof IWatchListSourceStat) => {
                         setWatchListSourceStats(res.data);
                         setWatchListSourceStatsLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         alert("Failed to get WatchList Source Stats with the error " + err.message);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListMovieStatsLoadingComplete, watchListSourceStatsLoadingStarted, watchListSourceStatsLoadingComplete]);

     // Get WatchListTopRatedStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTopRatedStatsPayload = require("./demo/index").WatchListTopRatedStats;
               setWatchListTopRatedStats(demoWatchListTopRatedStatsPayload);
               setWatchListTopRatedStatsLoadingStarted(true);
               setWatchListTopRatedStatsLoadingComplete(true);
               return;
          }

          if (watchListSourceStatsLoadingComplete && !watchListTopRatedStatsLoadingStarted && !watchListTopRatedStatsLoadingComplete) {
               setWatchListTopRatedStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListTopRatedStats`, { withCredentials: true })
                    .then((res: typeof IWatchListTopRatedStat) => {
                         setWatchListTopRatedStats(res.data);
                         setWatchListTopRatedStatsLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         alert("Failed to get WatchList Top Rated Stats with the error " + err.message);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListSourceStatsLoadingComplete, watchListTopRatedStatsLoadingStarted, watchListTopRatedStatsLoadingComplete]);

     // Get WatchListTVStats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVStatsPayload = require("./demo/index").WatchListTVStats;
               setWatchListTVStats(demoWatchListTVStatsPayload);
               setWatchListTVStatsLoadingStarted(true);
               setWatchListTVStatsLoadingComplete(true);
               return;
          }

          if (watchListTopRatedStatsLoadingComplete && !watchListTVStatsLoadingStarted && !watchListTVStatsLoadingComplete) {
               setWatchListTVStatsLoadingStarted(true);

               axios.get(`/api/GetWatchListTVStats`, { withCredentials: true })
                    .then((res: typeof IWatchListTVStat) => {
                         setWatchListTVStats(res.data);
                         setWatchListTVStatsLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         alert("Failed to get WatchList TV Stats with the error " + err.message);
                    });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, watchListTopRatedStatsLoadingComplete, watchListTVStatsLoadingStarted, watchListTVStatsLoadingComplete]);

     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceDtlStatsPayload = require("./demo/index").WatchListSourceDtlStats;
               setWatchListSourceDtlStats(demoWatchListSourceDtlStatsPayload);
               setWatchListSourceDtlLoadingStarted(true);
               setWatchListSourceDtlLoadingComplete(true);
               return;
          }

          if (!watchListSourceDtlLoadingStarted && !watchListSourceDtlLoadingComplete) {
               setWatchListSourceDtlLoadingStarted(true);

               axios.get(`/api/GetWatchListSourceStats?GetDetail=true`)
                    .then((res: typeof IWatchListSourceDtlStat) => {
                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while  getting the detail`);
                         } else {
                              setWatchListSourceDtlStats(res.data);
                              setWatchListSourceDtlLoadingComplete(true);
                         }
                    })
                    .catch((err: Error) => {
                         alert(`The fatal error ${err.message} occurred while  getting the detail`);
                    });
          }
     }, [watchListSourceDtlLoadingStarted, watchListSourceDtlLoadingComplete]);

     return (
          <AccordionControl accordionData={accordionData} />
     );
};

WatchListStats.propTypes = exact({
     demoMode: PropTypes.bool.isRequired,
     isLoggedIn: PropTypes.bool.isRequired,
     isLoggedInCheckComplete: PropTypes.bool.isRequired,
     ratingMax: PropTypes.number.isRequired,
});

export default WatchListStats;