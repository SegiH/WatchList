"use client"

import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';


import IWatchListMovieTop10Stat from "../interfaces/IWatchListMovieTop10Stat";
import IWatchListSourceDtlStat from "../interfaces/IWatchListSourceDtlStat";
import IWatchListSourceStat from "../interfaces/IWatchListSourceStat";
import IWatchListTopRatedStat from "../interfaces/IWatchListTopRatedStat";
import IWatchListTVTop10Stat from "../interfaces/IWatchListTVTop10Stat";
import IWatchListWeeklyMovieStat from "../interfaces/IWatchListWeeklyMovieStat";
import IWatchListWeeklyTVStat from "../interfaces/IWatchListWeeklyTVStat";

import { APIStatus, WatchListStatsContext } from "../data-context";

import "../css/tablestyle.css";
import "./watchliststats.css";
import { WatchListStatsContextType } from "../interfaces/contexts/WatchListStatsContextType";
import Loader from "../components/Loader";

export default function WatchListStats() {
     const {
          darkMode, demoMode, errorMessage, ratingMax, setIsError, setErrorMessage
     } = useContext(WatchListStatsContext) as WatchListStatsContextType

     const [hasStats, setHasStats] = useState(false);
     const [statsLoadingCheck, setStatsLoadingCheck] = useState(APIStatus.Idle);

     /* States for Movie Stats */
     const [watchListMovieTop10Stats, setWatchListMovieTop10Stats] = useState<IWatchListMovieTop10Stat[]>([]);
     const [watchListMovieCountStats, setWatchListMovieCountStats] = useState<number>();
     const [watchListWeeklyCurrentMovieYearStat, setWatchListWeeklyCurrentMovieYearStat] = useState(-1);
     const [watchListWeeklyCurrentMovieWeekGroupingStat, setWatchListWeeklyCurrentMovieWeekGroupingStat] = useState<number[]>([]);
     const [watchListWeeklyMovieMaxWeek, setWatchListWeeklyMovieMaxWeek] = useState(-1);
     const [watchListWeeklyMovieStats, setWatchListWeeklyMovieStats] = useState<IWatchListWeeklyMovieStat[]>([]);
     const [watchListWeeklyMovieYearsStats, setWatchListWeeklyMovieYearsStats] = useState<[]>([]);

     /* States for Source Stats */
     const [watchListSourceDtlStats, setWatchListSourceDtlStats] = useState<IWatchListSourceDtlStat[]>([]);
     const [watchListSourceStats, setWatchListSourceStats] = useState<IWatchListSourceStat[]>([]);

     /* States for Television Stats */
     const [watchListTVSeasonsCountStats, setWatchListTVSeasonsCountStats] = useState();
     const [watchListTVTop10Stats, setWatchListTVTop10Stats] = useState<IWatchListTVTop10Stat[]>([]);
     const [watchListTVTotalCountStats, setWatchListTVTotalCountStats] = useState();
     const [watchListWeeklyCurrentTVSeasonsWeekGroupingStat, setWatchListWeeklyCurrentTVSeasonsWeekGroupingStat] = useState<number[]>([]);
     const [watchListWeeklyCurrentTVSeasonsYearStat, setWatchListWeeklyCurrentTVSeasonsYearStat] = useState(-1);
     const [watchListWeeklyCurrentTVTotalWeekGroupingStat, setWatchListWeeklyCurrentTVTotalWeekGroupingStat] = useState<number[]>([]);
     const [watchListWeeklyCurrentTVTotalYearStat, setWatchListWeeklyCurrentTVTotalYearStat] = useState(-1);
     const [watchListWeeklyTVSeasonsMaxWeek, setWatchListWeeklyTVSeasonsMaxWeek] = useState(-1);
     const [watchListWeeklyTVSeasonStats, setWatchListWeeklyTVSeasonStats] = useState<IWatchListWeeklyTVStat[]>([]);
     const [watchListWeeklyTVSeasonsYearsStats, setWatchListWeeklyTVSeasonsYearsStats] = useState<[]>([]);
     const [watchListWeeklyTVTotalMaxWeek, setWatchListWeeklyTVTotalMaxWeek] = useState(-1);
     const [watchListWeeklyTVTotalStats, setWatchListWeeklyTVTotalStats] = useState<IWatchListWeeklyTVStat[]>([]);
     const [watchListWeeklyTVTotalYearsStats, setWatchListWeeklyTVTotalYearsStats] = useState<[]>([]);

     /* States for Top Rated Stats */
     const [watchListTopRatedStats, setWatchListTopRatedStats] = useState<IWatchListTopRatedStat[]>([]);

     const getWeek = () => {
          var date = new Date();
          date.setHours(0, 0, 0, 0);
          // Thursday in current week decides the year.
          date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
          // January 4 is always in week 1.
          var week1 = new Date(date.getFullYear(), 0, 4);
          // Adjust to Thursday in week 1 and count number of weeks from date to week1.
          return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
               - 3 + (week1.getDay() + 6) % 7) / 7);
     }

     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieTop10StatsPayload = require("../demo/index").demoWatchListMovieTop10Stats;
               setWatchListMovieTop10Stats(demoWatchListMovieTop10StatsPayload);

               const demoWatchListMovieCountStatsPayload = require("../demo/index").demoWatchListMovieCountStats;
               setWatchListMovieCountStats(demoWatchListMovieCountStatsPayload);

               const demoWatchListSourceStatsPayload = require("../demo/index").demoWatchListSourceStats;
               setWatchListSourceStats(demoWatchListSourceStatsPayload);

               const demoWatchListSourceDtlStatsPayload = require("../demo/index").demoWatchListSourceDtlStats;
               setWatchListSourceDtlStats(demoWatchListSourceDtlStatsPayload);

               const demoWatchListTopRatedStatsPayload = require("../demo/index").demoWatchListTopRatedStats;
               setWatchListTopRatedStats(demoWatchListTopRatedStatsPayload);

               const demoWatchListTVTop10StatsPayload = require("../demo/index").demoWatchListTVTop10Stats;
               setWatchListTVTop10Stats(demoWatchListTVTop10StatsPayload);

               const demoWatchListTVSeasonsCountStatsPayload = require("../demo/index").demoWatchListTVSeasonsCountStats;
               setWatchListTVSeasonsCountStats(demoWatchListTVSeasonsCountStatsPayload);

               const demoWatchListTVTotalCountStatsPayload = require("../demo/index").demoTVTotalStats;
               setWatchListTVTotalCountStats(demoWatchListTVTotalCountStatsPayload);

               const demoWatchListWeeklyBreakDown = require("../demo/index").demoWatchListWeeklyBreakDown;

               const uniqueTVSeasonsYears = demoWatchListWeeklyBreakDown[1].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyTVSeasonsYearsStats(uniqueTVSeasonsYears);
               setWatchListWeeklyTVSeasonStats(demoWatchListWeeklyBreakDown[1]);

               const uniqueTVTotalYears = demoWatchListWeeklyBreakDown[3].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyTVTotalYearsStats(uniqueTVTotalYears);
               setWatchListWeeklyTVTotalStats(demoWatchListWeeklyBreakDown[3]);

               const uniqueMovieYears = demoWatchListWeeklyBreakDown[2].map((item: IWatchListWeeklyMovieStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyMovieYearsStats(uniqueMovieYears);
               setWatchListWeeklyMovieStats(demoWatchListWeeklyBreakDown[2]);

               setHasStats(true);
               setStatsLoadingCheck(APIStatus.Success);
               return;
          }

          setStatsLoadingCheck(APIStatus.Loading);
     }, []);

     useEffect(() => {
          if (statsLoadingCheck !== APIStatus.Loading) {
               return;
          }

          axios.get(`/api/GetWatchListStats`, { withCredentials: true })
               .then((res: AxiosResponse<any>) => {
                    if (res.data[0] === "OK") {
                         setHasStats(true);

                         const newMovieTop10Stats: any = [];

                         res.data[1]["WatchListTop10MoviesStats"].map((stat: any) => {
                              newMovieTop10Stats.push(
                                   {
                                        WatchListItemName: stat.WatchListItemName,
                                        ItemCount: stat.count
                                   }
                              )
                         });

                         setWatchListMovieTop10Stats(newMovieTop10Stats);

                         setWatchListMovieCountStats(res.data[1]["WatchListMovieCountStats"]);
                         setWatchListSourceStats(res.data[1]["WatchListSourceStats"]);
                         setWatchListSourceDtlStats(res.data[1]["WatchListSourceDetailStats"]);
                         setWatchListTopRatedStats(res.data[1]["WatchListTopRatedStats"]);
                         setWatchListTVTop10Stats(res.data[1]["WatchListTVTop10Stats"]);
                         setWatchListTVSeasonsCountStats(res.data[1]["WatchListTVSeasonsStats"]);
                         setWatchListTVTotalCountStats(res.data[1]["WatchListTVTotalCountStats"]);
                         setWatchListMovieTop10Stats(res.data[1]["WatchListTop10MoviesStats"]);

                         const uniqueTVSeasonsYears = res.data[1]["WeeklyBreakdownTVSeasonsStats"].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                         setWatchListWeeklyTVSeasonsYearsStats(uniqueTVSeasonsYears);
                         setWatchListWeeklyTVSeasonStats(res.data[1]["WeeklyBreakdownTVSeasonsStats"]);

                         const uniqueMovieYears = res.data[1]["WeeklyBreakdownMovieStats"].map((item: IWatchListWeeklyMovieStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                         setWatchListWeeklyMovieYearsStats(uniqueMovieYears);
                         setWatchListWeeklyMovieStats(res.data[1]["WeeklyBreakdownMovieStats"]);

                         const uniqueTVTotalYears = res.data[1]["WeeklyBreakdownTVTotalResultsStats"].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                         setWatchListWeeklyTVTotalYearsStats(uniqueTVTotalYears);
                         setWatchListWeeklyTVTotalStats(res.data[1]["WeeklyBreakdownTVTotalResultsStats"]);

                         setStatsLoadingCheck(APIStatus.Success);
                    } else {
                         setErrorMessage(`The following error occurred getting the WatchList Stats: ${res.data[1]}`);
                         setIsError(true);

                         setStatsLoadingCheck(APIStatus.Error);
                    }

               })
               .catch((err: Error) => {
                    setErrorMessage("Failed to get WatchList Stats with the error " + err.message);
                    setIsError(true);
                    setStatsLoadingCheck(APIStatus.Error);
               });
     }, [statsLoadingCheck]);

     // Create array for Movie weekly breakdown
     useEffect(() => {
          if (watchListWeeklyMovieStats.length == 0 || watchListWeeklyCurrentMovieYearStat === -1) {
               return;
          }

          const movieWeekGrouping: number[] = [];

          const lastIndex = watchListWeeklyCurrentMovieYearStat === new Date().getFullYear() ? getWeek() : 52;
          setWatchListWeeklyMovieMaxWeek(lastIndex);

          for (let i = 1; i <= lastIndex; i++) {
               const currentWeek: IWatchListWeeklyMovieStat[] = watchListWeeklyMovieStats.filter((currentWatchListWeeklyMovieStat: IWatchListWeeklyMovieStat) => {
                    return currentWatchListWeeklyMovieStat.Year.toString() === watchListWeeklyCurrentMovieYearStat.toString() && currentWatchListWeeklyMovieStat.WeekNum.toString() === String(i).padStart(2, "0");
               });

               if (currentWeek.length === 1) {
                    movieWeekGrouping.push(currentWeek[0].MovieCount);
               } else {
                    movieWeekGrouping.push(0);
               }
          }

          setWatchListWeeklyCurrentMovieWeekGroupingStat(movieWeekGrouping);
     }, [watchListWeeklyMovieStats, watchListWeeklyCurrentMovieYearStat]);

     // Create array for TV seasons weekly breakdown
     useEffect(() => {
          if (watchListWeeklyTVSeasonStats.length == 0 || watchListWeeklyCurrentTVSeasonsYearStat === -1) {
               return;
          }

          const tvWeekGrouping: number[] = [];

          const lastIndex = watchListWeeklyCurrentTVSeasonsYearStat === new Date().getFullYear() ? getWeek() : 52;
          setWatchListWeeklyTVSeasonsMaxWeek(lastIndex);

          for (let i = 1; i <= lastIndex; i++) {
               const currentWeek: IWatchListWeeklyTVStat[] = watchListWeeklyTVSeasonStats.filter((currentWatchListWeeklyTVStat: IWatchListWeeklyTVStat) => {
                    return currentWatchListWeeklyTVStat.Year.toString() === watchListWeeklyCurrentTVSeasonsYearStat.toString() && currentWatchListWeeklyTVStat.WeekNum.toString() === String(i).padStart(2, "0");
               });

               if (currentWeek.length === 1) {
                    tvWeekGrouping.push(currentWeek[0].TVCount);
               } else {
                    tvWeekGrouping.push(0);
               }
          }

          setWatchListWeeklyCurrentTVSeasonsWeekGroupingStat(tvWeekGrouping);
     }, [watchListWeeklyTVSeasonStats, watchListWeeklyCurrentTVSeasonsYearStat]);

     // Create array for TV total weekly breakdown
     useEffect(() => {
          if (watchListWeeklyTVTotalStats.length == 0 || watchListWeeklyCurrentTVTotalYearStat === -1) {
               return;
          }

          const tvWeekGrouping: number[] = [];

          const lastIndex = watchListWeeklyCurrentTVTotalYearStat === new Date().getFullYear() ? getWeek() : 52;
          setWatchListWeeklyTVTotalMaxWeek(lastIndex);

          for (let i = 1; i <= lastIndex; i++) {
               const currentWeek: IWatchListWeeklyTVStat[] = watchListWeeklyTVTotalStats.filter((currentWatchListWeeklyTVStat: IWatchListWeeklyTVStat) => {
                    return currentWatchListWeeklyTVStat.Year.toString() === watchListWeeklyCurrentTVTotalYearStat.toString() && currentWatchListWeeklyTVStat.WeekNum.toString() === String(i).padStart(2, "0");
               });

               if (currentWeek.length === 1) {
                    tvWeekGrouping.push(currentWeek[0].TVCount);
               } else {
                    tvWeekGrouping.push(0);
               }
          }

          setWatchListWeeklyCurrentTVTotalWeekGroupingStat(tvWeekGrouping);
     }, [watchListWeeklyTVTotalStats, watchListWeeklyCurrentTVTotalYearStat]);

     if (watchListSourceStats?.length > 0 && watchListTopRatedStats?.length === 0 && watchListMovieTop10Stats?.length === 0 && watchListTVTop10Stats?.length === 0) {
          return (
               <div className={`flex-container ${!darkMode ? " lightMode" : " darkMode"}`}>
                    No stats are available
               </div>
          )
     }

     return (
          <div className={`bottomMargin stats-dashboard topMarginContent ${!darkMode ? "lightMode" : "darkMode"}`}>
               {statsLoadingCheck === APIStatus.Loading &&
                    <Loader />
               }

               {statsLoadingCheck === APIStatus.Success && !hasStats && <h1>No Stats</h1>}

               {statsLoadingCheck === APIStatus.Success && hasStats &&
                    <>
                         {/* ===================== SUMMARY GRID ===================== */}
                         <section className={`stats-grid`}>
                              {/* ===================== MOST WATCHED SOURCES ===================== */}
                              {watchListSourceStats?.length > 0 && (
                                   <div className={`stat-card ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        <h2>Most Watched Sources</h2>

                                        <div className="source-list">
                                             {watchListSourceStats.map((source, index) => {
                                                  const watchedCount =
                                                       source.SourceCount -
                                                       watchListSourceDtlStats.filter(
                                                            d =>
                                                                 String(d.WatchListSourceID) === String(source.WatchListSourceID) &&
                                                                 d.StartDate === null
                                                       ).length;

                                                  return (
                                                       <div key={index} className="source-item">
                                                            <div className="source-header">
                                                                 <span className="source-name">{source.WatchListSourceName}</span>
                                                                 <span className="source-count">{watchedCount} watched</span>
                                                            </div>

                                                            <details className="source-details">
                                                                 <summary>View details</summary>

                                                                 <div className="source-detail-scroll">
                                                                      <ul className="source-detail-list improved">
                                                                           {watchListSourceDtlStats
                                                                                .filter(
                                                                                     d =>
                                                                                          String(d.WatchListSourceID) === String(source.WatchListSourceID) &&
                                                                                          d.StartDate !== null
                                                                                )
                                                                                .map((d, i) => (
                                                                                     <li key={i} className="source-detail-row">
                                                                                          <div className="detail-title">
                                                                                               {d.WatchListItemName}
                                                                                               {d.Season !== null && (
                                                                                                    <span className="detail-season"> • Season {d.Season}</span>
                                                                                               )}
                                                                                          </div>

                                                                                          <div className="detail-dates">
                                                                                               {d.EndDate && d.EndDate !== d.StartDate
                                                                                                    ? `${d.StartDate} → ${d.EndDate}`
                                                                                                    : d.StartDate}
                                                                                          </div>
                                                                                     </li>
                                                                                ))}
                                                                      </ul>
                                                                 </div>
                                                            </details>
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              )}

                              {/* ===================== TOP RATED ===================== */}
                              {watchListTopRatedStats?.length > 0 && (
                                   <div className={`stat-card ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        <h2>Top Rated</h2>

                                        <div className="clean-link-list">
                                             {watchListTopRatedStats.map((stat, index) => (
                                                  <div key={index} className="list-row wrap">
                                                       <div className="list-main">
                                                            {stat.IMDB_URL ? (
                                                                 <a
                                                                      href={stat.IMDB_URL}
                                                                      target="_blank"
                                                                      rel="noreferrer"
                                                                      className="clean-link"
                                                                 >
                                                                      {stat.WatchListItemName}
                                                                 </a>
                                                            ) : (
                                                                 <span>{stat.WatchListItemName}</span>
                                                            )}
                                                       </div>

                                                       <div className="list-meta muted">
                                                            {stat.Season ? `Season ${stat.Season} • ` : ""}
                                                            rated {stat.Rating}/{ratingMax}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* ===================== TOP 10 MOVIES ===================== */}
                              {watchListMovieTop10Stats?.length > 0 && (
                                   <div className={`stat-card ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        <h2>Top 10 Movies</h2>

                                        <div className="clean-link-list">
                                             {watchListMovieTop10Stats.map((movie, index) => (
                                                  <div key={index} className="list-row wrap">
                                                       <div className="list-main">
                                                            {movie.IMDB_URL ? (
                                                                 <a
                                                                      href={movie.IMDB_URL}
                                                                      target="_blank"
                                                                      rel="noreferrer"
                                                                      className="clean-link"
                                                                 >
                                                                      {movie.WatchListItemName}
                                                                 </a>
                                                            ) : (
                                                                 <span>{movie.WatchListItemName}</span>
                                                            )}
                                                       </div>

                                                       <div className="list-meta muted">
                                                            watched {movie.ItemCount} time(s)
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* ===================== TOP 10 TV ===================== */}
                              {watchListTVTop10Stats?.length > 0 && (
                                   <div className={`stat-card ${!darkMode ? "lightMode" : "darkMode"}`}>
                                        <h2>Top 10 TV Shows</h2>

                                        <div className="clean-link-list">
                                             {watchListTVTop10Stats.map((tv, index) => (
                                                  <div key={index} className="list-row wrap">
                                                       <div className="list-main">
                                                            {tv.IMDB_URL ? (
                                                                 <a
                                                                      href={tv.IMDB_URL}
                                                                      target="_blank"
                                                                      rel="noreferrer"
                                                                      className="clean-link"
                                                                 >
                                                                      {tv.WatchListItemName}
                                                                 </a>
                                                            ) : (
                                                                 <span>{tv.WatchListItemName}</span>
                                                            )}
                                                       </div>

                                                       <div className="list-meta muted">
                                                            watched {tv.ItemCount} time(s)
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </section>

                         {/* ===================== CHARTS ===================== */}
                         <section className={`stats-charts ${!darkMode ? "lightMode" : "darkMode"}`}>
                              {/* ===================== MOVIES ===================== */}
                              <div className={`chart-card stat-style ${!darkMode ? "lightMode" : "darkMode"}`}>
                                   <div className="chart-header">
                                        <h2 className="chart-title">Total Movies Watched</h2>
                                        <div className="chart-metric">{watchListMovieCountStats}</div>
                                   </div>

                                   <select
                                        className="selectStyle"
                                        value={watchListWeeklyCurrentMovieYearStat}
                                        onChange={(e) =>
                                             setWatchListWeeklyCurrentMovieYearStat(parseInt(e.target.value, 10))
                                        }
                                   >
                                        <option value="-1">Please select</option>
                                        {watchListWeeklyMovieYearsStats?.map((year: string, index: number) => (
                                             <option key={index} value={year}>
                                                  {year}
                                             </option>
                                        ))}
                                   </select>

                                   {watchListWeeklyCurrentMovieYearStat !== -1 && (
                                        <div className="chart-container">
                                             <LineChart
                                                  xAxis={[
                                                       {
                                                            scaleType: "point",
                                                            label: "Week",
                                                            data: Array.from({ length: watchListWeeklyMovieMaxWeek }, (_, i) => i + 1),
                                                       },
                                                  ]}
                                                  yAxis={[{ tickMinStep: 1 }]}
                                                  series={[
                                                       {
                                                            label: "Times Watched",
                                                            data: watchListWeeklyCurrentMovieWeekGroupingStat,
                                                       },
                                                  ]}
                                                  height={300}
                                             />
                                        </div>
                                   )}
                              </div>

                              {/* ===================== TV TOTAL ===================== */}
                              <div className={`chart-card stat-style ${!darkMode ? "lightMode" : "darkMode"}`}>
                                   <div className="chart-header">
                                        <h2 className="chart-title">Total TV Shows Watched</h2>
                                        <div className="chart-metric">{watchListTVTotalCountStats}</div>
                                   </div>

                                   <select
                                        className="selectStyle"
                                        value={watchListWeeklyCurrentTVTotalYearStat}
                                        onChange={(e) =>
                                             setWatchListWeeklyCurrentTVTotalYearStat(parseInt(e.target.value, 10))
                                        }
                                   >
                                        <option value="-1">Please select</option>
                                        {watchListWeeklyTVTotalYearsStats?.map((year: string, index: number) => (
                                             <option key={index} value={year}>
                                                  {year}
                                             </option>
                                        ))}
                                   </select>

                                   {watchListWeeklyCurrentTVTotalYearStat !== -1 && (
                                        <div className="chart-container">
                                             <LineChart
                                                  xAxis={[
                                                       {
                                                            label: "Week",
                                                            data: Array.from({ length: watchListWeeklyTVTotalMaxWeek }, (_, i) => i + 1),
                                                       },
                                                  ]}
                                                  yAxis={[{ tickMinStep: 1 }]}
                                                  series={[
                                                       {
                                                            label: "Times Watched",
                                                            data: watchListWeeklyCurrentTVTotalWeekGroupingStat,
                                                       },
                                                  ]}
                                                  height={300}
                                             />
                                        </div>
                                   )}
                              </div>

                              {/* ===================== TV SEASONS ===================== */}
                              <div className={`chart-card stat-style bottomMargin75 ${!darkMode ? "lightMode" : "darkMode"}`}>
                                   <div className="chart-header">
                                        <h2 className="chart-title">TV Seasons Watched</h2>
                                        <div className="chart-metric">{watchListTVSeasonsCountStats}</div>
                                   </div>

                                   <select
                                        className="selectStyle"
                                        value={watchListWeeklyCurrentTVSeasonsYearStat}
                                        onChange={(e) =>
                                             setWatchListWeeklyCurrentTVSeasonsYearStat(parseInt(e.target.value, 10))
                                        }
                                   >
                                        <option value="-1">Please select</option>
                                        {watchListWeeklyTVSeasonsYearsStats?.map((year: string, index: number) => (
                                             <option key={index} value={year}>
                                                  {year}
                                             </option>
                                        ))}
                                   </select>

                                   {watchListWeeklyCurrentTVSeasonsYearStat !== -1 && (
                                        <div className="chart-container">
                                             <LineChart
                                                  xAxis={[
                                                       {
                                                            label: "Week",
                                                            data: Array.from({ length: watchListWeeklyTVSeasonsMaxWeek }, (_, i) => i + 1),
                                                       },
                                                  ]}
                                                  yAxis={[{ tickMinStep: 1 }]}
                                                  series={[
                                                       {
                                                            label: "Times Watched",
                                                            data: watchListWeeklyCurrentTVSeasonsWeekGroupingStat,
                                                       },
                                                  ]}
                                                  height={300}
                                             />
                                        </div>
                                   )}
                              </div>
                         </section>
                    </>
               }

               {statsLoadingCheck === APIStatus.Error &&
                    <h1>{errorMessage}</h1>
               }
          </div>
     );
}