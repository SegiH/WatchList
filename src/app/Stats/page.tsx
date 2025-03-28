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

import { DataContext, DataContextType } from "../data-context";

import "../css/tablestyle.css";
import "./watchliststats.css";

export default function WatchListStats() {
     const {
          darkMode,
          demoMode,
          ratingMax,
          setIsError,
          setErrorMessage
     } = useContext(DataContext) as DataContextType

     const [watchListMovieTop10Stats, setWatchListMovieTop10Stats] = useState<IWatchListMovieTop10Stat[]>([]);
     const [watchListMovieTop10StatsLoadingStarted, setWatchListMovieTop10StatsLoadingStarted] = useState(false);
     const [watchListMovieTop10StatsLoadingComplete, setWatchListMovieTop10StatsLoadingComplete] = useState(false);

     const [watchListMovieCountStats, setWatchListMovieCountStats] = useState<IWatchListMovieCountStat[]>([]);
     const [watchListMovieCountStatsLoadingStarted, setWatchListMovieCountStatsLoadingStarted] = useState(false);
     const [watchListMovieCountStatsLoadingComplete, setWatchListMovieCountStatsLoadingComplete] = useState(false);

     const [watchListSourceStats, setWatchListSourceStats] = useState<IWatchListSourceStat[]>([]);
     const [watchListSourceStatsLoadingStarted, setWatchListSourceStatsLoadingStarted] = useState(false);
     const [watchListSourceStatsLoadingComplete, setWatchListSourceStatsLoadingComplete] = useState(false);

     const [watchListTopRatedStats, setWatchListTopRatedStats] = useState<IWatchListTopRatedStat[]>([]);
     const [watchListTopRatedStatsLoadingStarted, setWatchListTopRatedStatsLoadingStarted] = useState(false);
     const [watchListTopRatedStatsLoadingComplete, setWatchListTopRatedStatsLoadingComplete] = useState(false);

     const [watchListTVTop10Stats, setWatchListTVTop10Stats] = useState<IWatchListTVTop10Stat[]>([]);
     const [watchListTVTop10StatsLoadingStarted, setWatchListTVTop10StatsLoadingStarted] = useState(false);
     const [watchListTVTop10StatsLoadingComplete, setWatchListTVTop10StatsLoadingComplete] = useState(false);

     const [watchListTVSeasonsCountStats, setWatchListTVSeasonsCountStats] = useState<IWatchListTVSeasonsCountStat[]>([]);
     const [watchListTVSeasonsCountStatsLoadingStarted, setWatchListTVSeasonsCountStatsLoadingStarted] = useState(false);
     const [watchListTVSeasonsCountStatsLoadingComplete, setWatchListTVSeasonsCountStatsLoadingComplete] = useState(false);

     const [watchListTVTotalCountStats, setWatchListTVTotalCountStats] = useState<IWatchListTVTotalCountStat[]>([]);
     const [watchListTVTotalCountStatsLoadingStarted, setWatchListTVTotalCountStatsLoadingStarted] = useState(false);
     const [watchListTVTotalCountStatsLoadingComplete, setWatchListTVTotalCountStatsLoadingComplete] = useState(false);

     const [watchListSourceDtlStats, setWatchListSourceDtlStats] = useState<IWatchListSourceDtlStat[]>([]);
     const [watchListSourceDtlLoadingStarted, setWatchListSourceDtlLoadingStarted] = useState(false);
     const [watchListSourceDtlLoadingComplete, setWatchListSourceDtlLoadingComplete] = useState(false);

     const [watchListWeeklyTVSeasonStats, setWatchListWeeklyTVSeasonStats] = useState<IWatchListWeeklyTVStat[]>([]);
     const [watchListWeeklyTVSeasonsYearsStats, setWatchListWeeklyTVSeasonsYearsStats] = useState<[]>([]);
     const [watchListWeeklyTVSeasonsMaxWeek, setWatchListWeeklyTVSeasonsMaxWeek] = useState(-1);
     const [watchListWeeklyCurrentTVSeasonsYearStat, setWatchListWeeklyCurrentTVSeasonsYearStat] = useState(-1);
     const [watchListWeeklyCurrentTVSeasonsWeekGroupingStat, setWatchListWeeklyCurrentTVSeasonsWeekGroupingStat] = useState<number[]>([]);
     const [watchListWeeklyTVSeasonsStatsLoadingStarted, setWatchListWeeklyTVSeasonsStatsLoadingStarted] = useState(false);
     const [watchListWeeklyTVSeasonsStatsLoadingComplete, setWatchListWeeklyTVSeasonsStatsLoadingComplete] = useState(false);

     const [watchListWeeklyTVTotalYearsStats, setWatchListWeeklyTVTotalYearsStats] = useState<[]>([]);
     const [watchListWeeklyCurrentTVTotalYearStat, setWatchListWeeklyCurrentTVTotalYearStat] = useState(-1);
     const [watchListWeeklyTVTotalStats, setWatchListWeeklyTVTotalStats] = useState<IWatchListWeeklyTVStat[]>([]);
     const [watchListWeeklyTVTotalStatsLoadingStarted, setWatchListWeeklyTVTotalStatsLoadingStarted] = useState(false);
     const [watchListWeeklyTVTotalStatsLoadingComplete, setWatchListWeeklyTVTotalStatsLoadingComplete] = useState(false);
     const [watchListWeeklyTVTotalMaxWeek, setWatchListWeeklyTVTotalMaxWeek] = useState(-1);
     const [watchListWeeklyCurrentTVTotalWeekGroupingStat, setWatchListWeeklyCurrentTVTotalWeekGroupingStat] = useState<number[]>([]);

     const [watchListWeeklyMovieStats, setWatchListWeeklyMovieStats] = useState<IWatchListWeeklyMovieStat[]>([]);
     const [watchListWeeklyMovieYearsStats, setWatchListWeeklyMovieYearsStats] = useState<[]>([]);
     const [watchListWeeklyMovieMaxWeek, setWatchListWeeklyMovieMaxWeek] = useState(-1);
     const [watchListWeeklyCurrentMovieYearStat, setWatchListWeeklyCurrentMovieYearStat] = useState(-1);
     const [watchListWeeklyCurrentMovieWeekGroupingStat, setWatchListWeeklyCurrentMovieWeekGroupingStat] = useState<number[]>([]);

     const [watchListWeeklyMovieStatsLoadingStarted, setWatchListWeeklyMovieStatsLoadingStarted] = useState(false);
     const [watchListWeeklyMovieStatsLoadingComplete, setWatchListWeeklyMovieStatsLoadingComplete] = useState(false);

     const [watchListSourceStatsFilter, setWatchListSourceStatsFilter] = useState("StartDate");

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
               setWatchListMovieTop10StatsLoadingStarted(true);
               setWatchListMovieTop10StatsLoadingComplete(true);
               return;
          }

          if (!watchListMovieTop10StatsLoadingStarted && !watchListMovieCountStatsLoadingComplete) {
               setWatchListMovieTop10StatsLoadingStarted(true);
          }
     }, [watchListMovieTop10StatsLoadingStarted, watchListMovieTop10StatsLoadingComplete]);

     // Get WatchList Movie Top 10 Stats
     useEffect(() => {
          if (watchListMovieTop10StatsLoadingStarted && !watchListMovieTop10StatsLoadingComplete) {
               axios.get(`/api/GetWatchListMovieTop10Stats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListMovieTop10Stat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListMovieTop10Stats(res.data[1]);
                              setWatchListMovieTop10StatsLoadingComplete(true);
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
     }, [watchListMovieTop10StatsLoadingStarted, watchListMovieTop10StatsLoadingComplete]);

     // Initiate start of fetching WatchList Movie Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListMovieCountStatsPayload = require("../demo/index").demoWatchListMovieCountStats;
               setWatchListMovieCountStats(demoWatchListMovieCountStatsPayload);
               setWatchListMovieCountStatsLoadingStarted(true);
               setWatchListMovieCountStatsLoadingComplete(true);
               return;
          }

          if (!watchListMovieCountStatsLoadingStarted && !watchListMovieCountStatsLoadingComplete) {
               setWatchListMovieCountStatsLoadingStarted(true);
          }
     }, [watchListMovieCountStatsLoadingStarted, watchListMovieCountStatsLoadingComplete]);

     // Get WatchList Movie Count Stats
     useEffect(() => {
          if (watchListMovieCountStatsLoadingStarted && !watchListMovieCountStatsLoadingComplete) {
               axios.get(`/api/GetWatchListMovieCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListMovieCountStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListMovieCountStats(res.data[1]);
                              setWatchListMovieCountStatsLoadingComplete(true);
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
     }, [watchListMovieCountStatsLoadingStarted, watchListMovieCountStatsLoadingComplete]);

     // Initiate start of fetching WatchList Source Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceStatsPayload = require("../demo/index").demoWatchListSourceStats;
               setWatchListSourceStats(demoWatchListSourceStatsPayload);
               setWatchListSourceStatsLoadingStarted(true);
               setWatchListSourceStatsLoadingComplete(true);
               return;
          }

          if (!watchListSourceStatsLoadingStarted && !watchListSourceStatsLoadingComplete) {
               setWatchListSourceStatsLoadingStarted(true);
          }
     }, [watchListSourceStatsLoadingStarted, watchListSourceStatsLoadingComplete]);

     // Initiate start of fetching WatchList Source Dtl Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListSourceDtlStatsPayload = require("../demo/index").demoWatchListSourceDtlStats;
               setWatchListSourceDtlStats(demoWatchListSourceDtlStatsPayload);
               setWatchListSourceDtlLoadingStarted(true);
               setWatchListSourceDtlLoadingComplete(true);
               return;
          }

          if (!watchListSourceDtlLoadingStarted && !watchListSourceDtlLoadingComplete) {
               setWatchListSourceDtlLoadingStarted(true);
          }
     }, [watchListSourceDtlLoadingStarted, watchListSourceDtlLoadingComplete]);

     // Get WatchList Source Dtl Stats
     useEffect(() => {
          if (watchListSourceDtlLoadingStarted && !watchListSourceDtlLoadingComplete) {
               axios.get(`/api/GetWatchListSourceStats?GetDetail=true`)
                    .then((res: AxiosResponse<IWatchListSourceStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListSourceDtlStats(res.data[1]);
                              setWatchListSourceDtlLoadingComplete(true);
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
     }, [watchListSourceDtlLoadingStarted, watchListSourceDtlLoadingComplete]);

     // Get WatchList Source Stats
     useEffect(() => {
          if (watchListSourceStatsLoadingStarted && !watchListSourceStatsLoadingComplete) {
               axios.get(`/api/GetWatchListSourceStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListSourceStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListSourceStats(res.data[1]);
                              setWatchListSourceStatsLoadingComplete(true);
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
     }, [watchListSourceStatsLoadingStarted, watchListSourceStatsLoadingComplete]);

     // Initiate start of fetching WatchList Top Rated Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTopRatedStatsPayload = require("../demo/index").demoWatchListTopRatedStats;
               setWatchListTopRatedStats(demoWatchListTopRatedStatsPayload);
               setWatchListTopRatedStatsLoadingStarted(true);
               setWatchListTopRatedStatsLoadingComplete(true);
               return;
          }

          if (!watchListTopRatedStatsLoadingStarted && !watchListTopRatedStatsLoadingComplete) {
               setWatchListTopRatedStatsLoadingStarted(true);
          }
     }, [watchListTopRatedStatsLoadingStarted, watchListTopRatedStatsLoadingComplete]);

     // Get WatchList Top Rated Stats
     useEffect(() => {
          if (watchListTopRatedStatsLoadingStarted && !watchListTopRatedStatsLoadingComplete) {
               axios.get(`/api/GetWatchListTopRatedStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTopRatedStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListTopRatedStats(res.data[1]);
                              setWatchListTopRatedStatsLoadingComplete(true);
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
     }, [watchListTopRatedStatsLoadingStarted, watchListTopRatedStatsLoadingComplete]);

     // Initiate start of fetching WatchList TV Top 10 Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVTop10StatsPayload = require("../demo/index").demoWatchListTVTop10Stats;
               setWatchListTVTop10Stats(demoWatchListTVTop10StatsPayload);
               setWatchListTVTop10StatsLoadingStarted(true);
               setWatchListTVTop10StatsLoadingComplete(true);
               return;
          }

          if (!watchListTVTop10StatsLoadingStarted && !watchListTVTop10StatsLoadingComplete) {
               setWatchListTVTop10StatsLoadingStarted(true);
          }
     }, [watchListTVTop10StatsLoadingStarted, watchListTVTop10StatsLoadingComplete]);

     // Get WatchList TV Top 10 Stats
     useEffect(() => {
          if (watchListTVTop10StatsLoadingStarted && !watchListTVTop10StatsLoadingComplete) {
               axios.get(`/api/GetWatchListTVTop10Stats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVTop10Stat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListTVTop10Stats(res.data[1]);
                              setWatchListTVTop10StatsLoadingComplete(true);
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
     }, [watchListTVTop10StatsLoadingStarted, watchListTVTop10StatsLoadingComplete]);

     // Initiate start of fetching WatchList TV Seasons Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVSeasonsCountStatsPayload = require("../demo/index").demoWatchListTVSeasonsCountStats;
               setWatchListTVSeasonsCountStats(demoWatchListTVSeasonsCountStatsPayload);
               setWatchListTVSeasonsCountStatsLoadingStarted(true);
               setWatchListTVSeasonsCountStatsLoadingComplete(true);
               return;
          }

          if (!watchListTVSeasonsCountStatsLoadingStarted && !watchListTVSeasonsCountStatsLoadingComplete) {
               setWatchListTVSeasonsCountStatsLoadingStarted(true);
          }
     }, [watchListTVSeasonsCountStatsLoadingStarted, watchListTVSeasonsCountStatsLoadingComplete]);

     // Get WatchList TV Seasons Count Stats
     useEffect(() => {
          if (watchListTVSeasonsCountStatsLoadingStarted && !watchListTVSeasonsCountStatsLoadingComplete) {
               axios.get(`/api/GetWatchListTVSeasonsCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVSeasonsCountStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListTVSeasonsCountStats(res.data[1]);
                              setWatchListTVSeasonsCountStatsLoadingComplete(true);
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
     }, [watchListTVSeasonsCountStatsLoadingStarted, watchListTVSeasonsCountStatsLoadingComplete]);

     // Initiate start of fetching WatchList TV Total Count Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListTVTotalCountStatsPayload = require("../demo/index").demoTVTotalStats;
               setWatchListTVTotalCountStats(demoWatchListTVTotalCountStatsPayload);
               setWatchListTVTotalCountStatsLoadingStarted(true);
               setWatchListTVTotalCountStatsLoadingComplete(true);
               return;
          }

          if (!watchListTVTotalCountStatsLoadingStarted && !watchListTVTotalCountStatsLoadingComplete) {
               setWatchListTVTotalCountStatsLoadingStarted(true);
          }
     }, [watchListTVTotalCountStatsLoadingStarted, watchListTVTotalCountStatsLoadingComplete]);

     // Get WatchList TV Total Count Stats
     useEffect(() => {
          if (watchListTVTotalCountStatsLoadingStarted && !watchListTVTotalCountStatsLoadingComplete) {
               axios.get(`/api/GetWatchListTVTotalCountStats`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListTVTotalCountStat>) => {
                         if (res.data[0] === "OK") {
                              setWatchListTVTotalCountStats(res.data[1]);
                              setWatchListTVTotalCountStatsLoadingComplete(true);
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
     }, [watchListTVTotalCountStatsLoadingStarted, watchListTVTotalCountStatsLoadingComplete]);

     // Initiate start of fetching WatchList Weekly Stats
     useEffect(() => {
          if (demoMode) {
               const demoWatchListWeeklyBreakDown = require("../demo/index").demoWatchListWeeklyBreakDown;

               const uniqueTVSeasonsYears = demoWatchListWeeklyBreakDown[1].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyTVSeasonsYearsStats(uniqueTVSeasonsYears);
               //setWatchListWeeklyCurrentTVSeasonsYearStat(new Date().getFullYear());
               setWatchListWeeklyTVSeasonStats(demoWatchListWeeklyBreakDown[1]);
               setWatchListWeeklyTVSeasonsStatsLoadingComplete(true);

               const uniqueTVTotalYears = demoWatchListWeeklyBreakDown[3].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyTVTotalYearsStats(uniqueTVTotalYears);
               //setWatchListWeeklyCurrentTVTotalYearStat(new Date().getFullYear());
               setWatchListWeeklyTVTotalStats(demoWatchListWeeklyBreakDown[3]);
               setWatchListWeeklyTVTotalStatsLoadingComplete(true);

               const uniqueMovieYears = demoWatchListWeeklyBreakDown[2].map((item: IWatchListWeeklyMovieStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
               setWatchListWeeklyMovieYearsStats(uniqueMovieYears);
               //setWatchListWeeklyCurrentMovieYearStat(new Date().getFullYear());
               setWatchListWeeklyMovieStats(demoWatchListWeeklyBreakDown[2]);
               setWatchListWeeklyMovieStatsLoadingComplete(true);
               return;
          }

          if (!watchListWeeklyTVSeasonsStatsLoadingStarted && !watchListWeeklyTVSeasonsStatsLoadingComplete && !watchListWeeklyTVTotalStatsLoadingStarted && !watchListWeeklyTVTotalStatsLoadingComplete && !watchListWeeklyMovieStatsLoadingStarted && !watchListWeeklyMovieStatsLoadingComplete) {
               setWatchListWeeklyTVSeasonsStatsLoadingStarted(true);
               setWatchListWeeklyTVTotalStatsLoadingStarted(true);
               setWatchListWeeklyMovieStatsLoadingStarted(true);
          }
     }, [watchListWeeklyTVSeasonsStatsLoadingStarted, watchListWeeklyTVSeasonsStatsLoadingComplete, watchListWeeklyTVTotalStatsLoadingStarted, watchListWeeklyTVTotalStatsLoadingComplete, watchListWeeklyMovieStatsLoadingStarted, watchListWeeklyMovieStatsLoadingComplete]);

     // Get WatchList Weekly Stats
     useEffect(() => {
          if (watchListWeeklyTVSeasonsStatsLoadingStarted && !watchListWeeklyTVSeasonsStatsLoadingComplete && watchListWeeklyTVTotalStatsLoadingStarted && !watchListWeeklyTVTotalStatsLoadingComplete && watchListWeeklyMovieStatsLoadingStarted && !watchListWeeklyMovieStatsLoadingComplete) {
               axios.get(`/api/GetWatchListWeeklyBreakdown`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListWeeklyMovieStat>) => {
                         if (res.data[0] === "OK") {
                              const uniqueTVSeasonsYears = res.data[1].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyTVSeasonsYearsStats(uniqueTVSeasonsYears);
                              //setWatchListWeeklyCurrentTVSeasonsYearStat(new Date().getFullYear());
                              setWatchListWeeklyTVSeasonStats(res.data[1]);
                              setWatchListWeeklyTVSeasonsStatsLoadingComplete(true);

                              const uniqueMovieYears = res.data[2].map((item: IWatchListWeeklyMovieStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyMovieYearsStats(uniqueMovieYears);
                              //setWatchListWeeklyCurrentMovieYearStat(new Date().getFullYear());
                              setWatchListWeeklyMovieStats(res.data[2]);
                              setWatchListWeeklyMovieStatsLoadingComplete(true);

                              const uniqueTVTotalYears = res.data[3].map((item: IWatchListWeeklyTVStat) => item.Year).filter((value: string, index: number, current_value: [string]) => { return current_value.indexOf(value) === index }).sort();
                              setWatchListWeeklyTVTotalYearsStats(uniqueTVTotalYears);
                              //setWatchListWeeklyCurrentTVTotalYearStat(new Date().getFullYear());
                              setWatchListWeeklyTVTotalStats(res.data[3]);
                              setWatchListWeeklyTVTotalStatsLoadingComplete(true);
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
     }, [watchListWeeklyTVSeasonsStatsLoadingStarted, watchListWeeklyTVSeasonsStatsLoadingComplete, watchListWeeklyTVTotalStatsLoadingStarted, watchListWeeklyTVTotalStatsLoadingComplete, watchListWeeklyMovieStatsLoadingStarted, watchListWeeklyMovieStatsLoadingComplete]);

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
                         {watchListMovieCountStats?.length > 0 && //watchListWeeklyCurrentMovieWeekGroupingStat.length === watchListWeeklyMovieMaxWeek &&
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