"use client"

import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LineChart } from '@mui/x-charts/LineChart';
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

import IWatchListMovieCountStat from "../interfaces/IWatchListMovieCountStat";
import IWatchListMovieTop10Stat from "../interfaces/IWatchListMovieTop10Stat";
import IWatchListSourceDetailSortOption from "../interfaces/IWatchListSourceDetailSortOption";
import IWatchListSourceDtlStat from "../interfaces/IWatchListSourceDtlStat";
import IWatchListSourceStat from "../interfaces/IWatchListSourceStat";
import IWatchListTopRatedStat from "../interfaces/IWatchListTopRatedStat";
import IWatchListTVSeasonsCountStat from "../interfaces/IWatchListTVSeasonsCountStat";
import IWatchListTVTop10Stat from "../interfaces/IWatchListTVTop10Stat";
import IWatchListTVTotalCountStat from "../interfaces/IWatchListTVTotalCountStat";
import IWatchListWeeklyMovieStat from "../interfaces/IWatchListWeeklyMovieStat";
import IWatchListWeeklyTVStat from "../interfaces/IWatchListWeeklyTVStat";

import { APIStatus, DataContext, DataContextType } from "../data-context";

import "../css/tablestyle.css";
import "./watchliststats.css";
import WatchListItems from "../Items/page";
import IWatchListItem from "../interfaces/IWatchListItem";

