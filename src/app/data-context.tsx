"use client";

import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import IBugLog from "./interfaces/IBugLog";
import IRecommendation from "./interfaces/IRecommendation";
import ISearchImdb from "./interfaces/ISearchImdb";
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

import SettingsIcon from "@mui/icons-material/Settings";
const SettingsIconComponent = <SettingsIcon className="icon" />;

import StatsIcon from "@mui/icons-material/BarChart";
const StatsIconComponent = <StatsIcon className="icon" />;

import WatchListIcon from "@mui/icons-material/Movie";
const WatchListIconComponent = <WatchListIcon className="icon" />;

import WatchListItemsIcon from "@mui/icons-material/SmartDisplay";
import { DataContextType } from "./interfaces/contexts/DataContextType";
import { ManageUserAccountsContextType } from "./interfaces/contexts/ManageUserAccountsContextType";
import { ManageWatchListSourcesContextType } from "./interfaces/contexts/ManageWatchListSourcesContextType";
import { ManageWatchListTypesContextType } from "./interfaces/contexts/ManageWatchListTypesContextType";
import { AdminContextType } from "./interfaces/contexts/AdminContextType";
import { BugLogsContextType } from "./interfaces/contexts/BugLogsContextType";
import { ErrorContextType } from "./interfaces/contexts/ErrorContextType";
import { ItemsCardContextType } from "./interfaces/contexts/ItemsCardContextType";
import { ItemsContextType } from "./interfaces/contexts/ItemsContextType";
import { ItemsDtlContextType } from "./interfaces/contexts/ItemsDtlContextType";
import { LoginContextType } from "./interfaces/contexts/LoginContextType";
import { NavBarContextType } from "./interfaces/contexts/NavBarContextType";
import { RecommendationsContextType } from "./interfaces/contexts/RecommendationsContextType";
import { SearchIMDBContextType } from "./interfaces/contexts/SearchIMDBContextType";
import { SettingsContextType } from "./interfaces/contexts/SettingsContextType";
import { SetupContextType } from "./interfaces/contexts/SetupContextType";
import { SharedLayoutContextType } from "./interfaces/contexts/SharedLayoutContextType";
import { TabsContextType } from "./interfaces/contexts/TabsContextType";
import { WatchListCardContextType } from "./interfaces/contexts/WatchListCardContextType";
import { WatchListContextType } from "./interfaces/contexts/WatchListContextType";
import { WatchListDtlContextType } from "./interfaces/contexts/WatchListDtlContextType";
import { WatchListStatsContextType } from "./interfaces/contexts/WatchListStatsContextType";
const WatchListItemsIconComponent = <WatchListItemsIcon className="icon" />;

