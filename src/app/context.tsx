"use client";

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import IBugLog from "./interfaces/IBugLog";
import IUser from "./interfaces/IUser";
import IUserOption from "./interfaces/IUserOption";
import IWatchList from "./interfaces/IWatchList";
import IWatchListItem from "./interfaces/IWatchListItem";
import IWatchListSource from "./interfaces/IWatchListSource";
import IWatchListType from "./interfaces/IWatchListType";

const ratingMax = 5;

import AddIcon from "@mui/icons-material/Add";
const AddIconComponent = <AddIcon className="icon" />;

import AdminConsoleIcon from "@mui/icons-material/AdminPanelSettings";
const AdminConsoleIconComponent = <AdminConsoleIcon />;

import BrokenImageIcon from "@mui/icons-material/BrokenImage";
const BrokenImageIconComponent = <BrokenImageIcon className="brokenImage" />;

import BugReport from "@mui/icons-material/BugReport";
const BugReportIconComponent = <BugReport className="icon" />;

import CancelIcon from "@mui/icons-material/Cancel";
const CancelIconComponent = <CancelIcon />;

import DeleteIcon from "@mui/icons-material/Delete";
const DeleteIconComponent = <DeleteIcon />;

import EditIcon from "@mui/icons-material/Edit";
const EditIconComponent = <EditIcon />;

import LogOutIcon from "@mui/icons-material/Logout";
const LogOutIconComponent = <LogOutIcon className="icon" />;

import SaveIcon from "@mui/icons-material/Save";
const SaveIconComponent = <SaveIcon />;

import SearchIcon from "@mui/icons-material/Search";
const SearchIconComponent = <SearchIcon className="icon" />;

import StatsIcon from "@mui/icons-material/BarChart";
const StatsIconComponent = <StatsIcon className="icon" />;

import WatchListIcon from "@mui/icons-material/Movie";
const WatchListIconComponent = <WatchListIcon className="icon" />;

import WatchListItemsIcon from "@mui/icons-material/SmartDisplay";

import { AdminContextType } from "./contexts/AdminContextType";
import { BugLogsContextType } from "./contexts/BugLogsContextType";
import { DataContextType } from "./contexts/DataContextType";
import { ErrorContextType } from "./contexts/ErrorContextType";
import { HamburgerMenuContextType } from './contexts/HamburgerMenuContextType';
import { ItemsCardContextType } from "./contexts/ItemsCardContextType";
import { ItemsContextType } from "./contexts/ItemsContextType";
import { ItemsDtlContextType } from "./contexts/ItemsDtlContextType";
import { LoginContextType } from "./contexts/LoginContextType";
import { ManageUserAccountsContextType } from "./contexts/ManageUserAccountsContextType";
import { ManageWatchListSourcesContextType } from "./contexts/ManageWatchListSourcesContextType";
import { ManageWatchListTypesContextType } from "./contexts/ManageWatchListTypesContextType";
import { PageNavigationBarContextType as PageNavigationBarContextType } from "./contexts/PageNavigationBarContextType";
import { RecommendationsContextType } from "./contexts/RecommendationsContextType";
import { SearchIMDBContextType } from "./contexts/SearchIMDBContextType";
import { SetupContextType } from "./contexts/SetupContextType";
import { SharedLayoutContextType } from "./contexts/SharedLayoutContextType";
import { TabsContextType } from "./contexts/TabsContextType";
import { WatchListCardContextType } from "./contexts/WatchListCardContextType";
import { WatchListContextType } from "./contexts/WatchListContextType";
import { WatchListDtlContextType } from "./contexts/WatchListDtlContextType";
import { WatchListStatsContextType } from "./contexts/WatchListStatsContextType";

import ComposeProviders from './components/ComposeProviders';

import IRouteList, { RouteKey } from './interfaces/IRoute';
const WatchListItemsIconComponent = <WatchListItemsIcon className="icon" />;

const DataContext = createContext({} as DataContextType);
const ErrorContext = createContext({} as ErrorContextType);
const HamburgerMenuContext = createContext({} as HamburgerMenuContextType);
const ManageUserAccountsContext = createContext({} as ManageUserAccountsContextType);
const ManageWatchListSourcesContext = createContext({} as ManageWatchListSourcesContextType);
const ManageWatchListTypesContext = createContext({} as ManageWatchListTypesContextType);
const AdminContext = createContext({} as AdminContextType);
const BugLogsContext = createContext({} as BugLogsContextType);
const PageNavigationBarContext = createContext({} as PageNavigationBarContextType);
const RecommendationsContext = createContext({} as RecommendationsContextType);
const SearchIMDBContext = createContext({} as SearchIMDBContextType);
const TabsContext = createContext({} as TabsContextType);
const ItemsContext = createContext({} as ItemsContextType);
const ItemsDtlContext = createContext({} as ItemsDtlContextType);
const ItemsCardContext = createContext({} as ItemsCardContextType);
const LoginContext = createContext({} as LoginContextType);
const SetupContext = createContext({} as SetupContextType);
const WatchListStatsContext = createContext({} as WatchListStatsContextType);
const WatchListContext = createContext({} as WatchListContextType);
const WatchListDtlContext = createContext({} as WatchListDtlContextType);
const WatchListCardContext = createContext({} as WatchListCardContextType);
const SharedLayoutContext = createContext({} as SharedLayoutContextType);

interface DataProviderProps {
     children?: ReactNode;
}

export const APIStatus = {
     Unavailable: "Unavailable",
     Idle: "Idle",
     Loading: "Loading",
     Success: "Success",
     Error: "Error",
     Unauthorized: "Unauthorized"
}

