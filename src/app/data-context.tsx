"use client";
// NOTE: If you run this script in VS Code in Docker, you HAVE to run the web app on port 8080 or websocket will stop working which breaks hot reloading
//
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import IBugLog from "./interfaces/IBugLog";
import IRecommendation from "./interfaces/IRecommendation";
import IRouteList from "./interfaces/IRoute";
import ISearchImdb from "./interfaces/ISearchImdb";
import ISectionChoice from "./interfaces/ISectionChoice";
import IUser from "./interfaces/IUser";
import IUserData from './interfaces/IUserData';
import IUserOption from "./interfaces/IUserOption";
import IWatchList from "./interfaces/IWatchList";
import IWatchListItem from "./interfaces/IWatchListItem";
import IWatchListSortColumn from './interfaces/IWatchListSortColumn';
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

import RemoveIcon from "@mui/icons-material/Remove";
const RemoveIconComponent = <RemoveIcon className="icon" />;

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
const WatchListItemsIconComponent = <WatchListItemsIcon className="icon" />;

export interface DataContextType {
     activeRoute: string;
     activeRouteDisplayName: string;
     AddIconComponent: React.ReactNode;
     archivedVisible: boolean;
     autoAdd: boolean;
     buildDate: string;
     bugLogs: IBugLog[];
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     currentPage: number;
     darkMode: boolean;
     defaultRoute: string;
     DeleteIconComponent: React.ReactNode;
     demoMode: boolean;
     demoPassword: string;
     demoUsername: string;
     EditIconComponent: React.ReactNode;
     errorMessage: string;
     filteredWatchList: IWatchList[];
     filteredWatchListItems: IWatchListItem[];
     getFormattedDate: (value: string | null, separator: string | null) => string;
     generateRandomPassword: () => string;
     getDisplayName: (value: string) => string;
     getPath: (value: string) => string;
     hideTabs: boolean;
     imdbSearchEnabled: boolean;
     isAdding: boolean;
     isAdmin: () => boolean;
     isClient: boolean;
     isEnabled: (value: string) => boolean;
     isEditing: boolean;
     isError: boolean;
     isLoading: boolean;
     lastPage: boolean,
     LogOutIconComponent: React.ReactNode;
     loggedInCheck: string;
     openDetailClickHandler: (value: number, activeRouteOverride?: string) => void;
     ratingMax: number;
     recommendationsEnabled: boolean,
     RemoveIconComponent: React.ReactNode;
     routeList: IRouteList;
     SaveIconComponent: React.ReactNode;
     saveOptions: (newOptions: IUserOption) => void;
     searchCount: number;
     SearchIconComponent: React.ReactNode;
     searchInputVisible: boolean,
     searchModalVisible: boolean;
     searchTerm: string;
     setActiveRoute: (value: string) => void;
     setActiveRouteDisplayName: (value: string) => void;
     setArchivedVisible: (value: boolean) => void;
     setAutoAdd: (value: boolean) => void;
     setBugLogs: React.Dispatch<React.SetStateAction<IBugLog[]>>;
     setCurrentPage: (value: number) => void;
     setDarkMode: (value: boolean) => void;
     setDemoMode: (value: boolean) => void;
     setFilteredWatchList: React.Dispatch<React.SetStateAction<IWatchList[]>>;
     setFilteredWatchListItems: React.Dispatch<React.SetStateAction<IWatchListItem[]>>;
     setHideTabs: (value: boolean) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     setIsLoading: (value: boolean) => void;
     setLoggedInCheck: (value: string) => void;
     setOptions: (value: IUserOption) => void;
     setShowMissingArtwork: (value: boolean) => void;
     setSearchCount: (value: number) => void;
     setSearchInputVisible: (value: boolean) => void;
     setSearchTerm: (value: string) => void;
     setSearchModalVisible: (value: boolean) => void;
     setSettingsVisible: (value: boolean) => void;
     setSourceFilter: (value: number) => void;
     setStillWatching: (value: boolean) => void;
     setTypeFilter: (value: number) => void;
     SettingsIconComponent: React.ReactNode;
     settingsVisible: boolean;
     setUserData: React.Dispatch<React.SetStateAction<IUserData>>;
     setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
     setVisibleSections: (value: []) => void;
     setWatchListItems: React.Dispatch<React.SetStateAction<IWatchListItem[]>>;
     setWatchListItemsLoadingCheck: (value: string) => void;
     setWatchListLoadingCheck: (value: string) => void;
     setWatchListSortingCheck: (value: string) => void;
     setWatchListSortColumn: (value: string) => void;
     setWatchListSortDirection: (value: string) => void;
     setWatchListSources: React.Dispatch<React.SetStateAction<IWatchListSource[]>>;
     setWatchListSourcesLoadingCheck: (value: string) => void;
     setWatchListTypes: React.Dispatch<React.SetStateAction<IWatchListType[]>>;
     setWatchListTypesLoadingCheck: (value: string) => void;
     showMissingArtwork: boolean;
     showSearch: () => void;
     showSettings: () => void;
     signOut: () => void;
     sourceFilter: number;
     stillWatching: boolean;
     pullToRefreshEnabled: (value: boolean) => void;
     typeFilter: number;
     users: IUser[],
     userData: IUserData;
     validatePassword: (value: string) => boolean;
     visibleSectionChoices: ISectionChoice[],
     visibleSections: ISectionChoice[],
     watchList: IWatchList[];
     watchListItems: IWatchListItem[];
     watchListItemsLoadingCheck: string;
     watchListItemsSortColumns: IWatchListSortColumn;
     watchListLoadingCheck: string;
     watchListSortColumn: string;
     watchListSortColumns: IWatchListSortColumn;
     watchListSortDirection: string;
     watchListSortingCheck: string;
     watchListSources: IWatchListSource[];
     watchListSourcesLoadingCheck: string;
     watchListTypes: IWatchListType[];
     watchListTypesLoadingCheck: string;
}