const DataContext = createContext({} as DataContextType);
const ErrorContext = createContext({} as ErrorContextType);
const ManageUserAccountsContext = createContext({} as ManageUserAccountsContextType);
const ManageWatchListSourcesContext = createContext({} as ManageWatchListSourcesContextType);
const ManageWatchListTypesContext = createContext({} as ManageWatchListTypesContextType);
const AdminContext = createContext({} as AdminContextType);
const BugLogsContext = createContext({} as BugLogsContextType);
const NavBarContext = createContext({} as NavBarContextType);
const RecommendationsContext = createContext({} as RecommendationsContextType);
const SearchIMDBContext = createContext({} as SearchIMDBContextType);
const SettingsContext = createContext({} as SettingsContextType);
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
     const [activeRoute, setActiveRoute] = useState("");
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(true);
     const [buildDate, setBuildDate] = useState('');
     const [bugLogs, setBugLogs] = useState<IBugLog[]>([]);
     const [clientCheck, setClientCheck] = useState(APIStatus.Idle);
     const [currentPage, setCurrentPage] = useState(1);
     const [darkMode, setDarkMode] = useState(true);
     const [demoMode, setDemoMode] = useState(true);
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
     const [metaDataFilters, setMetaDataFilters] = useState([{}]);
     const [recommendationsEnabled, setRecommendationsEnabled] = useState(false);
     const [searchCount, setSearchCount] = useState(5);
     const [searchInputVisible, setSearchInputVisible] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
     const [searchModalVisible, setSearchModalVisible] = useState(false);
     const [settingsVisible, setSettingsVisible] = useState(false);
     const [showMissingArtwork, setShowMissingArtwork] = useState(false);
     const [stillWatching, setStillWatching] = useState(true);
     const [sourceFilter, setSourceFilter] = useState(-1);
     const [typeFilter, setTypeFilter] = useState(-1);
     const [users, setUsers] = useState<IUser[]>([]);
     const [userData, setUserData] = useState({ UserID: 0, Username: "", RealName: "", Admin: false }); // cannot use iUserEmpty() here

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

     /* static values */
     const currentPath = usePathname();
     const defaultRoute = "WatchList";
     const demoUsername = "demo";
     const demoPassword = "demo";
     const pageSize = typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 49; //const pageSize = 49;

     const routeList = useMemo(() => {
          return {
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
                    Enabled: true
               }
          }
     }, []);

     const router = useRouter();

     const visibleSectionChoices = [
          { value: "3", label: 'Admin' },
          { value: "4", label: 'BugLogs' },
          { value: "1", label: 'Items' },
          { value: "2", label: 'Stats' },
          ...(String(process.env.NEXT_PUBLIC_DATA_ROUTE_ENABLED) === "true" ? [{ value: "5", label: 'Data' }] : []),
     ];

     const [visibleSections, setVisibleSections] = useState([{ value: "2", label: 'Stats' }, { value: "1", label: 'Items' }, ...(String(process.env.NEXT_PUBLIC_DATA_ROUTE_ENABLED) === "true" ? [{ value: "5", label: 'Data' }] : [])]);

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

     const getMissingPoster = async (watchListItemID: number) => {
          if (demoMode) {
               return;
          }

          return axios.get(`/api/UpdateMissingPosters?IDs=${watchListItemID}`).then((res: AxiosResponse<IWatchListItem>) => {
               if (res.data[0] === "OK") {
                    return res.data[1];
               } else {
                    //alert(`The error ${res.data[1]} occurred while updating the item detail`);
               }
          }).catch((err: Error) => {
               console.log(`No result when getting missing poster for ID ${watchListItemID}`)
               //alert(`The error ${err.message} occurred while updating the item detail`);
          });
     }

     const getPath = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].Path;
          } else {
               return "";
          }
     }, [routeList]);

     const getWatchList = async () => {
          setWatchListSortingCheck(APIStatus.Loading);

          const newSliceStart = (currentPage - 1) * pageSize;
          const newSliceEnd = newSliceStart + pageSize;

          let newMetaDataFilters = Object.assign({}, metaDataFilters);

          // This key is added automatically for some reason so remove it.
          if (typeof newMetaDataFilters["0"] !== "undefined") {
               delete newMetaDataFilters["0"];
          }

          return axios.get(`/api/GetWatchList?StartIndex=${newSliceStart}&EndIndex=${newSliceEnd}&StillWatching=${stillWatching}&SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}&ArchivedVisible=${archivedVisible}${sourceFilter !== null && sourceFilter !== -1 ? `&SourceFilter=${sourceFilter}` : ``}${typeFilter !== null && typeFilter !== -1 ? `&TypeFilter=${typeFilter}` : ``}${(searchTerm !== "" ? `&SearchTerm=${searchTerm}` : ``)}${Object.keys(newMetaDataFilters).length > 0 ? `&MetadataFilters=${JSON.stringify(newMetaDataFilters)}` : ""}`, { withCredentials: true })
               .then((res: AxiosResponse<IWatchList>) => {
                    if (res.data[0] !== "OK") {
                         setErrorMessage("Failed to get WatchList with the error " + res.data[1])
                         setIsError(true);
                         return;
                    }

                    if (activeRoute === "WatchList" && res.data[1].length < pageSize) {
                         setLastPage(true);
                    } else {
                         setLastPage(false);
                    }

                    setFilteredWatchList(res.data[1]);
                    setWatchListSortingCheck(APIStatus.Success);

                    return res.data[1]; // Return in case its needed by the calling method
               })
               .catch((err: Error) => {
                    setErrorMessage("Failed to get WatchList with the error " + err.message);

                    setIsError(true);
               });
     }

     const getWatchListItems = async () => {
          setWatchListItemsSortingCheck(APIStatus.Loading);

          const newSliceStart = (currentPage - 1) * pageSize;
          const newSliceEnd = newSliceStart + pageSize;

          let newMetaDataFilters = Object.assign({}, metaDataFilters);

          // This key is added automatically for some reason so remove it.
          if (typeof newMetaDataFilters["0"] !== "undefined") {
               delete newMetaDataFilters["0"];
          }

          return axios.get(`/api/GetWatchListItems?StartIndex=${newSliceStart}&EndIndex=${newSliceEnd}&SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}&ArchivedVisible=${archivedVisible}&ShowMissingArtwork=${showMissingArtwork}${typeFilter !== null && typeFilter !== -1 ? `&TypeFilter=${typeFilter}` : ``}${(searchTerm !== "" ? `&SearchTerm=${searchTerm}` : ``)}${Object.keys(newMetaDataFilters).length > 0 ? `&MetadataFilters=${JSON.stringify(newMetaDataFilters)}` : ""}`, { withCredentials: true })
               .then((res: AxiosResponse<IWatchListItem>) => {
                    if (res.data[0] !== "OK") {
                         setErrorMessage("Failed to get WatchList Items with the error " + res.data[1]);
                         setIsError(true);
                         return;
                    }

                    if (activeRoute === "Items" && res.data[1].length < pageSize) {
                         setLastPage(true);
                    } else {
                         setLastPage(false);
                    }

                    setFilteredWatchListItems(res.data[1]);

                    setWatchListItemsSortingCheck(APIStatus.Success);

                    return res.data[1]; // Return in case its needed by the calling method
               })
               .catch((err: Error) => {
                    setErrorMessage("Failed to get WatchList Items with the error " + err.message);

                    setIsError(true);
               });
     }

     const isAdmin = () => {
          if (demoMode) {
               return false;
          } else {
               return userData.Admin;
          }
     }

     const isEnabled = (sectionName: string) => {
          if (visibleSections.length === 0) {
               return false;
          }

          const visibleResult = visibleSections?.filter((section) => section.label === sectionName);

          if (visibleResult.length === 1) {
               return true;
          } else {
               return false;
          }
     }

     const isLoggedInCheck = useCallback(() => {
          if (loggedInCheck == APIStatus.Error || loggedInCheck == APIStatus.Idle || loggedInCheck == APIStatus.Loading || loggedInCheck == APIStatus.Unauthorized) return false;

          if (loggedInCheck === APIStatus.Unauthorized) return false;

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
          if (enabled) {
               document.getElementsByTagName("html")[0].classList.remove("no-pull-to-refresh");
          } else {
               document.getElementsByTagName("html")[0].classList.add("no-pull-to-refresh");
          }
     }

     const saveOptions = async (newOptions: IUserOption) => {
          await axios.get(`/api/UpdateOptions?Options=${JSON.stringify(newOptions)}`)
               .catch((err: Error) => {
                    setErrorMessage("Failed to update option with the error " + err.message);
                    setIsError(true);
               });
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

          const newSortDirection = typeof newOptions.WatchListSortDirection !== "undefined" ? newOptions.WatchListSortDirection : "Name";
          setWatchListSortDirection(newSortDirection);

          const newVisibleSections = typeof newOptions.VisibleSections !== "undefined" ? JSON.parse(newOptions.VisibleSections) : [{ name: 'Stats', id: 2 }];
          setVisibleSections(newVisibleSections);
     }, [sourceFilter, typeFilter]);

     const showSearch = () => {
          setSearchModalVisible(true);
     };

     const showSettings = () => {
          pullToRefreshEnabled(false);

          setSettingsVisible(true);
     };

     const signOut = () => {
          if (demoMode) {
               signOutActions();
               return;
          }

          axios.get(`/api/SignOut`)
               .then((res: AxiosResponse<IUser>) => {
                    if (res.data[0] === "OK") {
                         signOutActions();
                    } else {
                         alert(res.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert(err.message);
               });
     };

     const signOutActions = () => {
          const newUserData = Object.assign({}, userData);
          newUserData.UserID = 0;
          newUserData.Username = "";
          newUserData.RealName = "";

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

          setSettingsVisible(false);

          setActiveRoute("Login");

          router.push("/Login");
     }

     const validatePassword = (value: string) => {
          // 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum
          const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

          return strongRegex.test(value);
     };

     const writeLog = useCallback((logMessage: string) => {
          axios.put(`/api/WriteLog?LogMessage=${encodeURIComponent(logMessage)}`)
               .then(async (res: AxiosResponse<IUser>) => {
                    if (res.data[0] !== "OK") {
                         writeLog(res.data[1]);
                    }
               })
               .catch(() => {
                    setLoggedInCheck(APIStatus.Success);

                    router.push("/Login");
               });
     }, [router]);

     // This method has a dependency on setOptions and writeLog and has to be defined after these functions
     const isLoggedInApi = useCallback((noReroute: boolean = false) => {
          if (isError) {
               return;
          }

          let params = '';

          axios.get(`/api/IsLoggedIn${params}`)
               .then(async (res: AxiosResponse<IUser>) => {
                    if (res.data[0] === "OK") {
                         pullToRefreshEnabled(true);

                         const newUserData = Object.assign({}, userData);
                         newUserData.UserID = res.data[1].UserID;
                         newUserData.Username = res.data[1].Username;
                         newUserData.RealName = res.data[1].RealName;
                         newUserData.Admin = res.data[1].Admin;

                         if (newUserData.Admin) {
                              routeList["Admin"].Enabled = true;
                         }

                         if (typeof res.data[1].Options !== "undefined") {
                              setOptions(res.data[1].Options);
                         }

                         setLoggedInCheck(APIStatus.Success);
                         setUserData(newUserData);

                         if (!noReroute) {
                              setActiveRoute("WatchList");
                              setCurrentPage(1);

                              router.push("/WatchList");
                         }
                    } else {
                         pullToRefreshEnabled(false);

                         if (res.data[1] === false) {
                              setLoggedInCheck(APIStatus.Unauthorized);
                              setActiveRoute("Setup");
                              router.push("/Setup");
                              return;
                         } else if (res.data[1] !== "") {
                              if (typeof res.data[2] !== "undefined" && res.data[2] === true) {
                                   setErrorMessage(res.data[1]);

                                   setActiveRoute("404");

                                   setIsError(true);

                                   return;
                              } else {
                                   alert(res.data[1]);
                              }
                         }

                         setActiveRoute("Login");

                         setLoggedInCheck(APIStatus.Unauthorized);

                         router.push("/Login");
                    }
               })
               .catch(() => {
                    setLoggedInCheck(APIStatus.Success);

                    router.push("/Login");
               });
     }, [isError, routeList, router, setOptions, userData]);

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

          if (loggedInCheck === APIStatus.Idle && !isError) {
               isLoggedInApi();
          }
     }, [clientCheck, isClient, isError, isLoggedInApi, loggedInCheck, userData]);

     // Initiate getting WatchList
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListPayload = require("./demo/index").demoWatchListPayload;

               setWatchList(demoWatchListPayload);
               setFilteredWatchList(demoWatchListPayload);
               setWatchListSortingCheck(APIStatus.Success);

               return;
          }
     }, [demoMode, isLoggedInCheck]);

     // Get WatchList
     useEffect(() => {
          if (activeRoute !== "WatchList" || (activeRoute === "WatchList" && watchListSortingCheck === APIStatus.Loading || watchListSortColumn === "" || watchListSortDirection === "")) {
               return;
          }

          getWatchList();
     }, [activeRoute, archivedVisible, currentPage, metaDataFilters, searchTerm, stillWatching, sourceFilter, typeFilter, watchListSortColumn, watchListSortDirection]);

     // Initiate getting WatchListItems
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;

               setWatchListItems(demoWatchListItemsPayload);
               setFilteredWatchListItems(demoWatchListItemsPayload);
               setWatchListItemsSortingCheck(APIStatus.Success);
               return;
          }
     }, [demoMode, isLoggedInCheck]);

     // Get WatchListItems
     useEffect(() => {
          if (activeRoute !== "Items" || (activeRoute === "Items" && watchListItemsSortingCheck === APIStatus.Loading || watchListSortColumn === "" || watchListSortDirection === "")) {
               return;
          }

          getWatchListItems();
     }, [activeRoute, archivedVisible, currentPage, metaDataFilters, searchTerm, showMissingArtwork, typeFilter, watchListSortColumn, watchListSortDirection, watchListItems]);

     // Get WatchListSources
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListSourcesPayload = require("./demo/index").demoWatchListSources;

               setWatchListSources(demoWatchListSourcesPayload);
               setWatchListSourcesLoadingCheck(APIStatus.Success);

               return;
          }

          if (watchListSourcesLoadingCheck === APIStatus.Idle) {
               setWatchListSourcesLoadingCheck(APIStatus.Success);

               axios.get(`/api/GetWatchListSources`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListSource>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Sources with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         const wls = res.data[1];

                         wls.sort((a: IWatchListSource, b: IWatchListSource) => {
                              const aName = a.WatchListSourceName;
                              const bName = b.WatchListSourceName;

                              return String(aName) > String(bName) ? 1 : -1;
                         });

                         setWatchListSources(wls);
                         setWatchListSourcesLoadingCheck(APIStatus.Success);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Sources with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [demoMode, isLoggedInCheck, watchListSourcesLoadingCheck]);

     // Get WatchListTypes
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListTypesPayload = require("./demo/index").demoWatchListTypes;

               setWatchListTypes(demoWatchListTypesPayload);
               setWatchListTypesLoadingCheck(APIStatus.Success);

               return;
          }

          if (watchListSourcesLoadingCheck === APIStatus.Success && watchListTypesLoadingCheck === APIStatus.Idle) {
               setWatchListTypesLoadingCheck(APIStatus.Loading);

               axios.get(`/api/GetWatchListTypes`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListType>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Types with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         setWatchListTypes(res.data[1]);
                         setWatchListTypesLoadingCheck(APIStatus.Success);

                         setIsLoading(false);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Types with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [demoMode, isLoggedInCheck, watchListSourcesLoadingCheck, watchListTypesLoadingCheck]);

     /* useEffect that routes the current user */
     useEffect(() => {
          if (!isClient) {
               return;
          }

          if (activeRoute === "") {
               setActiveRoute(defaultRoute)
               return;
          }

          if (loggedInCheck !== APIStatus.Success) {
               return;
          }

          let newRoute = "";

          pullToRefreshEnabled(true);

          const currentPath = location.pathname !== "" ? location.pathname.replace("/", "") : "";
          const queryParams = location.search;

          if (currentPath === routeList["Login"].Path.replace("/", "")) {
               newRoute = defaultRoute;
          } else if (currentPath !== "") {
               const findRouteByPath = Object.keys(routeList).filter((routeName) => routeList[routeName].Path === "/" + currentPath);

               if (currentPath === "WatchList/Dtl" && queryParams !== null && queryParams !== "") {
                    setActiveRoute("WatchList");

                    const id = queryParams.split("=")[1];
                    openDetailClickHandler(parseInt(id, 10), "WatchList");
                    return;
               } else if (currentPath === "Items/Dtl") {
                    setActiveRoute("Items");

                    const id = queryParams.split("=")[1];
                    openDetailClickHandler(parseInt(id, 10), "Items");
                    return;
               } else if (findRouteByPath.length !== 1) { // Path wasn't found so use default route
                    newRoute = defaultRoute;
               } else if (
                    (currentPath === "WatchList") ||
                    (currentPath !== "WatchList" && isEnabled(currentPath))
               ) {
                    newRoute = currentPath.replace("/", "").replace("\\", "");
               } else if (currentPath === "/BugLogs") {
                    newRoute = "BugLogs";
               }
          } else if (activeRoute !== "") {
               const findRouteByName = Object.keys(routeList).filter((routeName) => routeList[routeName].Name === activeRoute);

               if (findRouteByName.length !== 1) { // Path wasn't found so use default route
                    newRoute = defaultRoute;
               } else if (
                    (activeRoute === "WatchList") ||
                    (activeRoute !== "WatchList" && isEnabled(activeRoute))
               ) {
                    newRoute = activeRoute.replace("/", "").replace("\\", "");
               }
          } else {
               newRoute = defaultRoute;
          }

          if (newRoute === "WatchList" || newRoute === "Items") {
               setCurrentPage(1);
          }

          setActiveRoute(newRoute);

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

          /* Gets the build date from the JSON file generated by the scripts section in package.json */
          fetch('/build-info.json')
               .then((response) => response.json())
               .then((data) => {
                    const language = typeof navigator.languages != undefined ? navigator.languages[0] : "en-us";
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

          if (demoMode) {
               setImdbSearchEnabled(false);
               setRecommendationsEnabled(false);
               setLoggedInCheck(APIStatus.Success);

               const newUserData = Object.assign({}, userData);
               newUserData.UserID = 0;
               newUserData.Username = "";
               newUserData.RealName = "";

               setUserData(newUserData);
               setActiveRoute("WatchList");
               setCurrentPage(1);

               router.push("/WatchList");

               setIsLoading(false);

               return;
          }

          /* Checks if IMDB search */
          axios.get(`/api/IsIMDBSearchEnabled`)
               .then((res: AxiosResponse<ISearchImdb>) => {
                    if (res.data[0] === "OK") {
                         setImdbSearchEnabled(true);
                    }
               })
               .catch((err: Error) => {
               });

          /* Checks if Recommendations is enabled */
          axios.get(`/api/IsRecommendationsEnabled`)
               .then((res: AxiosResponse<IRecommendation>) => {
                    if (res.data[0] === "OK") {
                         setRecommendationsEnabled(true);
                    }
               })
               .catch((err: Error) => {
               });

          isLoggedInApi(true);
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []); // Do not add isLoggedInApi as a dependency. It causes an ends loop of network requests

     return (
          <LoginContext.Provider value={{ activeRoute, darkMode, defaultRoute, demoPassword, demoUsername, loggedInCheck, setActiveRoute, setDemoMode, setLoggedInCheck, setOptions, setUserData }}>
               <DataContext.Provider value={{ bugLogs, darkMode, defaultRoute, isAdmin, setIsError, setErrorMessage, visibleSections, watchList, watchListSortingCheck, watchListItems, watchListItemsSortingCheck, watchListSources, watchListTypes, }}>
                    <SharedLayoutContext.Provider value={{ AddIconComponent, SearchIconComponent, SettingsIconComponent, activeRoute, darkMode, demoMode, hideTabs, imdbSearchEnabled, isAdmin, isEnabled, isError, isLoading, loggedInCheck, metaDataFilters, openDetailClickHandler, routeList, saveOptions, searchInputVisible, searchModalVisible, setActiveRoute, setCurrentPage, setIsLoading, setMetaDataFilters, setSearchInputVisible, setSearchModalVisible, setSearchTerm, setSourceFilter, setStillWatching, setTypeFilter, setWatchListSortColumn, setWatchListSortDirection, settingsVisible, showSettings, sourceFilter, stillWatching, typeFilter, watchListItemsSortColumns, watchListSortColumn, watchListSortColumns, watchListSortDirection, watchListSources, watchListSourcesLoadingCheck, watchListTypes, watchListTypesLoadingCheck }}>
                         <NavBarContext.Provider value={{ activeRoute, currentPage, darkMode, isAdding, isLoading, hideTabs, lastPage, setCurrentPage, watchListSortDirection }}>
                              <TabsContext.Provider value={{ activeRoute, darkMode, demoMode, getPath, hideTabs, isAdding, isAdmin, isClient, isEditing, isEnabled, isError, isLoading, loggedInCheck, pullToRefreshEnabled, routeList, setActiveRoute, setCurrentPage, setSearchInputVisible, setSearchTerm, visibleSections }}>
                                   <WatchListContext.Provider value={{ darkMode, filteredWatchList, hideTabs, isLoading, setActiveRoute, setIsAdding, setIsEditing, watchListSortingCheck }}>
                                        <WatchListDtlContext.Provider value={{ BrokenImageIconComponent, CancelIconComponent, EditIconComponent, getWatchList, SaveIconComponent, darkMode, demoMode, imdbSearchEnabled, isAdding, isEditing, isLoading, pullToRefreshEnabled, recommendationsEnabled, setErrorMessage, setIsAdding, setIsEditing, setIsError, setStillWatching, showSearch, stillWatching, watchListSortDirection, watchListSources }}>
                                             <WatchListCardContext.Provider value={{ BrokenImageIconComponent, darkMode, filteredWatchList, getMissingPoster, openDetailClickHandler, setFilteredWatchList }}>
                                                  <WatchListStatsContext.Provider value={{ darkMode, demoMode, ratingMax, setIsError, setErrorMessage, watchListItems }}>
                                                       <ItemsContext.Provider value={{ darkMode, filteredWatchListItems, hideTabs, isLoading, searchModalVisible, setActiveRoute, setIsAdding, setIsEditing, watchListItemsSortingCheck }}>
                                                            <ItemsDtlContext.Provider value={{ BrokenImageIconComponent, CancelIconComponent, EditIconComponent, SaveIconComponent, darkMode, demoMode, getMissingPoster, getWatchListItems, isAdding, isEditing, isEnabled, isLoading, pullToRefreshEnabled, setErrorMessage, setIsAdding, setIsEditing, setIsError, watchListTypes }}>
                                                                 <ItemsCardContext.Provider value={{ BrokenImageIconComponent, darkMode, filteredWatchListItems, getMissingPoster, openDetailClickHandler, setFilteredWatchListItems }}>
                                                                      <SearchIMDBContext.Provider value={{ AddIconComponent, autoAdd, BrokenImageIconComponent, darkMode, searchCount, SearchIconComponent, setIsAdding, setSearchCount, setSearchModalVisible }}>
                                                                           <RecommendationsContext.Provider value={{ BrokenImageIconComponent, darkMode, writeLog }}>
                                                                                <SettingsContext.Provider value={{ activeRoute, archivedVisible, autoAdd, buildDate, darkMode, defaultRoute, demoMode, hideTabs, loggedInCheck, LogOutIconComponent, pullToRefreshEnabled, saveOptions, setActiveRoute, setCurrentPage, setOptions, setSettingsVisible, setShowMissingArtwork, setStillWatching, setVisibleSections, showMissingArtwork, signOut, visibleSectionChoices, visibleSections, watchListSortColumn }}>
                                                                                     <SetupContext.Provider value={{ activeRoute, defaultRoute, darkMode, demoUsername, loggedInCheck, validatePassword }}>
                                                                                          <RecommendationsContext.Provider value={{ BrokenImageIconComponent, darkMode, writeLog }}>
                                                                                               <SearchIMDBContext value={{ AddIconComponent, autoAdd, BrokenImageIconComponent, darkMode, searchCount, SearchIconComponent, setIsAdding, setSearchCount, setSearchModalVisible }}>
                                                                                                    <BugLogsContext.Provider value={{ bugLogs, CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setBugLogs, setIsError, setErrorMessage, setIsAdding, setIsEditing }}>
                                                                                                         <ErrorContext.Provider value={{ darkMode, defaultRoute, errorMessage, setActiveRoute }}>
                                                                                                              {userData.Admin ?
                                                                                                                   <ManageUserAccountsContext.Provider value={{ CancelIconComponent, darkMode, defaultRoute, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setIsError, setErrorMessage, setUsers, users, validatePassword }}>
                                                                                                                        <ManageWatchListSourcesContext.Provider value={{ CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setWatchListSourcesLoadingCheck, watchListSourcesLoadingCheck, watchListSources }}>
                                                                                                                             <ManageWatchListTypesContext.Provider value={{ CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, demoMode, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setIsAdding, setIsEditing, setWatchListTypesLoadingCheck, watchListTypes, watchListTypesLoadingCheck }}>
                                                                                                                                  <AdminContext.Provider value={{ darkMode, defaultRoute, demoMode, isAdding, isAdmin, isEditing }}>
                                                                                                                                       <BugLogsContext.Provider value={{ bugLogs, CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setBugLogs, setIsError, setErrorMessage, setIsAdding, setIsEditing }}>
                                                                                                                                            {children}
                                                                                                                                       </BugLogsContext.Provider>
                                                                                                                                  </AdminContext.Provider>
                                                                                                                             </ManageWatchListTypesContext.Provider>
                                                                                                                        </ManageWatchListSourcesContext.Provider>
                                                                                                                   </ManageUserAccountsContext.Provider>
                                                                                                                   :
                                                                                                                   <>{children}</>}
                                                                                                         </ErrorContext.Provider>
                                                                                                    </BugLogsContext.Provider>
                                                                                               </SearchIMDBContext>
                                                                                          </RecommendationsContext.Provider>
                                                                                     </SetupContext.Provider>
                                                                                </SettingsContext.Provider>
                                                                           </RecommendationsContext.Provider>
                                                                      </SearchIMDBContext.Provider>
                                                                 </ItemsCardContext.Provider>
                                                            </ItemsDtlContext.Provider>
                                                       </ItemsContext.Provider>
                                                  </WatchListStatsContext.Provider>
                                             </WatchListCardContext.Provider>
                                        </WatchListDtlContext.Provider>
                                   </WatchListContext.Provider>
                              </TabsContext.Provider>
                         </NavBarContext.Provider>
                    </SharedLayoutContext.Provider>
               </DataContext.Provider>
          </LoginContext.Provider>
     )
}

export { AdminContext, BugLogsContext, DataContext, DataProvider, ErrorContext, ItemsContext, ItemsCardContext, ItemsDtlContext, LoginContext, ManageUserAccountsContext, ManageWatchListSourcesContext, ManageWatchListTypesContext, NavBarContext, RecommendationsContext, SearchIMDBContext, SettingsContext, SetupContext, SharedLayoutContext, TabsContext, WatchListContext, WatchListCardContext, WatchListDtlContext, WatchListStatsContext };

/*const cacheIMDBPosterImage = (watchListItemID: number) => {
     const newWatchListItems: IWatchListItem[] = Object.assign([], watchListItems);

     const newWatchListItemsResult: IWatchListItem[] = newWatchListItems?.filter((currentWatchListItem: IWatchListItem) => {
          return String(currentWatchListItem.WatchListItemID) === String(watchListItemID);
     });

     if (newWatchListItemsResult.length === 0) {
          // this shouldn't ever happen!
          return;
     }

     const newWatchListItem = newWatchListItemsResult[0];

     if (typeof newWatchListItem.IMDB_Poster !== "undefined" && newWatchListItem.IMDB_Poster !== null && newWatchListItem.IMDB_Poster !== "" && (typeof newWatchListItem.IMDB_Poster_Image === "undefined" || newWatchListItem.IMDB_Poster_Image === null || newWatchListItem.IMDB_Poster_Image === "") && (typeof newWatchListItem.IMDB_Poster !== "undefined" && newWatchListItem.IMDB_Poster !== null && newWatchListItem.IMDB_Poster !== "")) {
          fetch(newWatchListItem.IMDB_Poster)
               .then(response => response.blob())
               .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
               }))
               .then((base64data: string) => {
                    const queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemID}`;

                    axios.put(queryURL, { IMDB_Poster_Image: encodeURIComponent(base64data) }, {
                         headers: {
                              'Content-Type': 'application/json',
                         }
                    }).then((res: AxiosResponse<IWatchListItem>) => {
                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while updating the item detail`);
                         }
                    }).catch((err: Error) => {
                         alert(`The error ${err.message} occurred while updating the item detail`);
                    });
               })
     }
}*/