const DataProvider = ({
     children
}: DataProviderProps) => {
     const [activeRoute, setActiveRoute] = useState<RouteKey | null>(null);
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(true);
     const [buildDate, setBuildDate] = useState('');
     const [bugLogs, setBugLogs] = useState<IBugLog[]>([]);
     const [clientCheck, setClientCheck] = useState(APIStatus.Idle);
     const [currentWatchListPage, setCurrentWatchListPage] = useState(1);
     const [currentItemsPage, setCurrentItemsPage] = useState(1);
     const [darkMode, setDarkMode] = useState(true);
     const [demoMode, setDemoMode] = useState(false);
     const [demoModeNotificationVisible, setDemoModeNotificationVisible] = useState(false);
     const [hideTabs, setHideTabs] = useState(false);
     const [imdbSearchEnabled, setImdbSearchEnabled] = useState(false);
     const [isAdding, setIsAdding] = useState(false);
     const [isClient, setIsClient] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const [isError, setIsError] = useState(false);
     const [errorMessage, setErrorMessage] = useState("");
     const [isLoading, setIsLoading] = useState(true);
     const [lastPage, setLastPage] = useState(false);
     const [loggedInCheck, setLoggedInCheck] = useState(APIStatus.Idle);
     const [metaDataFilters, setMetaDataFilters] = useState<Record<string, any>>({});
     const [pageSize, setPageSize] = useState(typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 49); // items per page. Mobile has less items
     const [recommendationsEnabled, setRecommendationsEnabled] = useState(false);
     const [searchCount, setSearchCount] = useState(5);
     const [searchTerm, setSearchTerm] = useState("");
     const [searchModalVisible, setSearchModalVisible] = useState(false);
     const [showMissingArtwork, setShowMissingArtwork] = useState(false);
     const [stillWatching, setStillWatching] = useState(true);
     const [sourceFilter, setSourceFilter] = useState(-1);
     const [typeFilter, setTypeFilter] = useState(-1);
     const [users, setUsers] = useState<IUser[]>([]);
     const [userData, setUserData] = useState({ UserID: 0, Username: "", RealName: "", Admin: 0 }); // cannot use iUserEmpty() here

     const [watchList, setWatchList] = useState<IWatchList[]>([]);
     const [filteredWatchList, setFilteredWatchList] = useState<IWatchList[]>([]);
     const [watchListSortingCheck, setWatchListSortingCheck] = useState(APIStatus.Idle);

     const [watchListItems, setWatchListItems] = useState<IWatchListItem[]>([]);
     const [filteredWatchListItems, setFilteredWatchListItems] = useState<IWatchListItem[]>([]);
     const [watchListItemsSortingCheck, setWatchListItemsSortingCheck] = useState(APIStatus.Idle);

     const [watchListSources, setWatchListSources] = useState<IWatchListSource[]>([]);
     const [watchListSourcesLoadingCheck, setWatchListSourcesLoadingCheck] = useState(APIStatus.Idle);

     const [watchListTypes, setWatchListTypes] = useState<IWatchListType[]>([]);
     const [watchListTypesLoadingCheck, setWatchListTypesLoadingCheck] = useState(APIStatus.Idle);

     const [watchListSortColumn, setWatchListSortColumn] = useState("");
     const [watchListSortDirection, setWatchListSortDirection] = useState("");
     const [visibleSectionChoices, setVisibleSectionChoices] = useState<any>(null);
     const [visibleSections, setVisibleSections] = useState<any>(null);

     const [routes, setRoutes] = useState<IRouteList | null>(null);

     /* static values */
     const currentPath = usePathname();
     const defaultRoute = "WatchList";
     const demoUsername = "demo";
     const demoPassword = "demo";

     const router = useRouter();

     const watchListSortColumns = {
          ID: "ID",
          Name: "Name",
          StartDate: "Start Date",
          EndDate: "End Date",
     };

     const watchListItemsSortColumns = useMemo(() => {
          return {
               ID: "ID",
               Name: "Name",
               Type: "Type"
          }
     }, []);

     const formatWatchListDates = (startDate: string, endDate: string) => {
          // Helper function to format a date string from "yyyy-mm-dd" to "mm/dd/yy"
          const formatDate = (dateStr: string) => {
               const [year, month, day] = dateStr.split("-");
               const shortYear = year.slice(-2); // Get last 2 digits of the year
               return `${month}/${day}/${shortYear}`;
          }

          if (!startDate) return ""; // Optional: handle missing startDate gracefully

          const formattedStart = formatDate(startDate);

          if (!endDate) {
               return `${formattedStart}-`;
          }

          const formattedEnd = formatDate(endDate);
          return `${formattedStart}-${formattedEnd}`;
     }

     const getMissingPoster = async (watchListItemID: number) => {
          if (demoMode) {
               return [];
          }

          try {
               // Get artwork for missing poster
               const missingPostersResponse = await fetch(`/api/UpdateMissingPosters?IDs=${watchListItemID}`, { credentials: 'include' });

               const missingPostersResult = await missingPostersResponse.json();

               if (missingPostersResult[0] === "OK") {
                    return missingPostersResult[1];
               } else {
                    writeLog(`No result when getting missing poster for ID ${watchListItemID}`)
                    return [];
               }
          } catch (e: any) {
               writeLog(`Error ${e.message} occurred when getting result when getting missing poster for ID ${watchListItemID}`)
               return [];
          }
     }

     const getPath = useCallback((routeName: string) => {
          if (routes === null) {
               return;
          }
          const matchingRoute = Object.keys(routes).filter((currentRouteList) => routes[currentRouteList].Name === routeName);

          if (matchingRoute.length === 1) {
               return routes[matchingRoute[0]].Path;
          } else {
               return "";
          }
     }, [routes]);

     const getWatchList = async () => {
          if (demoMode) {
               return;
          }

          if (watchListSortingCheck == APIStatus.Loading) {
               return;
          } else {
               setWatchListSortingCheck(APIStatus.Loading);
          }

          const newSliceStart = (currentWatchListPage - 1) * pageSize;
          const newSliceEnd = newSliceStart + pageSize;

          const newMetaDataFilters = JSON.parse(JSON.stringify(metaDataFilters));

          // This key is added automatically for some reason so remove it.
          if (typeof newMetaDataFilters["0"] !== "undefined") {
               delete newMetaDataFilters["0"];
          }

          const watchListSortColumnParam = watchListSortColumn !== "" ? watchListSortColumn : "ID";
          const watchListSortDirectionParam = watchListSortDirection !== "" ? watchListSortDirection : "ASC";

          try {
               const watchListResponse = await fetch(`/api/GetWatchList?StartIndex=${newSliceStart}&EndIndex=${newSliceEnd}&StillWatching=${stillWatching}&SortColumn=${watchListSortColumnParam}&SortDirection=${watchListSortDirectionParam}&ArchivedVisible=${archivedVisible}${sourceFilter !== null && sourceFilter !== -1 ? `&SourceFilter=${sourceFilter}` : ``}${typeFilter !== null && typeFilter !== -1 ? `&TypeFilter=${typeFilter}` : ``}${(searchTerm !== "" ? `&SearchTerm=${searchTerm}` : ``)}${Object.keys(newMetaDataFilters).length > 0 ? `&MetadataFilters=${JSON.stringify(newMetaDataFilters)}` : ""}`, { credentials: 'include' });

               const watchListResult = await watchListResponse.json();

               if (watchListResult[0] !== "OK") {
                    setErrorMessage("Failed to get WatchList with the error " + watchListResult[1])
                    setIsError(true);
                    return;
               }

               if (activeRoute === "WatchList" && watchListResult[1].length < pageSize) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }

               setFilteredWatchList(watchListResult[1]);
               setWatchListSortingCheck(APIStatus.Success);
          } catch (e: any) {
               setErrorMessage("Failed to get WatchList with the error " + e.message)
               setIsError(true);
               return;
          }
     }

     const getWatchListItems = async () => {
          if (demoMode) {
               return;
          }

          setWatchListItemsSortingCheck(APIStatus.Loading);

          const newSliceStart = (currentItemsPage - 1) * pageSize;
          const newSliceEnd = newSliceStart + pageSize;

          const newMetaDataFilters = JSON.parse(JSON.stringify(metaDataFilters));

          // This key is added automatically for some reason so remove it.
          if (typeof newMetaDataFilters["0"] !== "undefined") {
               delete newMetaDataFilters["0"];
          }

          const watchListSortColumnParam = watchListSortColumn !== "" ? watchListSortColumn : "ID";
          const watchListSortDirectionParam = watchListSortDirection !== "" ? watchListSortDirection : "ASC";

          try {
               const watchListItemsResponse = await fetch(`/api/GetWatchListItems?StartIndex=${newSliceStart}&EndIndex=${newSliceEnd}&SortColumn=${watchListSortColumnParam}&SortDirection=${watchListSortDirectionParam}&ArchivedVisible=${archivedVisible}&ShowMissingArtwork=${showMissingArtwork}${typeFilter !== null && typeFilter !== -1 ? `&TypeFilter=${typeFilter}` : ``}${(searchTerm !== "" ? `&SearchTerm=${searchTerm}` : ``)}${Object.keys(newMetaDataFilters).length > 0 ? `&MetadataFilters=${JSON.stringify(newMetaDataFilters)}` : ""}`, { credentials: 'include' });

               const watchListItemsResult = await watchListItemsResponse.json();

               if (watchListItemsResult[0] !== "OK") {
                    setErrorMessage("Failed to get WatchList Items with the error " + watchListItemsResult[1]);
                    setIsError(true);
                    return;
               }

               if (activeRoute === "Items" && watchListItemsResult[1].length < pageSize) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }

               setFilteredWatchListItems(watchListItemsResult[1]);

               setWatchListItemsSortingCheck(APIStatus.Success);

               return watchListItemsResult[1];
          } catch (e: any) {
               setErrorMessage("Failed to get WatchList Items with the error " + e.message)
               setIsError(true);
               return;
          }
     }

     const getWatchListSources = async () => {
          try {
               const getWatchListSourcesResponse = await fetch(`/api/GetWatchListSources`, { credentials: 'include' });

               const getWatchListSourcesResult = await getWatchListSourcesResponse.json();

               if (getWatchListSourcesResult[0] !== "OK") {
                    setErrorMessage("Failed to get WatchList Sources with the error " + getWatchListSourcesResult[1]);
                    setIsError(true);
                    return;
               }

               const wls = getWatchListSourcesResult[1];

               wls.sort((a: IWatchListSource, b: IWatchListSource) => {
                    const aName = a.WatchListSourceName;
                    const bName = b.WatchListSourceName;

                    return String(aName) > String(bName) ? 1 : -1;
               });

               setWatchListSources(wls);
               setWatchListSourcesLoadingCheck(APIStatus.Success);
          } catch (e: any) {
               setErrorMessage("Failed to get WatchList Sources with the error " + e.message);
               setIsError(true);
               return;
          }
     }

     const getWatchListTypes = async () => {
          try {
               const getWatchListTypesResponse = await fetch(`/api/GetWatchListTypes`, { credentials: 'include' });

               const getWatchListTypesResult = await getWatchListTypesResponse.json();

               if (getWatchListTypesResult[0] !== "OK") {
                    setErrorMessage("Failed to get WatchList Types with the error " + getWatchListTypesResult[1]);
                    setIsError(true);
                    return;
               }

               setWatchListTypes(getWatchListTypesResult[1]);
               setWatchListTypesLoadingCheck(APIStatus.Success);

               setIsLoading(false);
          } catch (e: any) {
               setErrorMessage("Failed to get WatchList Types with the error " + e.message);
               setIsError(true);
               return;
          }
     }

     const isAdmin = () => {
          if (demoMode) {
               return false;
          } else {
               return userData.Admin === 1;
          }
     }

     const isEnabled = (sectionName: string) => {
          if (routes === null) {
               return false;
          }

          const matchingRoute = Object.keys(routes).filter((routeKey) => routes[routeKey].Path === sectionName);

          if (matchingRoute.length === 1) {
               return true;
          } else {
               return false;
          }
          /*if (visibleSections.length === 0) {
               return false;
          }

          const visibleResult = visibleSections?.filter((section) => section.label === sectionName);

          if (visibleResult.length === 1) {
               return true;
          } else {
               return false;
          }*/
     }

     const isIMDBSearchEnabled = async () => {
          try {
               const isIMDBSearchEnabledResponse = await fetch(`/api/IsIMDBSearchEnabled`, { credentials: 'include' });

               const isIMDBSearchEnabledResult = await isIMDBSearchEnabledResponse.json();

               if (isIMDBSearchEnabledResult[0] === "OK") {
                    setImdbSearchEnabled(true);
               }
          } catch (e: any) {
               setErrorMessage("Failed to check if IMDB search is enabled with the error " + e.message);
               setIsError(true);
               return;
          }
     }

     const isRecommendationsEnabled = async () => {
          try {
               const isRecommendationsEnabledResponse = await fetch(`/api/IsRecommendationsEnabled`, { credentials: 'include' });

               const isRecommendationsEnabledResult = await isRecommendationsEnabledResponse.json();

               if (isRecommendationsEnabledResult[0] === "OK") {
                    setRecommendationsEnabled(true);
               }
          } catch (e: any) {
               setErrorMessage("Failed to check if recommendations enabled with the error " + e.message);
               setIsError(true);
               return;
          }
     }

     const isLoggedInCheck = useCallback(() => {
          if (demoMode) {
               return true;
          }

          if (loggedInCheck == APIStatus.Idle) return false;

          return true;
     }, [loggedInCheck]);

     const openDetailClickHandler = useCallback((Id: number, activeRouteOverride: string = "") => {
          // Disable pull to refresh
          pullToRefreshEnabled(false);

          setSearchModalVisible(false);

          if (((activeRoute === "WatchList" && activeRouteOverride === "") || activeRouteOverride === "WatchList") && Id !== null) {
               if (Id === -1) {
                    setIsAdding(true);
               }

               router.push(`/WatchList/Dtl${Id !== -1 ? `?WatchListID=${Id}` : ""}`);
          } else if (((activeRoute === "Items" && activeRouteOverride === "") || activeRouteOverride === "Items") && Id !== null) {
               if (Id === -1) {
                    setIsAdding(true);
               }

               router.push(`/Items/Dtl?WatchListItemID=${Id}`);
          }
     }, [activeRoute, router, setIsAdding]);

     const pullToRefreshEnabled = (enabled: boolean) => {
          if (typeof document === "undefined") return;

          if (enabled) {
               document.getElementsByTagName("html")[0].classList.remove("no-pull-to-refresh");
          } else {
               document.getElementsByTagName("html")[0].classList.add("no-pull-to-refresh");
          }
     }

     const saveOptions = async (newOptions: IUserOption) => {
          if (demoMode) {
               return;
          }

          try {
               const saveOptionsResponse = await fetch(`/api/UpdateOptions?Options=${JSON.stringify(newOptions)}`, { credentials: 'include' });

               const saveOptionsResult = await saveOptionsResponse.json();

               if (saveOptionsResult[0] != "OK") {
                    setErrorMessage("Failed to update options with the error " + saveOptionsResult[1]);
                    setIsError(true);
               }
          } catch (e: any) {
               setErrorMessage("Failed to update options with the error " + e.message);
               setIsError(true);
               return;
          }
     }

     const setNewPage = (adjustValue: number) => {
          if (activeRoute === "WatchList") {
               if (demoMode) {
                    const demoWatchListPayload = require("./demo/index").demoWatchListPayload;
                    const newPageStart = (((currentWatchListPage + adjustValue) - 1) * pageSize);
                    const newPageEnd = newPageStart + pageSize;
                    const newFilteredWatchList = demoWatchListPayload.slice(newPageStart, newPageEnd)

                    setFilteredWatchList(newFilteredWatchList);

                    // Check if last page
                    const newPageStartNext = (((currentWatchListPage + adjustValue)) * pageSize);
                    const newPageEndNext = newPageStartNext + pageSize;
                    const newFilteredWatchListNext = demoWatchListPayload.slice(newPageStartNext, newPageEndNext).sort((a: IWatchList, b: IWatchList) => {
                         switch (watchListSortColumn) {
                              case "ID":
                                   return a.WatchListID > b.WatchListID ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              case "Name":
                                   const aName = a.WatchListItemName;
                                   const bName = b.WatchListItemName;

                                   return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              case "StartDate":
                                   return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              case "EndDate":
                                   return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              default:
                                   return 0;
                         }
                    });

                    if (newFilteredWatchListNext.length === 0) {
                         setLastPage(true);
                    } else {
                         setLastPage(false);
                    }
               }

               setCurrentWatchListPage(p => p + adjustValue);
          } else if (activeRoute === "Items") {
               if (demoMode) {
                    const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;
                    const newPageStart = (((currentItemsPage + adjustValue) - 1) * pageSize);
                    const newPageEnd = newPageStart + pageSize;
                    const newFilteredWatchListItems = demoWatchListItemsPayload.slice(newPageStart, newPageEnd).sort((a: IWatchListItem, b: IWatchListItem) => {
                         switch (watchListSortColumn) {
                              case "ID":
                                   return a.WatchListItemID > b.WatchListItemID
                                        ? (watchListSortDirection === "ASC" ? 1 : -1)
                                        : watchListSortDirection === "ASC" ? -1 : 1;
                              case "Name":
                                   return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              case "Type":
                                   return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                              default:
                                   return 0;
                         }
                    });

                    setFilteredWatchListItems(newFilteredWatchListItems);

                    // Check if last page
                    const newPageStartNext = (((currentItemsPage + adjustValue)) * pageSize);
                    const newPageEndNext = newPageStartNext + pageSize;
                    const newFilteredWatchListItemsNext = demoWatchListItemsPayload.slice(newPageStartNext, newPageEndNext);

                    if (newFilteredWatchListItemsNext.length === 0) {
                         setLastPage(true);
                    } else {
                         setLastPage(false);
                    }
               }

               setCurrentItemsPage(p => p + adjustValue);
          }
     }

     const setOptions = useCallback((newOptions: IUserOption) => {
          const newArchivedVisible = typeof newOptions.ArchivedVisible !== "undefined" && newOptions.ArchivedVisible === 1 ? true : false;
          setArchivedVisible(newArchivedVisible);

          const newAutoAdd = typeof newOptions.AutoAdd !== "undefined" && newOptions.AutoAdd === 1 ? true : false;
          setAutoAdd(newAutoAdd);

          const newDarkMode = typeof newOptions.DarkMode !== "undefined" && newOptions.DarkMode === 1 ? true : false;
          setDarkMode(newDarkMode);

          const newHideTabs = typeof newOptions.HideTabs !== "undefined" && newOptions.HideTabs === 1 ? true : false;
          setHideTabs(newHideTabs);

          const newStillWatching = typeof newOptions.StillWatching !== "undefined" && newOptions.StillWatching === 1 ? true : false;
          setStillWatching(newStillWatching);

          const newShowMissingArtwork = typeof newOptions.ShowMissingArtwork !== "undefined" && newOptions.ShowMissingArtwork === 1 ? true : false;
          setShowMissingArtwork(newShowMissingArtwork);

          const newSourceFilter = typeof newOptions.SourceFilter !== "undefined" && !isNaN(newOptions.SourceFilter) ? newOptions.SourceFilter : sourceFilter;
          setSourceFilter(newSourceFilter);

          const newTypeFilter = typeof newOptions.TypeFilter !== "undefined" && !isNaN(newOptions.TypeFilter) ? newOptions.TypeFilter : typeFilter;
          setTypeFilter(newTypeFilter);

          const newSortColumn = typeof newOptions.WatchListSortColumn !== "undefined" ? newOptions.WatchListSortColumn : "Name";
          setWatchListSortColumn(newSortColumn);

          const newSortDirection = typeof newOptions.WatchListSortDirection !== "undefined" ? newOptions.WatchListSortDirection : "DESC";
          setWatchListSortDirection(newSortDirection);

          const newVisibleSections = typeof newOptions.VisibleSections !== "undefined"
               ? JSON.parse(newOptions.VisibleSections)
               : [{ value: "2", label: 'Stats' }];

          setVisibleSections(newVisibleSections);
     }, [sourceFilter, typeFilter]);

     const showSearch = () => {
          setSearchModalVisible(true);
     };

     const signOut = async () => {
          if (demoMode) {
               signOutActions();
               return;
          }

          try {
               const signOutResponse = await fetch(`/api/SignOut`, { credentials: 'include' });

               const signOutResult = await signOutResponse.json();

               if (signOutResult[0] === "OK") {
                    signOutActions();
               } else {
                    alert(signOutResult[1]);
               }
          } catch (e: any) {
               setErrorMessage("Failed to sign out with the error " + e.message);
               setIsError(true);
               return;
          }
     };

     const signOutActions = () => {
          const newUserData = { ...userData };
          newUserData.UserID = 0;
          newUserData.Username = "";
          newUserData.RealName = "";
          newUserData.Admin = 0;

          setUserData(newUserData);
          setIsAdding(false);
          setIsEditing(false);
          setLoggedInCheck(APIStatus.Unauthorized);
          setSearchTerm("");
          setSourceFilter(-1);
          setTypeFilter(-1);

          setWatchList([]);
          setWatchListSortingCheck(APIStatus.Idle);

          setWatchListItems([]);
          setWatchListSources([]);
          setWatchListSourcesLoadingCheck(APIStatus.Idle);

          setWatchListTypes([]);
          setWatchListTypesLoadingCheck(APIStatus.Idle);

          setActiveRoute("Login");

          router.push("/Login");
     }

     const validatePassword = (value: string) => {
          // 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum
          const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

          return strongRegex.test(value);
     };

     const writeLog = useCallback(async (writeLogText: string) => {
          if (demoMode) {
               return;
          }

          try {
               const writeLogResponse = await fetch(`/api/WriteLog?WriteLogText=${encodeURIComponent(writeLogText)}`, { method: 'PUT', credentials: 'include' });

               const writeLogResult = await writeLogResponse.json();

               if (writeLogResult[0] !== "OK") {
                    alert(writeLogResult[1]);
               }
          } catch (e: any) {
               console.log("Failed to write log with the error " + e.message);
               return;
          }
     }, [router]);

     // This method has a dependency on setOptions and writeLog and has to be defined after these functions
     const isLoggedInApi = useCallback(async (noReroute: boolean = false) => {
          if (isError || demoMode) {
               return;
          }

          let params = '';

          try {
               const isLoggedInResponse = await fetch(`/api/IsLoggedIn${params}`, { credentials: 'include' });

               const isLoggedInResult = await isLoggedInResponse.json();

               if (isLoggedInResult[0] === "OK") {
                    pullToRefreshEnabled(true);

                    setUserData({
                         UserID: isLoggedInResult[1].UserID,
                         Username: isLoggedInResult[1].Username,
                         RealName: isLoggedInResult[1].RealName,
                         Admin: isLoggedInResult[1].Admin,
                    });

                    const newRoutes = {
                         WatchList: {
                              Name: "WatchList",
                              DisplayName: "WatchList",
                              Path: "/WatchList",
                              Icon: WatchListIconComponent,
                              RequiresAuth: true,
                              Enabled: true
                         },
                         Items: {
                              Name: "Items",
                              DisplayName: "Items",
                              Path: "/Items",
                              Icon: WatchListItemsIconComponent,
                              RequiresAuth: true,
                              Enabled: true
                         },
                         Stats: {
                              Name: "Stats",
                              DisplayName: "Stats",
                              Path: "/Stats",
                              Icon: StatsIconComponent,
                              RequiresAuth: true,
                              Enabled: true
                         },
                         Login: {
                              Name: "Login",
                              DisplayName: "Login",
                              Path: "/Login",
                              Icon: null,
                              RequiresAuth: false,
                              Enabled: true
                         },
                         BugLogs: {
                              Name: "BugLogs",
                              DisplayName: "Bug Logs",
                              Path: "/BugLogs",
                              Icon: BugReportIconComponent,
                              RequiresAuth: true,
                              Enabled: true
                         },
                         Data: {
                              Name: "Data",
                              DisplayName: "Data",
                              Path: "/Data",
                              Icon: AdminConsoleIconComponent,
                              RequiresAuth: true,
                              Enabled: true
                         },
                         Admin: {
                              Name: "Admin",
                              DisplayName: "Admin",
                              Path: "/Admin",
                              Icon: AdminConsoleIconComponent,
                              RequiresAuth: true,
                              Enabled: isLoggedInResult[1].Admin
                         }
                    };

                    setRoutes(newRoutes);

                    const newVisibleSectionChoices = [
                         ...(isLoggedInResult[1].Admin
                              ? [
                                   { value: "3", label: "Admin" },
                                   { value: "4", label: "BugLogs" },
                                   { value: "5", label: "Data" },
                              ]
                              : []),
                         { value: "1", label: "Items" },
                         { value: "2", label: "Stats" },
                    ];

                    setVisibleSectionChoices(newVisibleSectionChoices);

                    const newVisibleSections = [
                         ...(isLoggedInResult[1].Admin
                              ? [
                                   { value: "3", label: "Admin" },
                                   { value: "4", label: "BugLogs" },
                                   { value: "5", label: "Data" },
                              ]
                              : []),
                         { value: "2", label: "Stats" },
                         { value: "1", label: "Items" },
                    ];

                    setVisibleSections(newVisibleSections);

                    if (typeof isLoggedInResult[1].Options !== "undefined") {
                         setOptions(isLoggedInResult[1].Options);
                    }

                    setLoggedInCheck(APIStatus.Success);

                    if (!noReroute) {
                         setActiveRoute("WatchList");
                         setCurrentWatchListPage(1);

                         router.push("/WatchList");
                    }
               } else {
                    pullToRefreshEnabled(false);

                    if (isLoggedInResult[1] === false) {
                         setLoggedInCheck(APIStatus.Unauthorized);
                         setActiveRoute("Setup");
                         router.push("/Setup");
                         return;
                    } else if (isLoggedInResult[1] !== "") {
                         if (typeof isLoggedInResult[2] !== "undefined" && isLoggedInResult[2] === true) {
                              setErrorMessage(isLoggedInResult[1]);

                              setActiveRoute("404");

                              setIsError(true);

                              return;
                         } else {
                              alert(isLoggedInResult[1]);
                         }
                    }

                    setActiveRoute("Login");

                    setLoggedInCheck(APIStatus.Unauthorized);

                    router.push("/Login");
               }
          } catch (e: any) {
               setErrorMessage("Failed to check if user is logged in with the error " + e.message);
               setIsError(true);
               return;
          }
     }, [isError, router, routes, setOptions]); // , userData

     // Check if user is logged in already
     useEffect(() => {
          if (clientCheck !== APIStatus.Success) {
               return;
          }

          if (!isClient) {
               return;
          }

          if (loggedInCheck === APIStatus.Idle) {
               setLoggedInCheck(APIStatus.Loading);
               return;
          }
     }, [clientCheck, isClient, isError, isLoggedInApi, loggedInCheck, userData]);

     // IsLoggedIn check
     useEffect(() => {
          if (demoMode) {
               setDemoModeNotificationVisible(true);

               const newRoutes = {
                    WatchList: {
                         Name: "WatchList",
                         DisplayName: "WatchList",
                         Path: "/WatchList",
                         Icon: WatchListIconComponent,
                         RequiresAuth: true,
                         Enabled: true
                    },
                    Items: {
                         Name: "Items",
                         DisplayName: "Items",
                         Path: "/Items",
                         Icon: WatchListItemsIconComponent,
                         RequiresAuth: true,
                         Enabled: true
                    },
                    Stats: {
                         Name: "Stats",
                         DisplayName: "Stats",
                         Path: "/Stats",
                         Icon: StatsIconComponent,
                         RequiresAuth: true,
                         Enabled: true
                    },
                    Login: {
                         Name: "Login",
                         DisplayName: "Login",
                         Path: "/Login",
                         Icon: null,
                         RequiresAuth: false,
                         Enabled: true
                    },
                    BugLogs: {
                         Name: "BugLogs",
                         DisplayName: "Bug Logs",
                         Path: "/BugLogs",
                         Icon: BugReportIconComponent,
                         RequiresAuth: true,
                         Enabled: false
                    },
                    Data: {
                         Name: "Data",
                         DisplayName: "Data",
                         Path: "/Data",
                         Icon: AdminConsoleIconComponent,
                         RequiresAuth: true,
                         Enabled: true
                    },
                    Admin: {
                         Name: "Admin",
                         DisplayName: "Admin",
                         Path: "/Admin",
                         Icon: AdminConsoleIconComponent,
                         RequiresAuth: true,
                         Enabled: false
                    }
               };

               setRoutes(newRoutes);

               // Init demo watchlist
               const demoWatchListPayload = require("./demo/index").demoWatchListPayload;
               setWatchList(demoWatchListPayload);
               setFilteredWatchList(demoWatchListPayload.slice(0, pageSize));
               setWatchListSortingCheck(APIStatus.Success);

               // Init demo watchlist items
               const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;
               setWatchListItems(demoWatchListItemsPayload);
               setFilteredWatchListItems(demoWatchListItemsPayload.slice(0, pageSize));
               setWatchListItemsSortingCheck(APIStatus.Success);

               // Init demo watchlist sources
               const demoWatchListSourcesPayload = require("./demo/index").demoWatchListSources;
               setWatchListSources(demoWatchListSourcesPayload);
               setWatchListSourcesLoadingCheck(APIStatus.Success);

               // Init demo watchlist types
               const demoWatchListTypesPayload = require("./demo/index").demoWatchListTypes;
               setWatchListTypes(demoWatchListTypesPayload);
               setWatchListTypesLoadingCheck(APIStatus.Success);

               return;
          }

          if (!isLoggedInCheck()) return;
     }, [demoMode, isLoggedInCheck]);

     // Get WatchList
     useEffect(() => {
          if (demoMode) {
               const demoWatchListPayload = require("./demo/index").demoWatchListPayload;

               const newDemoWatchListPayload = demoWatchListPayload.filter((watchList: IWatchList) => {
                    return (
                         (
                              (searchTerm === null || searchTerm === "")
                              || (searchTerm !== null && searchTerm !== ""
                                   && (watchList.WatchListItemName?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                        || watchList.Notes?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                        || watchList.Notes?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                   )
                              )
                         )
                         && // When metadata filters are passed, StillWatching will prevent any results from showing up most of the time.
                         (
                              (stillWatching !== true) || (stillWatching === true && (watchList.EndDate === "" || watchList.EndDate == null)))
                         &&
                         (((archivedVisible !== true && watchList.Archived !== 1) || (archivedVisible === true && watchList.Archived === 1)))
                         &&
                         (sourceFilter === -1 || (sourceFilter !== -1 && String(sourceFilter) === String(watchList.WatchListSourceID)))
                         &&
                         (typeFilter === -1 || (typeFilter !== -1 && watchList.WatchListTypeID === typeFilter)
                         )
                    )
               }).sort((a: IWatchList, b: IWatchList) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return a.WatchListID > b.WatchListID ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              const aName = a.WatchListItemName;
                              const bName = b.WatchListItemName;

                              return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "StartDate":
                              return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "EndDate":
                              return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
                    }
               });

               const newFilteredWatchList = newDemoWatchListPayload.slice(0, pageSize);

               if (newFilteredWatchList.length < pageSize) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }

               setFilteredWatchList(newFilteredWatchList);

               return;
          }

          if (activeRoute !== "WatchList") {
               return;
          }

          if ((activeRoute === "WatchList" && watchListSortingCheck === APIStatus.Loading)) {
               return;
          }

          if (!isLoggedInCheck()) {
               return;
          }

          getWatchList();
     }, [activeRoute, archivedVisible, currentWatchListPage, metaDataFilters, searchTerm, stillWatching, sourceFilter, typeFilter, watchListSortColumn, watchListSortDirection]);

     // Initiate getting WatchListItems
     useEffect(() => {
          if (demoMode) {
               return;
          }

          if (!isLoggedInCheck()) return;
     }, [demoMode, isLoggedInCheck]);

     // Get WatchListItems
     useEffect(() => {
          if (demoMode) {
               const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;

               const newDemoWatchListItemsPayload = demoWatchListItemsPayload.filter((watchListItem: IWatchListItem) => {
                    return (
                         (
                              ((searchTerm === null || searchTerm === "")
                                   || (searchTerm !== null && searchTerm !== ""
                                        && (watchListItem.WatchListItemName?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                             || watchListItem.ItemNotes?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
                                        )
                                   )
                              )
                              &&
                              (showMissingArtwork !== true || (showMissingArtwork === true && (typeof watchListItem.IMDB_Poster === "undefined" || watchListItem.IMDB_Poster === null || watchListItem.IMDB_Poster === "")))
                              &&
                              ((archivedVisible !== true || (archivedVisible === true && watchListItem.Archived === 1)))
                              &&
                              (typeFilter === -1 || (typeFilter !== -1 && String(watchListItem.WatchListTypeID) === String(typeFilter)))
                         )
                    )
               }).sort((a: IWatchListItem, b: IWatchListItem) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return a.WatchListItemID > b.WatchListItemID ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              const aName = a.WatchListItemName;
                              const bName = b.WatchListItemName;

                              return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
                    }
               }).sort((a: IWatchListItem, b: IWatchListItem) => {
                    switch (watchListSortColumn) {
                         case "ID":
                              return a.WatchListItemID > b.WatchListItemID
                                   ? (watchListSortDirection === "ASC" ? 1 : -1)
                                   : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Name":
                              return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         case "Type":
                              return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                         default:
                              return 0;
                    }
               });

               setFilteredWatchListItems(newDemoWatchListItemsPayload.slice(0, pageSize));
               return;
          }

          if (activeRoute !== "Items" || (activeRoute === "Items" && watchListItemsSortingCheck === APIStatus.Loading || watchListSortColumn === "" || watchListSortDirection === "")) {
               return;
          }

          getWatchListItems();
     }, [activeRoute, archivedVisible, currentItemsPage, metaDataFilters, searchTerm, showMissingArtwork, typeFilter, watchListSortColumn, watchListSortDirection]);

     // Get WatchListSources
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               return;
          }

          if (watchListSourcesLoadingCheck === APIStatus.Idle) {
               setWatchListSourcesLoadingCheck(APIStatus.Loading);

               getWatchListSources();
          }
     }, [demoMode, isLoggedInCheck, watchListSourcesLoadingCheck]);

     // Get WatchListTypes
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               return;
          }

          if (watchListSourcesLoadingCheck === APIStatus.Success && watchListTypesLoadingCheck === APIStatus.Idle) {
               setWatchListTypesLoadingCheck(APIStatus.Loading);

               getWatchListTypes();
          }
     }, [demoMode, isLoggedInCheck, watchListSourcesLoadingCheck, watchListTypesLoadingCheck]);

     /* useEffect that routes the current user */
     useEffect(() => {
          if (routes === null) {
               return;
          }

          if (!isClient) {
               return;
          }

          if (loggedInCheck !== APIStatus.Success) {
               return;
          }

          let newRoute = "";

          pullToRefreshEnabled(true);

          const queryParams = location.search;

          if (currentPath === routes["Login"].Path) {
               newRoute = defaultRoute;
          } else if (currentPath !== "") {
               const findRouteByPath = Object.keys(routes).filter((routeName) => routes[routeName].Path === currentPath);

               if (currentPath === "/WatchList/Dtl" && queryParams !== null && queryParams !== "") {
                    setActiveRoute("WatchList");

                    const id = queryParams.split("=")[1];
                    openDetailClickHandler(parseInt(id, 10), "WatchList");
                    return;
               } else if (currentPath === "/Items/Dtl") {
                    setActiveRoute("Items");

                    const id = queryParams.split("=")[1];
                    openDetailClickHandler(parseInt(id, 10), "Items");
                    return;
               } else if (findRouteByPath.length !== 1) { // Path wasn't found so use default route
                    newRoute = defaultRoute.replace("/", "");

                    setActiveRoute(newRoute as RouteKey);
               } else if (
                    (currentPath === "/WatchList") ||
                    (currentPath !== "/WatchList" && isEnabled(currentPath))
               ) {
                    newRoute = currentPath.replace("/", "");

                    setActiveRoute(newRoute as RouteKey);
               } else if (currentPath === "/BugLogs") {
                    setActiveRoute("BugLogs");
               }
          } else if (activeRoute !== null) {
               const findRouteByName = Object.keys(routes).filter((routeName) => routes[routeName].Name === activeRoute);

               if (findRouteByName.length !== 1) { // Path wasn't found so use default route
                    newRoute = defaultRoute;
               } else if (
                    (activeRoute === "WatchList") ||
                    (isEnabled(activeRoute))
               ) {
                    newRoute = activeRoute.replace("\\", "");

                    setActiveRoute(newRoute as RouteKey);
               }
          } else {
               setActiveRoute(defaultRoute as RouteKey);
          }

          if (newRoute === "WatchList") {
               setCurrentWatchListPage(1);
          } else if (newRoute === "Items") {
               setCurrentItemsPage(1);
          }

          const path = getPath(newRoute);

          router.push(path);
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [defaultRoute, isClient, isError, loggedInCheck]); // Do not add activeRoute, getPath, isEnabled, openDetailClickHandler, routeList, router to dependencies. Causes extra network requests

     /* 404 error routing */
     useEffect(() => {
          if (currentPath != "/404" && activeRoute === "404" && isError) {
               router.push("/404");
          }
     }, [activeRoute, currentPath, isError, router]);

     /* Pull to refresh */
     useEffect(() => {
          if (isAdding || isEditing) {
               pullToRefreshEnabled(false);
          } else {
               pullToRefreshEnabled(true);
          }
     }, [isAdding, isEditing]);

     useEffect(() => {
          /* isClient check */
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);

          setClientCheck(APIStatus.Success);

          const newPageSize = typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 49; // items per page. Mobile has less items

          setPageSize(newPageSize);

          try {
               /* Gets the build date from the JSON file generated by the scripts section in package.json */
               fetch('/build-info.json')
                    .then((response) => response.json())
                    .then((data) => {
                         const language = typeof navigator.languages != undefined && navigator.languages.length > 0 ? navigator.languages[0] : "en-us";
                         const options: Intl.DateTimeFormatOptions = {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                         };

                         const newBuildDate = new Date(data.buildDate).toLocaleDateString(language, options).replace(",", "");

                         setBuildDate(newBuildDate);
                    });
          } catch (e: any) {
               setErrorMessage("Failed to get nuild date with the error " + e.message);
               setIsError(true);
               return;
          }

          if (demoMode) {
               setImdbSearchEnabled(false);
               setRecommendationsEnabled(false);
               setLoggedInCheck(APIStatus.Success);

               const newUserData = { ...userData };
               newUserData.UserID = 0;
               newUserData.Username = "";
               newUserData.RealName = "";

               setUserData(newUserData);
               setActiveRoute("WatchList");
               setCurrentWatchListPage(1);

               const newSortColumn = "Name";
               setWatchListSortColumn(newSortColumn);

               router.push("/WatchList");

               const newVisibleSectionChoices = [
                    { value: "1", label: "Items" },
                    { value: "2", label: "Stats" },
               ];

               setVisibleSectionChoices(newVisibleSectionChoices);

               const newVisibleSections = [
                    { value: "2", label: "Stats" },
                    { value: "1", label: "Items" },
               ];

               setVisibleSections(newVisibleSections);

               setIsLoading(false);

               return;
          }

          /* Checks if IMDB search */
          isIMDBSearchEnabled();

          /* Checks if Recommendations is enabled */
          isRecommendationsEnabled();

          isLoggedInApi(true);

          if ('serviceWorker' in navigator) {
               navigator.serviceWorker
                    .register('/sw.js')
                    .then(reg => writeLog('SW registered'))
                    .catch((err: any) => console.error('SW registration failed', err));
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []); // Do not add isLoggedInApi as a dependency. It causes an ends loop of network requests

     const dataContextValues = { bugLogs, darkMode, defaultRoute, demoMode, isAdmin, lastPage, pageSize, setErrorMessage, setIsError, visibleSections, watchList, watchListSortingCheck, watchListItems, watchListItemsSortingCheck, watchListSources, watchListTypes };
     const errorContextValues = { darkMode, defaultRoute, errorMessage, setActiveRoute };
     const hamburgerMenuContextType = { activeRoute, archivedVisible, autoAdd, buildDate, darkMode, defaultRoute, demoMode, demoModeNotificationVisible, hideTabs, isAdding, isAdmin, isEditing, isEnabled, loggedInCheck, LogOutIconComponent, metaDataFilters, openDetailClickHandler, pullToRefreshEnabled, routes, saveOptions, setActiveRoute, setIsLoading, setMetaDataFilters, setNewPage, setOptions, setShowMissingArtwork, setSourceFilter, setStillWatching, setTypeFilter, setVisibleSections, setWatchListSortColumn, setWatchListSortDirection, showMissingArtwork, signOut, sourceFilter, stillWatching, typeFilter, visibleSections, visibleSectionChoices, watchListItemsSortColumns, watchListSortColumn, watchListSortColumns, watchListSortDirection, watchListSources, watchListTypes }
     const itemsCardContextValues = { BrokenImageIconComponent, darkMode, filteredWatchListItems, getMissingPoster, getWatchList, openDetailClickHandler, setFilteredWatchListItems, watchList, watchListSortingCheck };
     const itemsContextValues = { darkMode, filteredWatchListItems, hideTabs, imdbSearchEnabled, isLoading, searchModalVisible, searchTerm, setActiveRoute, setIsAdding, setIsEditing, setFilteredWatchListItems, setSearchModalVisible, watchListItemsSortingCheck };
     const itemsDtlContextValues = { BrokenImageIconComponent, CancelIconComponent, darkMode, demoMode, EditIconComponent, formatWatchListDates, getMissingPoster, getWatchListItems, isAdding, isEditing, isEnabled, isLoading, pullToRefreshEnabled, SaveIconComponent, setErrorMessage, setIsAdding, setIsEditing, setIsError, watchListTypes, writeLog };
     const loginContextValues = { activeRoute, darkMode, defaultRoute, demoPassword, demoUsername, loggedInCheck, setActiveRoute, setDemoMode, setLoggedInCheck, setOptions, setUserData };
     const pageNavigationBarContextValues = { activeRoute, currentItemsPage, currentWatchListPage, darkMode, isAdding, isLoading, hideTabs, lastPage, setNewPage };
     const recommendationsContextValues = { BrokenImageIconComponent, darkMode, writeLog };
     const searchIMDBContextValues = { AddIconComponent, autoAdd, BrokenImageIconComponent, darkMode, searchCount, SearchIconComponent, searchTerm, setIsAdding, setSearchCount, setSearchModalVisible, setSearchTerm };
     const setupContextValues = { activeRoute, defaultRoute, darkMode, demoUsername, loggedInCheck, validatePassword };
     const sharedLayoutContextValues = { activeRoute, darkMode, demoModeNotificationVisible, imdbSearchEnabled, isError, isLoading, loggedInCheck, searchModalVisible, searchTerm, setDemoModeNotificationVisible, setSearchTerm };
     const tabsContextValues = { activeRoute, darkMode, demoMode, getPath, hideTabs, isAdding, isAdmin, isClient, isEditing, isEnabled, isError, isLoading, loggedInCheck, pullToRefreshEnabled, routes, setActiveRoute, setSearchTerm, visibleSections };
     const watchListCardContextValues = { BrokenImageIconComponent, darkMode, filteredWatchList, formatWatchListDates, getMissingPoster, openDetailClickHandler, setFilteredWatchList, writeLog };
     const watchListContextValues = { darkMode, filteredWatchList, hideTabs, imdbSearchEnabled, isLoading, lastPage, searchModalVisible, searchTerm, setActiveRoute, setIsAdding, setIsEditing, setSearchModalVisible, watchListSortingCheck };
     const watchListDtlContextValues = { BrokenImageIconComponent, CancelIconComponent, darkMode, demoMode, EditIconComponent, getWatchList, imdbSearchEnabled, isAdding, isEditing, isLoading, pullToRefreshEnabled, recommendationsEnabled, SaveIconComponent, setErrorMessage, setIsAdding, setIsEditing, setIsError, setStillWatching, showSearch, stillWatching, watchListSortDirection, watchListSources, writeLog };
     const watchListStatsContextValues = { darkMode, demoMode, errorMessage, ratingMax, setIsError, setErrorMessage };

     const baseProviders = [
          { Provider: DataContext.Provider, value: dataContextValues },
          { Provider: ErrorContext.Provider, value: errorContextValues },
          { Provider: HamburgerMenuContext.Provider, value: hamburgerMenuContextType },
          { Provider: ItemsCardContext.Provider, value: itemsCardContextValues },
          { Provider: ItemsContext.Provider, value: itemsContextValues },
          { Provider: ItemsDtlContext.Provider, value: itemsDtlContextValues },
          { Provider: LoginContext.Provider, value: loginContextValues },
          { Provider: PageNavigationBarContext.Provider, value: pageNavigationBarContextValues },
          { Provider: RecommendationsContext.Provider, value: recommendationsContextValues },
          { Provider: SearchIMDBContext.Provider, value: searchIMDBContextValues },
          { Provider: SetupContext.Provider, value: setupContextValues },
          { Provider: SharedLayoutContext.Provider, value: sharedLayoutContextValues },
          { Provider: TabsContext.Provider, value: tabsContextValues },
          { Provider: WatchListCardContext.Provider, value: watchListCardContextValues },
          { Provider: WatchListContext.Provider, value: watchListContextValues },
          { Provider: WatchListDtlContext.Provider, value: watchListDtlContextValues },
          { Provider: WatchListStatsContext.Provider, value: watchListStatsContextValues },
     ];

     // Admin-only blocks — keep them grouped under a single condition when rendering
     const adminContextValues = { darkMode, defaultRoute, demoMode, isAdding, isAdmin, isEditing };
     const bugLogsContextValues = { bugLogs, CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, EditIconComponent, isAdmin, isAdding, isEditing, SaveIconComponent, setBugLogs, setIsAdding, setIsEditing, setIsError, setErrorMessage };
     const manageWatchListSourcesContextValues = { CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setWatchListSourcesLoadingCheck, watchListSourcesLoadingCheck, watchListSources };
     const manageWatchListTypesContextValues = { CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setWatchListTypesLoadingCheck, watchListTypes, watchListTypesLoadingCheck };
     const manageUserAccountsContextValues = { CancelIconComponent, darkMode, defaultRoute, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setErrorMessage, setIsError, setUsers, users, validatePassword };

     const adminProviders = [
          { Provider: AdminContext.Provider, value: adminContextValues },
          { Provider: BugLogsContext.Provider, value: bugLogsContextValues },
          { Provider: ManageWatchListSourcesContext.Provider, value: manageWatchListSourcesContextValues },
          { Provider: ManageWatchListTypesContext.Provider, value: manageWatchListTypesContextValues },
          { Provider: ManageUserAccountsContext.Provider, value: manageUserAccountsContextValues },
     ];

     return (
          <ComposeProviders providers={[...baseProviders, ...adminProviders]}>
               {children}
          </ComposeProviders>
     )
}

export { AdminContext, BugLogsContext, DataContext, DataProvider, ErrorContext, HamburgerMenuContext, ItemsContext, ItemsCardContext, ItemsDtlContext, LoginContext, ManageUserAccountsContext, ManageWatchListSourcesContext, ManageWatchListTypesContext, PageNavigationBarContext, RecommendationsContext, SearchIMDBContext, SetupContext, SharedLayoutContext, TabsContext, WatchListContext, WatchListCardContext, WatchListDtlContext, WatchListStatsContext };