const DataContext = createContext({} as DataContextType);

interface DataProviderProps {
     children?: any;
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
     const [activeRouteDisplayName, setActiveRouteDisplayName] = useState("");
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(true);
     const [buildDate, setBuildDate] = useState('');
     const [bugLogs, setBugLogs] = useState<IBugLog[]>([]);
     const [clientCheck, setClientCheck] = useState(APIStatus.Idle);
     const [currentPage, setCurrentPage] = useState(1);
     const [darkMode, setDarkMode] = useState(true);
     const [demoMode, setDemoMode] = useState(false);
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
     const [watchListLoadingCheck, setWatchListLoadingCheck] = useState(APIStatus.Idle);
     const [filteredWatchList, setFilteredWatchList] = useState<IWatchList[]>([]);
     const [watchListSortingCheck, setWatchListSortingCheck] = useState(APIStatus.Idle);

     const [watchListItems, setWatchListItems] = useState<IWatchListItem[]>([]);
     const [watchListItemsLoadingCheck, setWatchListItemsLoadingCheck] = useState(APIStatus.Idle);
     const [filteredWatchListItems, setFilteredWatchListItems] = useState<IWatchListItem[]>([]);
     const [watchListItemSortingCheck, setWatchListItemsSortingCheck] = useState(APIStatus.Idle);

     const [watchListSources, setWatchListSources] = useState<IWatchListSource[]>([]);
     const [watchListSourcesLoadingCheck, setWatchListSourcesLoadingCheck] = useState(APIStatus.Idle);

     const [watchListTypes, setWatchListTypes] = useState<IWatchListType[]>([]);
     const [watchListTypesLoadingCheck, setWatchListTypesLoadingCheck] = useState(APIStatus.Idle);

     const [watchListSortColumn, setWatchListSortColumn] = useState("Name");
     const [watchListSortDirection, setWatchListSortDirection] = useState("ASC");

     /* static values */
     const currentPath = usePathname();
     const defaultRoute = "WatchList";
     const demoUsername = "demo";
     const demoPassword = "demo";
     const pageSize = 49;

     const routeList = {
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
          Admin: {
               Name: "Admin",
               DisplayName: "Admin",
               Path: "/Admin",
               Icon: AdminConsoleIconComponent,
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
          }
     };