export default function WatchListStats() {
     const {
          darkMode,
          demoMode,
          ratingMax,
          setIsError,
          setErrorMessage,
          watchListItems
     } = useContext(DataContext) as DataContextType

     const [hasStats, setHasStats] = useState(false);

     /* States for Movie Stats */
     const [watchListMovieTop10Stats, setWatchListMovieTop10Stats] = useState<IWatchListMovieTop10Stat[]>([]);
     const [watchListMovieTop10StatsLoadingCheck, setWatchListMovieTop10StatsLoadingCheck] = useState(APIStatus.Idle);
     const [watchListMovieCountStats, setWatchListMovieCountStats] = useState<IWatchListMovieCountStat[]>([]);
     const [watchListMovieCountStatsLoadingCheck, setWatchListMovieCountStatsLoadingCheck] = useState(APIStatus.Idle);
     const [watchListWeeklyCurrentMovieYearStat, setWatchListWeeklyCurrentMovieYearStat] = useState(-1);
     const [watchListWeeklyCurrentMovieWeekGroupingStat, setWatchListWeeklyCurrentMovieWeekGroupingStat] = useState<number[]>([]);
     const [watchListWeeklyMovieMaxWeek, setWatchListWeeklyMovieMaxWeek] = useState(-1);
     const [watchListWeeklyMovieStats, setWatchListWeeklyMovieStats] = useState<IWatchListWeeklyMovieStat[]>([]);
     const [watchListWeeklyMovieYearsStats, setWatchListWeeklyMovieYearsStats] = useState<[]>([]);

     /* States for Source Stats */
     const [watchListSourceDtlStats, setWatchListSourceDtlStats] = useState<IWatchListSourceDtlStat[]>([]);
     const [watchListSourceDtlLoadingCheck, setWatchListSourceDtlLoadingCheck] = useState(APIStatus.Idle);
     const [watchListSourceStats, setWatchListSourceStats] = useState<IWatchListSourceStat[]>([]);
     const [watchListSourceStatsFilter, setWatchListSourceStatsFilter] = useState("StartDate");
     const [watchListSourceStatsLoadingCheck, setWatchListSourceStatsLoadingCheck] = useState(APIStatus.Idle);

     /* States for Television Stats */
     const [watchListTVSeasonsCountStats, setWatchListTVSeasonsCountStats] = useState<IWatchListTVSeasonsCountStat[]>([]);
     const [watchListTVSeasonsCountStatsLoadingCheck, setWatchListSeasonsCountStatsLoadingCheck] = useState(APIStatus.Idle);
     const [watchListTVTop10Stats, setWatchListTVTop10Stats] = useState<IWatchListTVTop10Stat[]>([]);
     const [watchListTVTop10StatsLoadingCheck, setWatchListTVTop10StatsLoadingCheck] = useState(APIStatus.Idle);
     const [watchListTVTotalCountStats, setWatchListTVTotalCountStats] = useState<IWatchListTVTotalCountStat[]>([]);
     const [watchListTVTotalCountStatsLoadingCheck, setWatchListTVTotalCountStatsLoadingCheck] = useState(APIStatus.Idle);
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
     const [watchListWeeklyStatsLoadingCheck, setWatchListWeeklyStatsLoadingCheck] = useState(APIStatus.Idle);

     /* States for Top Rated Stats */
     const [watchListTopRatedStats, setWatchListTopRatedStats] = useState<IWatchListTopRatedStat[]>([]);
     const [watchListTopRatedStatsLoadingCheck, setWatchListTopRatedStatsLoadingCheck] = useState(APIStatus.Idle);

     const watchListSourceDetailSortOptions: IWatchListSourceDetailSortOption = {
          WatchListID: "ID",
          Name: "Name",
          StartDate: "Start Date",
          EndDate: "End Date",
     };

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

     // Initiate start of fetching WatchList Movie Top 10 Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieTop10StatsPayload = require("../demo/index").demoWatchListMovieTop10Stats;
               setWatchListMovieTop10Stats(demoWatchListMovieTop10StatsPayload);
               setWatchListMovieTop10StatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListMovieTop10StatsLoadingCheck === APIStatus.Idle) {
               setWatchListMovieTop10StatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListMovieTop10StatsLoadingCheck]);

     // Get WatchList Movie Top 10 Stats
     useEffect(() => {
          if (watchListMovieTop10StatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListMovieTop10Stats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListMovieTop10Stat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0) {
                                   setHasStats(true);
                              }

                              const newMovieTop10Stats: any = [];

                              res.data[1].map((stat: any) => {
                                   newMovieTop10Stats.push(
                                        {
                                             WatchListItemName: watchListItems.filter((watchListItem: IWatchListItem) => {
                                                  return watchListItem.WatchListItemID === stat.WatchListItemID
                                             })[0].WatchListItemName,
                                             ItemCount: stat.count
                                        }
                                   )
                              });

                              setWatchListMovieTop10Stats(newMovieTop10Stats);
                              setWatchListMovieTop10StatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList Movie Top 10 Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Movie Top 10 Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListItems, watchListMovieTop10StatsLoadingCheck]);

     // Initiate start of fetching WatchList Movie Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieCountStatsPayload = require("../demo/index").demoWatchListMovieCountStats;
               setWatchListMovieCountStats(demoWatchListMovieCountStatsPayload);
               setWatchListMovieCountStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListMovieCountStatsLoadingCheck === APIStatus.Idle) {
               setWatchListMovieCountStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListMovieCountStatsLoadingCheck]);

     // Get WatchList Movie Count Stats
     useEffect(() => {
          if (watchListMovieCountStatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListMovieCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListMovieCountStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1][0].MovieCount !== 0) {
                                   setHasStats(true);
                              }

                              setWatchListMovieCountStats(res.data[1]);
                              setWatchListMovieCountStatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList Movie count stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Movie count stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListMovieCountStatsLoadingCheck]);

     // Initiate start of fetching WatchList Source Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceStatsPayload = require("../demo/index").demoWatchListSourceStats;
               setWatchListSourceStats(demoWatchListSourceStatsPayload);
               setWatchListSourceStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListSourceStatsLoadingCheck === APIStatus.Idle) {
               setWatchListSourceStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListSourceStatsLoadingCheck]);

     // Get WatchList Source Stats
     useEffect(() => {
          if (watchListSourceStatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListSourceStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListSourceStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListSourceStats(res.data[1]);
                              setWatchListSourceStatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList Source Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Source Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListSourceStatsLoadingCheck]);

     // Initiate start of fetching WatchList Source Dtl Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceDtlStatsPayload = require("../demo/index").demoWatchListSourceDtlStats;
               setWatchListSourceDtlStats(demoWatchListSourceDtlStatsPayload);
               setWatchListSourceDtlLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListSourceDtlLoadingCheck === APIStatus.Idle) {
               setWatchListSourceDtlLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListSourceDtlLoadingCheck]);

     // Get WatchList Source Dtl Stats
     useEffect(() => {
          if (watchListSourceDtlLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListSourceStats?GetDetail=true`)
                    .then((res: AxiosResponse<IWatchListSourceStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListSourceDtlStats(res.data[1]);
                              setWatchListSourceDtlLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList Source Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage(`The fatal error ${err.message} occurred while getting the detail`);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListSourceDtlLoadingCheck]);

     // Initiate start of fetching WatchList Top Rated Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTopRatedStatsPayload = require("../demo/index").demoWatchListTopRatedStats;
               setWatchListTopRatedStats(demoWatchListTopRatedStatsPayload);
               setWatchListTopRatedStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListTopRatedStatsLoadingCheck === APIStatus.Idle) {
               setWatchListTopRatedStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListTopRatedStatsLoadingCheck]);

     // Get WatchList Top Rated Stats
     useEffect(() => {
          if (watchListTVTop10StatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListTopRatedStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTopRatedStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListTopRatedStats(res.data[1]);
                              setWatchListTVTop10StatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList Top Rated Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Top Rated Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListTVTop10StatsLoadingCheck, watchListTopRatedStatsLoadingCheck]);

     // Initiate start of fetching WatchList TV Top 10 Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVTop10StatsPayload = require("../demo/index").demoWatchListTVTop10Stats;
               setWatchListTVTop10Stats(demoWatchListTVTop10StatsPayload);
               setWatchListTVTop10StatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListTVTop10StatsLoadingCheck === APIStatus.Idle) {
               setWatchListTVTop10StatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListTVTop10StatsLoadingCheck]);

     // Get WatchList TV Top 10 Stats
     useEffect(() => {
          if (watchListTVTop10StatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListTVTop10Stats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVTop10Stat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListTVTop10Stats(res.data[1]);
                              setWatchListTVTop10StatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList TV Top 10 Rated Stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList TV Top 10 Stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListTVTop10StatsLoadingCheck]);

     // Initiate start of fetching WatchList TV Seasons Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVSeasonsCountStatsPayload = require("../demo/index").demoWatchListTVSeasonsCountStats;
               setWatchListTVSeasonsCountStats(demoWatchListTVSeasonsCountStatsPayload);
               setWatchListSeasonsCountStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListTVSeasonsCountStatsLoadingCheck === APIStatus.Idle) {
               setWatchListSeasonsCountStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListTVSeasonsCountStatsLoadingCheck]);

     // Get WatchList TV Seasons Count Stats
     useEffect(() => {
          if (watchListTVSeasonsCountStatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListTVSeasonsCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVSeasonsCountStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1][0].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListTVSeasonsCountStats(res.data[1]);
                              setWatchListSeasonsCountStatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList TV seasons count stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList TV seasons count stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListTVSeasonsCountStatsLoadingCheck]);

     // Initiate start of fetching WatchList TV Total Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVTotalCountStatsPayload = require("../demo/index").demoTVTotalStats;
               setWatchListTVTotalCountStats(demoWatchListTVTotalCountStatsPayload);
               setWatchListTVTotalCountStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListTVTotalCountStatsLoadingCheck === APIStatus.Idle) {
               setWatchListTVTotalCountStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListTVTotalCountStatsLoadingCheck]);

     // Get WatchList TV Total Count Stats
     useEffect(() => {
          if (watchListTVTotalCountStatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListTVTotalCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVTotalCountStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1][0].length > 0) {
                                   setHasStats(true);
                              }

                              setWatchListTVTotalCountStats(res.data[1]);
                              setWatchListTVTotalCountStatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList TV total count stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList TV total count stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListTVTotalCountStatsLoadingCheck]);

     // Initiate start of fetching WatchList Weekly Stats
     useEffect(() => {
          if (demoMode) {
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

               setWatchListWeeklyStatsLoadingCheck(APIStatus.Success);
               return;
          }

          if (watchListWeeklyStatsLoadingCheck === APIStatus.Idle) {
               setWatchListWeeklyStatsLoadingCheck(APIStatus.Loading);
          }
     }, [demoMode, watchListWeeklyStatsLoadingCheck]);

     // Get WatchList Weekly Stats
     useEffect(() => {
          if (watchListWeeklyStatsLoadingCheck === APIStatus.Loading) {
               axios.get(`/api/GetWatchListWeeklyBreakdown`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListWeeklyMovieStat>) => {
                         if (res.data[0] === "OK") {
                              if (res.data[1].length > 0 || res.data[2].length > 0 || res.data[3].length > 0) {
                                   setHasStats(true);
                              }

                              const uniqueTVSeasonsYears = res.data[1].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyTVSeasonsYearsStats(uniqueTVSeasonsYears);
                              setWatchListWeeklyTVSeasonStats(res.data[1]);

                              const uniqueMovieYears = res.data[2].map((item: IWatchListWeeklyMovieStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyMovieYearsStats(uniqueMovieYears);
                              setWatchListWeeklyMovieStats(res.data[2]);

                              const uniqueTVTotalYears = res.data[3].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyTVTotalYearsStats(uniqueTVTotalYears);
                              setWatchListWeeklyTVTotalStats(res.data[3]);

                              setWatchListWeeklyStatsLoadingCheck(APIStatus.Success);
                         } else {
                              setErrorMessage(`The following error occurred getting the WatchList weekly stats: ${res.data[1]}`);
                              setIsError(true);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList weekly stats with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [setErrorMessage, setIsError, watchListWeeklyStatsLoadingCheck]);

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

     const movieTop10Stats = (
          <>
               {watchListMovieTop10Stats && watchListMovieTop10Stats?.map((currentWatchListMovieStat: IWatchListMovieTop10Stat, index: number) => {
                    return (
                         <table key={index} className="datagrid">
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             {currentWatchListMovieStat.IMDB_URL === null && (
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                                                       {currentWatchListMovieStat.WatchListItemName} watched {currentWatchListMovieStat.ItemCount} time(s)
                                                  </div>
                                             )}

                                             {currentWatchListMovieStat.IMDB_URL !== null && (
                                                  <>
                                                       <a className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`} href={currentWatchListMovieStat.IMDB_URL} target="_blank">
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
               {watchListSourceStats && watchListSourceStats?.map((currentWatchListSourceStat: IWatchListSourceStat, index: number) => {
                    return (
                         <table key={index} className={`datagrid ${!darkMode ? " lightMode" : " darkMode"}`}>
                              <tbody className="data">
                                   <tr>
                                        <td>
                                             <div>
                                                  {/* This monstrosity watchListSourceDtlStats.filter accounts for items where StartDate is null which should never be and factors that into the total count */}
                                                  {currentWatchListSourceStat.WatchListSourceName} watched {
                                                       currentWatchListSourceStat.SourceCount
                                                       -
                                                       parseInt(watchListSourceDtlStats.filter((currentWatchListSourceDtlStat: IWatchListSourceDtlStat, index: number) => { return String(currentWatchListSourceDtlStat.WatchListSourceID) === String(currentWatchListSourceStat.WatchListSourceID) && (currentWatchListSourceDtlStat.StartDate === null) }).length.toString())
                                                  } time(s)

                                                  <SimpleTreeView aria-label="file system navigator" slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }} sx={{ flexGrow: 1, overflowY: "auto" }}>
                                                       <TreeItem itemId="1" label="Details">
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
                                                                 {watchListSourceDtlStats?.filter((currentWatchListSourceDtlStat: IWatchListSourceDtlStat, index: number) => {
                                                                      return (
                                                                           String(currentWatchListSourceDtlStat.WatchListSourceID) === String(currentWatchListSourceStat.WatchListSourceID) && currentWatchListSourceDtlStat.StartDate !== null
                                                                      )
                                                                 })
                                                                      .sort((a: IWatchListSourceDtlStat, b: IWatchListSourceDtlStat) => {
                                                                           switch (watchListSourceStatsFilter) {
                                                                                case "WatchListID":
                                                                                     return a.WatchListID > b.WatchListID ? 1 : -1;
                                                                                case "Name":
                                                                                     const aName = a.WatchListItemName;
                                                                                     const bName = b.WatchListItemName;

                                                                                     return String(aName) > String(bName) ? 1 : -1;
                                                                                case "StartDate":
                                                                                     return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? 1 : -1;
                                                                                case "EndDate":
                                                                                     return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? 1 : -1;
                                                                                default:
                                                                                     return 0;
                                                                           }
                                                                      })
                                                                      .map((currentWatchListSourceDtlStat: IWatchListSourceDtlStat, index: number) => {
                                                                           return (
                                                                                <li key={index}>
                                                                                     {currentWatchListSourceDtlStat.WatchListItemName} {currentWatchListSourceDtlStat.Season !== null ? ` (Season ${currentWatchListSourceDtlStat.Season})` : ``} {currentWatchListSourceDtlStat.StartDate !== null ? `watched` : ``}{" "}
                                                                                     {currentWatchListSourceDtlStat.EndDate !== null && currentWatchListSourceDtlStat.EndDate !== currentWatchListSourceDtlStat.StartDate ? ` from ${currentWatchListSourceDtlStat.StartDate} to ${currentWatchListSourceDtlStat.EndDate}` : currentWatchListSourceDtlStat.StartDate !== null ? `on ${currentWatchListSourceDtlStat.StartDate}` : ``}
                                                                                </li>
                                                                           );
                                                                      })}
                                                            </ul>
                                                       </TreeItem>
                                                  </SimpleTreeView>
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
               {watchListTopRatedStats && watchListTopRatedStats?.map((currentWatchListTopRatedStat: IWatchListTopRatedStat, index: number) => {
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

     const tvTop10Stats = (
          <>
               {watchListTVTop10Stats && watchListTVTop10Stats?.map((currentWatchListTVStat: IWatchListTVTop10Stat, index: number) => {
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

     if (watchListSourceStats?.length > 0 && watchListTopRatedStats?.length === 0 && watchListMovieTop10Stats?.length === 0 && watchListTVTop10Stats?.length === 0) {
          return (
               <div className={`flex-container ${!darkMode ? " lightMode" : " darkMode"}`}>
                    No stats are available
               </div>
          )
     }

     return (
          <span className="topMarginContent">
               {watchListMovieTop10StatsLoadingCheck === APIStatus.Success && watchListMovieCountStatsLoadingCheck === APIStatus.Success && watchListSourceDtlLoadingCheck === APIStatus.Success && watchListSourceStatsLoadingCheck === APIStatus.Success && watchListTVSeasonsCountStatsLoadingCheck === APIStatus.Success && watchListTVTop10StatsLoadingCheck === APIStatus.Success && watchListTVTotalCountStatsLoadingCheck === APIStatus.Success && watchListWeeklyStatsLoadingCheck == APIStatus.Success && !hasStats &&
                    <h1>No Stats</h1>
               }

               <div className={`flex-container${!darkMode ? " lightMode" : " darkMode"}`}>
                    <div className="col-1">
                         {sourceStats !== null && watchListSourceStats?.length > 0 &&
                              <>
                                   <h1>Most Watched Sources</h1>
                                   <div>{sourceStats}</div>
                              </>
                         }
                    </div>

                    <div className="col-1">
                         {topRated !== null && watchListTopRatedStats?.length > 0 &&
                              <>
                                   <h1>Top Rated</h1>
                                   <div>{topRated}</div>
                              </>
                         }
                    </div>

                    <div className="col-1">
                         {movieTop10Stats !== null && watchListMovieTop10Stats?.length > 0 &&
                              <>
                                   <h1>Top 10 Movies</h1>
                                   <div>{movieTop10Stats}</div>
                              </>
                         }
                    </div>

                    <div className="col-1">
                         {tvTop10Stats !== null && watchListTVTop10Stats?.length > 0 &&
                              <>
                                   <h1>Top 10 TV Shows</h1>
                                   <div>{tvTop10Stats}</div>
                              </>
                         }
                    </div>
               </div>

               <div className={`flex-container textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                    <div className="col-4">
                         {watchListMovieCountStats?.length > 0 && watchListMovieCountStats[0].MovieCount > 0 && //watchListWeeklyCurrentMovieWeekGroupingStat.length === watchListWeeklyMovieMaxWeek &&
                              <>
                                   <h1>Total Movies Watched</h1>
                                   <div>{watchListMovieCountStats[0].MovieCount}</div>

                                   <select className="selectStyle" value={watchListWeeklyCurrentMovieYearStat} onChange={(event) => setWatchListWeeklyCurrentMovieYearStat(parseInt(event.target.value, 10))}>
                                        <option value="-1">Please select</option>

                                        {watchListWeeklyMovieYearsStats?.map((year: string, index: number) => {
                                             return (
                                                  <option key={index} value={year}>
                                                       {year}
                                                  </option>
                                             );
                                        })}
                                   </select>

                                   {watchListWeeklyCurrentMovieYearStat !== -1 && watchListWeeklyCurrentMovieWeekGroupingStat &&
                                        <div className={`lineChart lightMode`}>
                                             <LineChart
                                                  xAxis={[{ scaleType: 'point', label: 'Week', data: Array.from({ length: watchListWeeklyMovieMaxWeek }, (_, index) => index + 1) }]}
                                                  yAxis={[{ tickMinStep: 1 }]}
                                                  series={[
                                                       {
                                                            label: 'Times Watched',
                                                            data: watchListWeeklyCurrentMovieWeekGroupingStat
                                                       },
                                                  ]}
                                                  width={500}
                                                  height={300}
                                             />
                                        </div>
                                   }
                              </>
                         }
                    </div>
               </div>

               <div className={`flex-container textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                    <div className="col-4">
                         {watchListTVTotalCountStats.length === 1 && watchListTVTotalCountStats[0].TVTotalCount > 0 &&
                              <>
                                   <h1>Total TV shows Watched</h1>
                                   <div>{watchListTVTotalCountStats[0].TVTotalCount}</div>

                                   <select className="selectStyle" value={watchListWeeklyCurrentTVTotalYearStat} onChange={(event) => setWatchListWeeklyCurrentTVTotalYearStat(parseInt(event.target.value, 10))}>
                                        <option value="-1">Please select</option>

                                        {watchListWeeklyTVTotalYearsStats?.map((year: string, index: number) => {
                                             return (
                                                  <option key={index} value={year}>
                                                       {year}
                                                  </option>
                                             );
                                        })}
                                   </select>

                                   {watchListWeeklyCurrentTVTotalYearStat !== -1 && watchListWeeklyCurrentTVTotalWeekGroupingStat &&
                                        <div className={`lineChart lightMode`}>
                                             <LineChart
                                                  xAxis={[{ label: 'Week', data: Array.from({ length: watchListWeeklyTVTotalMaxWeek }, (_, index) => index + 1) }]}
                                                  yAxis={[{ tickMinStep: 1 }]}
                                                  series={[
                                                       {
                                                            label: 'Times Watched',
                                                            data: watchListWeeklyCurrentTVTotalWeekGroupingStat
                                                       },
                                                  ]}
                                                  width={500}
                                                  height={300}
                                             />
                                        </div>
                                   }
                              </>
                         }
                    </div>
               </div>

               <div className={`flex-container textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                    {watchListTVSeasonsCountStats?.length > 0 && watchListTVSeasonsCountStats[0].TVSeasonsCount > 0 &&
                         <div className="col-4">
                              <h1>TV Seasons Watched</h1>
                              <div>{watchListTVSeasonsCountStats[0].TVSeasonsCount}</div>

                              <select className="selectStyle" value={watchListWeeklyCurrentTVSeasonsYearStat} onChange={(event) => setWatchListWeeklyCurrentTVSeasonsYearStat(parseInt(event.target.value, 10))}>
                                   <option value="-1">Please select</option>

                                   {watchListWeeklyTVSeasonsYearsStats?.map((year: string, index: number) => {
                                        return (
                                             <option key={index} value={year}>
                                                  {year}
                                             </option>
                                        );
                                   })}
                              </select>

                              {watchListWeeklyCurrentTVSeasonsYearStat !== -1 && watchListWeeklyCurrentTVSeasonsWeekGroupingStat &&
                                   <div className={`lineChart lightMode`}>
                                        <LineChart
                                             xAxis={[{ label: 'Week', data: Array.from({ length: watchListWeeklyTVSeasonsMaxWeek }, (_, index) => index + 1) }]}
                                             yAxis={[{ tickMinStep: 1 }]}
                                             series={[
                                                  {
                                                       label: 'Times Watched',
                                                       data: watchListWeeklyCurrentTVSeasonsWeekGroupingStat
                                                  },
                                             ]}
                                             width={500}
                                             height={300}
                                        />
                                   </div>
                              }
                         </div>
                    }
               </div>
          </span>
     );
}