     const router = useRouter();
     const visibleSectionChoices = [{ value: "3", label: 'Admin' }, { value: "4", label: 'BugLogs' }, {value: "1", label: 'Items' }, { value: "2", label: 'Stats' }];
     const [visibleSections, setVisibleSections] = useState([{ value: "2", label: 'Stats' }, {value: "1", label: 'Items' }]);
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

     const generateRandomPassword = () => {
          const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
          const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const digitChars = "0123456789";
          const specialChars = "!@#$%^&*";
          const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

          let randomString = "";

          // Add one character from each character set to satisfy the regex
          randomString += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
          randomString += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
          randomString += digitChars[Math.floor(Math.random() * digitChars.length)];
          randomString += specialChars[Math.floor(Math.random() * specialChars.length)];

          // Fill the rest of the string with random characters
          while (randomString.length < 8) {
               randomString += allChars[Math.floor(Math.random() * allChars.length)];
          }

          return randomString;
     };

     const getDisplayName = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].DisplayName;
          } else {
               return "";
          }
     }, [routeList]);

     // Returns date as mm/dd/yy or dd/mm/yy based on users' locale
     const getFormattedDate = (dateStr: string, separator: string) => {
          const language = typeof navigator.languages != undefined ? navigator.languages[0] : "en-us";

          const dateObj = dateStr !== null && typeof dateStr !== "undefined" ? new Date(dateStr) : new Date();

          const options: Intl.DateTimeFormatOptions = {
               year: '2-digit',
               month: '2-digit',
               day: '2-digit',
          };

          const newFormattedDate = dateObj.toLocaleDateString(language, options);

          if (separator === null) {
               return newFormattedDate;
          } else {
               return newFormattedDate.replaceAll("/", separator);
          }
     };

     const getPath = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].Path;
          } else {
               return "";
          }
     }, [routeList]);

     const isAdmin = () => {
          return userData.Admin;
     }

     const isLoggedInCheck = useCallback(() => {
          if (loggedInCheck == APIStatus.Error || loggedInCheck == APIStatus.Idle || loggedInCheck == APIStatus.Loading || loggedInCheck == APIStatus.Unauthorized) return false;

          if (loggedInCheck === APIStatus.Unauthorized) return false;

          return true;
     }, [loggedInCheck]);

     const isLoggedInApi = (noReroute: boolean = false) => {
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
                              setActiveRouteDisplayName("WatchList");
                              setCurrentPage(1);

                              router.push("/WatchList");
                         }
                    } else {
                         pullToRefreshEnabled(false);

                         if (res.data[1] === false) {
                              setLoggedInCheck(APIStatus.Unauthorized);
                              setActiveRoute("Setup");
                              setActiveRouteDisplayName("Setup");
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
                         setActiveRouteDisplayName("Login");

                         setLoggedInCheck(APIStatus.Unauthorized);

                         router.push("/Login");
                    }
               })
               .catch(() => {
                    setLoggedInCheck(APIStatus.Success);

                    router.push("/Login");
               });
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
     }, [activeRoute, setIsAdding]);

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

     const setOptions = (newOptions: IUserOption) => {
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
     }

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
          setActiveRouteDisplayName("");
          setIsAdding(false);
          setIsEditing(false);
          setLoggedInCheck(APIStatus.Unauthorized);
          setSearchTerm("");
          setSourceFilter(-1);
          setTypeFilter(-1);

          setWatchList([]);
          setWatchListLoadingCheck(APIStatus.Idle);

          setWatchListItems([]);
          setWatchListItemsLoadingCheck(APIStatus.Idle);

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

     // Check if user is logged in already
     useEffect(() => {
          if (clientCheck !== APIStatus.Success) {
               return;
          }

          if (!isClient) {
               return;
          }

          if (loggedInCheck === APIStatus.Loading) {
               setLoggedInCheck(APIStatus.Loading);
          }

          if (loggedInCheck === APIStatus.Idle && !isError) {
               isLoggedInApi();
          }
     }, [clientCheck, isClient, loggedInCheck, userData]);

     // Get WatchList
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListPayload = require("./demo/index").demoWatchListPayload;

               setWatchList(demoWatchListPayload);
               setWatchListLoadingCheck(APIStatus.Success);

               return;
          }

         

          const fetchWatchListData = async () => {
               if (watchListLoadingCheck === APIStatus.Idle) {
                    setWatchListLoadingCheck(APIStatus.Loading);

                    axios.get(`/api/GetWatchList`, { withCredentials: true })
                         .then((res: AxiosResponse<IWatchList>) => {
                              if (res.data[0] !== "OK") {
                                   setErrorMessage("Failed to get WatchList with the error " + res.data[1])
                                   setIsError(true);
                                   return;
                              }

                              setWatchList(res.data[1]);
                              setWatchListLoadingCheck(APIStatus.Success);
                         })
                         .catch((err: Error) => {
                              setErrorMessage("Failed to get WatchList with the error " + err.message);
                              setIsError(true);
                         });
               }
          };

          fetchWatchListData();
     }, [isLoggedInCheck, userData, watchListLoadingCheck, watchListSortColumn, watchListSortDirection]);

     // Get WatchListItems
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;

               setWatchListItems(demoWatchListItemsPayload);
               setWatchListItemsLoadingCheck(APIStatus.Success);

               return;
          }

          if (watchListItemsLoadingCheck === APIStatus.Loading) {
               return;
          }

          if (watchListLoadingCheck === APIStatus.Success && watchListItemsLoadingCheck === APIStatus.Idle) {
               setWatchListItemsLoadingCheck(APIStatus.Loading);

               axios.get(`/api/GetWatchListItems${Object.keys(watchListItemsSortColumns).includes(watchListSortColumn) ? `?SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}` : ``}`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListItem>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Items with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         setWatchListItems(res.data[1]);
                         setWatchListItemsLoadingCheck(APIStatus.Success);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Items with the error " + err.message);

                         setIsError(true);
                    });
          }
     }, [autoAdd, isLoggedInCheck, watchListLoadingCheck, watchListItemsLoadingCheck, watchListItemsSortColumns, watchListSortColumn, watchListSortDirection]);

     // Get WatchListSources
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListSourcesPayload = require("./demo/index").demoWatchListSources;

               setWatchListSources(demoWatchListSourcesPayload);
               setWatchListSourcesLoadingCheck(APIStatus.Success);

               return;
          }

          if (watchListItemsLoadingCheck === APIStatus.Success && watchListSourcesLoadingCheck === APIStatus.Idle) {
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
     }, [isLoggedInCheck, watchListItemsLoadingCheck, watchListSourcesLoadingCheck]);

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
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Types with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheck, watchListSourcesLoadingCheck, watchListTypesLoadingCheck]);

     // WatchList filter and sort useEffect
     useEffect(() => {
          if (watchListLoadingCheck !== APIStatus.Success) {
               return;
          }

          setIsLoading(true);

          const newWatchList = watchList.filter(
               (currentWatchList: IWatchList) =>
                    (
                         (currentWatchList?.Archived === 1 && archivedVisible === true) || (currentWatchList?.Archived === 0 && archivedVisible === false))
                    &&
                    ((stillWatching === false && currentWatchList?.EndDate !== null) || (stillWatching === true && currentWatchList?.EndDate === null && currentWatchList?.Archived === 0))
                    &&
                    (searchTerm === "" || (searchTerm !== "" && currentWatchList?.WatchListItemName?.toLowerCase().includes(searchTerm.toLowerCase())))
                    &&
                    (sourceFilter === -1 || sourceFilter === null || (sourceFilter !== -1 && sourceFilter !== null && currentWatchList?.WatchListSourceID === sourceFilter))
                    &&
                    (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchList?.WatchListTypeID) === String(typeFilter)))
          ).sort((a: IWatchList, b: IWatchList) => {
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

          const sliceStart = (currentPage - 1) * pageSize;
          const sliceEnd = sliceStart + pageSize;

          const newWatchListPage = newWatchList.slice(sliceStart, sliceEnd);

          if (activeRoute === "WatchList") {
               if (newWatchListPage.length < pageSize) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }
          }

          setFilteredWatchList(newWatchListPage);

          setIsLoading(false);
     }, [activeRoute, archivedVisible, currentPage, searchTerm, stillWatching, sourceFilter, typeFilter, watchListLoadingCheck, watchListSortColumn, watchListSortDirection]);

     // WatchListItems filter and sort useEffect
     useEffect(() => {
          if (watchListItemsLoadingCheck !== APIStatus.Success || watchListItemSortingCheck !== APIStatus.Idle) {
               return;
          }

          setWatchListItemsSortingCheck(APIStatus.Loading);

          setIsLoading(true);

          const newWatchListItems = watchListItems.filter(
               (currentWatchListItem: IWatchListItem) =>
                    ((currentWatchListItem?.Archived === 1 && archivedVisible === true) || (currentWatchListItem?.Archived === 0 && archivedVisible === false))
                    &&
                    (searchTerm === "" || (searchTerm !== "" && (String(currentWatchListItem.WatchListItemName).toLowerCase().includes(searchTerm.toLowerCase()) || String(currentWatchListItem.IMDB_URL) == searchTerm || String(currentWatchListItem.IMDB_Poster) == searchTerm))) &&
                    (typeFilter === -1 || (typeFilter !== -1 && String(currentWatchListItem.WatchListTypeID) === String(typeFilter)))
                    && (showMissingArtwork === false || (showMissingArtwork === true && (currentWatchListItem.IMDB_Poster_Error === true || currentWatchListItem.IMDB_Poster === null)))
          ).sort((a: IWatchListItem, b: IWatchListItem) => {
               switch (watchListSortColumn) {
                    case "ID":
                         return a.WatchListItemID > b.WatchListItemID
                              ? (watchListSortDirection === "ASC" ? 1 : -1)
                              : watchListSortDirection === "ASC" ? -1 : 1;
                    case "Name":
                         return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                    //case "Type":
                    //     return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;     
                    default:
                         return 0;
               }
          });

          const sliceStart = (currentPage - 1) * pageSize;
          const sliceEnd = sliceStart + pageSize;

          const newWatchListItemsPage = newWatchListItems.slice(sliceStart, sliceEnd);

          if (activeRoute === "Items") {
               if (newWatchListItemsPage.length < pageSize) {
                    setLastPage(true);
               } else {
                    setLastPage(false);
               }
          }

          setFilteredWatchListItems(newWatchListItemsPage);
          setWatchListItemsSortingCheck(APIStatus.Success);

          setIsLoading(false);
     }, [activeRoute, archivedVisible, currentPage, searchTerm, typeFilter, watchListItemsLoadingCheck, watchListSortColumn, watchListSortDirection]);

     /* useEffect that does isClient check */
     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);

          setClientCheck(APIStatus.Success);
     }, []);

     /* useEffect that routes the current user */
     useEffect(() => {
          if (!isClient) {
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
          //}

          if (newRoute === "WatchList" || newRoute === "Items") {
               setCurrentPage(1);
          }

          setActiveRoute(newRoute);

          const path = getPath(newRoute);

          router.push(path);

          const displayName = getDisplayName(newRoute);

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     }, [defaultRoute, isError, loggedInCheck]); // Do not add activeRoute, getDisplayName, routeList, setActiveRoute, setActiveRouteDisplayName to dependencies. Causes dtl to close when you click on edit

     useEffect(() => {
          if (currentPath != "/404" && activeRoute === "404" && isError) {
               router.push("/404");
          }
     }, [activeRoute]);

     /* UseEffect that checks if IMDB search is enabled */
     useEffect(() => {
          axios.get(`/api/IsIMDBSearchEnabled`)
               .then((res: AxiosResponse<ISearchImdb>) => {
                    if (res.data[0] === "OK") {
                         setImdbSearchEnabled(true);
                    }
               })
               .catch((err: Error) => {
               });
     }, []);

     /* UseEffect that checks if Recommendations is enabled */
     useEffect(() => {
          axios.get(`/api/IsRecommendationsEnabled`)
               .then((res: AxiosResponse<IRecommendation>) => {
                    if (res.data[0] === "OK") {
                         setRecommendationsEnabled(true);
                    }
               })
               .catch((err: Error) => {
               });
     }, []);

     /* UseEffect that gets the build date from the JSON file generated by the scripts section in package.json */
     useEffect(() => {
          // Fetch the build date from the JSON file
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
     }, []);

     /* Visibility change useEffect */
     useEffect(() => {
          const handleVisibilityChange = () => {
               if (!document.hidden && !isError) {
                    isLoggedInApi(true);
               }
          };

          // Add event listener for visibility change
          document.addEventListener('visibilitychange', handleVisibilityChange);

          // Cleanup event listener when the component unmounts
          return () => {
               document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
     }, []);

     useEffect(() => {
          if (isAdding || isEditing) {
               pullToRefreshEnabled(false);
          } else {
               pullToRefreshEnabled(true);
          }
     }, [isAdding, isEditing]);

     const dataContextProps = {
          activeRoute,
          activeRouteDisplayName,
          AddIconComponent,
          APIStatus,
          archivedVisible,
          autoAdd,
          BrokenImageIconComponent,
          bugLogs,
          buildDate,
          CancelIconComponent,
          currentPage,
          darkMode,
          defaultRoute,
          DeleteIconComponent,
          demoMode,
          demoPassword,
          demoUsername,
          EditIconComponent,
          filteredWatchList,
          filteredWatchListItems,
          getFormattedDate,
          generateRandomPassword,
          getDisplayName,
          getPath,
          hideTabs,
          imdbSearchEnabled,
          isAdding,
          isAdmin,
          isClient,
          isEditing,
          isEnabled,
          isError,
          errorMessage,
          isLoading,
          lastPage,
          loggedInCheck,
          LogOutIconComponent,
          openDetailClickHandler,
          ratingMax,
          recommendationsEnabled,
          RemoveIconComponent,
          routeList,
          SaveIconComponent,
          saveOptions,
          searchCount,
          SearchIconComponent,
          searchInputVisible,
          searchModalVisible,
          searchTerm,
          setActiveRoute,
          setActiveRouteDisplayName,
          setArchivedVisible,
          setAutoAdd,
          setBugLogs,
          setCurrentPage,
          setDarkMode,
          setDemoMode,
          setErrorMessage,
          setFilteredWatchList,
          setFilteredWatchListItems,
          setHideTabs,
          setIsAdding,
          setIsEditing,
          setIsError,
          setIsLoading,
          setLoggedInCheck,
          setOptions,
          setSearchCount,
          setSearchTerm,
          setSearchInputVisible,
          setSearchModalVisible,
          setSettingsVisible,
          setShowMissingArtwork,
          setStillWatching,
          setSourceFilter,
          setUsers,
          SettingsIconComponent,
          settingsVisible,
          setTypeFilter,
          setUserData,
          setVisibleSections,
          setWatchListItems,
          setWatchListItemsLoadingCheck,
          setWatchListLoadingCheck,
          setWatchListSortColumn,
          setWatchListSortDirection,
          setWatchListSortingCheck,
          setWatchListSources,
          setWatchListSourcesLoadingCheck,
          setWatchListTypes,
          setWatchListTypesLoadingCheck,
          showMissingArtwork,
          showSearch,
          showSettings,
          signOut,
          sourceFilter,
          stillWatching,
          pullToRefreshEnabled,
          typeFilter,
          users,
          userData: userData,
          validatePassword,
          visibleSectionChoices,
          visibleSections,
          watchList,
          watchListItems,
          watchListItemsLoadingCheck,
          watchListItemsSortColumns,
          watchListLoadingCheck,
          watchListSortColumn,
          watchListSortColumns,
          watchListSortDirection,
          watchListSortingCheck,
          watchListSources,
          watchListSourcesLoadingCheck,
          watchListTypes,
          watchListTypesLoadingCheck
     };

     return (
          <DataContext.Provider value={dataContextProps}>{children}</DataContext.Provider>
     )
}

export { DataContext, DataProvider };
