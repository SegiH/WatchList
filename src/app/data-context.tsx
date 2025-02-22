"use client"
// NOTE: If you run this script in VS Code in Docker, you HAVE to run the web app on port 8080 or websocket will stop working which breaks hot reloading
//
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
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
     darkMode: boolean;
     defaultRoute: string;
     DeleteIconComponent: React.ReactNode;
     demoMode: boolean;
     demoPassword: string;
     demoUsername: string;
     EditIconComponent: React.ReactNode;
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
     errorMessage: string;
     isLoggedIn: boolean;
     isLoggedInCheckComplete: boolean;
     LogOutIconComponent: React.ReactNode;
     openDetailClickHandler: (value: number) => void;
     ratingMax: number;
     recommendationsEnabled: boolean,
     RemoveIconComponent: React.ReactNode;
     routeList: IRouteList;
     SaveIconComponent: React.ReactNode;
     searchCount: number;
     SearchIconComponent: React.ReactNode;
     searchTerm: string;
     searchVisible: boolean;
     setActiveRoute: (value: string) => void;
     setActiveRouteDisplayName: (value: string) => void;
     setArchivedVisible: (value: boolean) => void;
     setAutoAdd: (value: boolean) => void;
     setBugLogs: React.Dispatch<React.SetStateAction<IBugLog[]>>;
     setDarkMode: (value: boolean) => void;
     setDemoMode: (value: boolean) => void;
     setHideTabs: (value: boolean) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     setIsLoggedIn: (value: boolean) => void;
     setIsLoggedInCheckComplete: (value: boolean) => void;
     setOptions: (value: IUserOption, updateDB: boolean) => void;
     setShowMissingArtwork: (value: boolean) => void;
     setSearchCount: (value: number) => void;
     setSearchTerm: (value: string) => void;
     setSearchVisible: (value: boolean) => void;
     setSettingsVisible: (value: boolean) => void;
     setSourceFilter: (value: number) => void;
     setStillWatching: (value: boolean) => void;
     setTypeFilter: (value: number) => void;
     SettingsIconComponent: React.ReactNode;
     settingsVisible: boolean;
     setUserData: React.Dispatch<React.SetStateAction<IUserData>>;
     setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
     setVisibleSections: (value: []) => void;
     setWatchList: React.Dispatch<React.SetStateAction<IWatchList[]>>;
     setWatchListItems: React.Dispatch<React.SetStateAction<IWatchListItem[]>>;
     setWatchListItemsLoadingStarted: (value: boolean) => void;
     setWatchListItemsLoadingComplete: (value: boolean) => void;
     setWatchListItemsSortingComplete: (value: boolean) => void;
     setWatchListLoadingComplete: (value: boolean) => void;
     setWatchListLoadingStarted: (value: boolean) => void;
     setWatchListSortColumn: (value: string) => void;
     setWatchListSortDirection: (value: string) => void;
     setWatchListSortingComplete: (value: boolean) => void;
     setWatchListSources: React.Dispatch<React.SetStateAction<IWatchListSource[]>>;
     setWatchListSourcesLoadingStarted: (value: boolean) => void;
     setWatchListSourcesLoadingComplete: (value: boolean) => void;
     setWatchListTypes: React.Dispatch<React.SetStateAction<IWatchListType[]>>;
     setWatchListTypesLoadingStarted: (value: boolean) => void;
     setWatchListTypesLoadingComplete: (value: boolean) => void;
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
     visibleSections: { name: string; id: number; }[],
     watchList: IWatchList[];
     watchListItems: IWatchListItem[];
     watchListItemsLoadingStarted: boolean;
     watchListItemsLoadingComplete: boolean;
     watchListItemsSortColumns: IWatchListSortColumn;
     watchListItemsSortingComplete: boolean;
     watchListLoadingComplete: boolean;
     watchListSortColumn: string;
     watchListSortColumns: IWatchListSortColumn;
     watchListSortDirection: string;
     watchListSortingComplete: boolean;
     watchListSources: IWatchListSource[];
     watchListTypes: IWatchListType[];
     watchListSourcesLoadingComplete: boolean;
     watchListTypesLoadingComplete: boolean;
}

const DataContext = createContext({} as DataContextType);

const DataProvider = ({ children }) => {
     const [activeRoute, setActiveRoute] = useState("");
     const [activeRouteDisplayName, setActiveRouteDisplayName] = useState("");
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(true);
     const [buildDate, setBuildDate] = useState('');
     const [bugLogs, setBugLogs] = useState<IBugLog[]>([]);
     const [darkMode, setDarkMode] = useState(true);
     const [demoMode, setDemoMode] = useState(false);
     const [hideTabs, setHideTabs] = useState(false);
     const [imdbSearchEnabled, setImdbSearchEnabled] = useState(false);
     const [isAdding, setIsAdding] = useState(false);
     const [isClient, setIsClient] = useState(false);
     const [isClientCheckComplete, setIsClientCheckComplete] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const [isError, setIsError] = useState(false);
     const [errorMessage, setErrorMessage] = useState("");
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [isLoggedInCheckComplete, setIsLoggedInCheckComplete] = useState(false);
     const [isLoggedInCheckStarted, setIsLoggedInCheckStarted] = useState(false);
     const [recommendationsEnabled, setRecommendationsEnabled] = useState(false);
     const [searchCount, setSearchCount] = useState(5);
     const [searchTerm, setSearchTerm] = useState("");
     const [searchVisible, setSearchVisible] = useState(false);
     const [settingsVisible, setSettingsVisible] = useState(false);
     const [showMissingArtwork, setShowMissingArtwork] = useState(false);
     const [stillWatching, setStillWatching] = useState(true);
     const [sourceFilter, setSourceFilter] = useState(-1);
     const [typeFilter, setTypeFilter] = useState(-1);
     const [users, setUsers] = useState<IUser[]>([]);
     const [userData, setUserData] = useState({ UserID: 0, Username: "", RealName: "", Admin: 0 }); // cannot use iUserEmpty() here
     const [watchList, setWatchList] = useState<IWatchList[]>([]);
     const [watchListLoadingStarted, setWatchListLoadingStarted] = useState(false);
     const [watchListLoadingComplete, setWatchListLoadingComplete] = useState(false);
     const [watchListSortingComplete, setWatchListSortingComplete] = useState(false);

     const [watchListItems, setWatchListItems] = useState<IWatchListItem[]>([]);
     const [watchListItemsLoadingStarted, setWatchListItemsLoadingStarted] = useState(false);
     const [watchListItemsLoadingComplete, setWatchListItemsLoadingComplete] = useState(false);
     const [watchListItemsSortingComplete, setWatchListItemsSortingComplete] = useState(false);

     const [watchListSources, setWatchListSources] = useState<IWatchListSource[]>([]);
     const [watchListSourcesLoadingStarted, setWatchListSourcesLoadingStarted] = useState(false);
     const [watchListSourcesLoadingComplete, setWatchListSourcesLoadingComplete] = useState(false);

     const [watchListTypes, setWatchListTypes] = useState<IWatchListType[]>([]);
     const [watchListTypesLoadingStarted, setWatchListTypesLoadingStarted] = useState(false);
     const [watchListTypesLoadingComplete, setWatchListTypesLoadingComplete] = useState(false);

     const [watchListSortColumn, setWatchListSortColumn] = useState("Name");
     const [watchListSortDirection, setWatchListSortDirection] = useState("ASC");

     const [visibleSections, setVisibleSections] = useState([{ name: 'Stats', id: 2 }, { name: 'Items', id: 1 }]);

     const defaultRoute = "WatchList";
     const demoUsername = "demo";
     const demoPassword = "demo";

     const visibleSectionChoices = [{ name: 'Items', id: 1 }, { name: 'Stats', id: 2 }, { name: 'Admin', id: 3 }];

     if (String(process.env.NEXT_PUBLIC_ENABLE_BUGLOGS) === "true") {
          visibleSectionChoices.push({ name: 'BugLogs', id: 4 });
     }

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
               Name: "Name"
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

     const isAdmin = () => {
          return userData.Admin === 1 ? true : false;
     }

     const isLoggedInCheck = useCallback(() => {
          if (isLoggedInCheckComplete == false) return false;

          if (isLoggedInCheckComplete && !isLoggedIn) return false;

          return true;
     }, [isLoggedIn, isLoggedInCheckComplete]);

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
                              await setOptions(res.data[1].Options, false);
                         }

                         setUserData(newUserData);

                         setIsLoggedIn(true);

                         if (!noReroute) {
                              setActiveRoute("WatchList");
                              setActiveRouteDisplayName("WatchList");

                              router.push("/WatchList");
                         }
                    } else {
                         pullToRefreshEnabled(false);

                         if (res.data[1] === false) {
                              setActiveRoute("Setup");
                              setActiveRouteDisplayName("Setup");
                              router.push("/Setup");
                              return;
                         } else if (res.data[1] !== "") {
                              if (typeof res.data[2] !== "undefined" && res.data[2] === true) {
                                   setErrorMessage(res.data[1]);

                                   setIsError(true);

                                   return;
                              } else {
                                   alert(res.data[1]);
                              }
                         }

                         setIsLoggedIn(false);

                         setActiveRoute("Login");
                         setActiveRouteDisplayName("Login");

                         router.push("/Login");
                    }

                    setIsLoggedInCheckComplete(true);
               })
               .catch(() => {
                    setIsLoggedInCheckComplete(true);

                    router.push("/Login");
               });
     }

     const isEnabled = (sectionName: string) => {
          if (visibleSections.length === 0) {
               return false;
          }

          const visibleResult = visibleSections?.filter((section) => section["name"] === sectionName);

          if (visibleResult.length === 1) {
               return true;
          } else {
               return false;
          }
     }

     const openDetailClickHandler = useCallback((Id: number, activeRouteOverride: string = "") => {
          // Disable pull to refresh
          pullToRefreshEnabled(false);

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

     const setOptions = async (newOptions: IUserOption, updateDB: boolean) => {
          const newArchivedVisible = typeof newOptions.ArchivedVisible !== "undefined" && newOptions.ArchivedVisible === 1 ? true : false;
          setArchivedVisible(newArchivedVisible);

          const newAutoAdd = typeof newOptions.AutoAdd !== "undefined" && newOptions.AutoAdd === 1 ? true : false;
          setAutoAdd(newAutoAdd);

          const newDarkMode = typeof newOptions.DarkMode !== "undefined" && newOptions.DarkMode === 1 ? true : false;
          setDarkMode(newDarkMode);

          const newHideTabs = typeof newOptions.HideTabs !== "undefined" && newOptions.HideTabs === 1 ? true : false;
          setHideTabs(newHideTabs);

          const newSearchCount = typeof newOptions.SearchCount !== "undefined" && !isNaN(newOptions.SearchCount) ? newOptions.SearchCount : 5;
          setSearchCount(newSearchCount);

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

          if (updateDB) {
               axios.get(`/api/UpdateOptions?Options=${JSON.stringify(newOptions)}`)
                    .catch((err: Error) => {
                         setErrorMessage("Failed to update option with the error " + err.message);
                         setIsError(true);
                    });
          }
     }

     const showSearch = () => {
          setSearchVisible(true);
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

          setIsLoggedIn(false);

          setActiveRouteDisplayName("");
          setIsAdding(false);
          setIsEditing(false);
          setIsLoggedIn(false);
          setIsLoggedInCheckComplete(false);
          setSearchTerm("");
          setSourceFilter(-1);
          setTypeFilter(-1);

          setWatchList([]);
          setWatchListLoadingStarted(false);
          setWatchListLoadingComplete(false);

          setWatchListItems([]);
          setWatchListItemsLoadingStarted(false);
          setWatchListLoadingComplete(false);

          setWatchListSources([]);
          setWatchListSourcesLoadingStarted(false);
          setWatchListSourcesLoadingComplete(false);

          setWatchListTypes([]);
          setWatchListTypesLoadingStarted(false);
          setWatchListTypesLoadingComplete(false);

          setSettingsVisible(false);

          setActiveRoute("Login");

          router.push("/Login");
     }

     const pullToRefreshEnabled = (enabled: boolean) => {
          if (enabled) {
               document.getElementsByTagName("html")[0].classList.remove("no-pull-to-refresh");
          } else {
               document.getElementsByTagName("html")[0].classList.add("no-pull-to-refresh");
          }
     }

     const validatePassword = (value: string) => {
          // 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum
          const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

          return strongRegex.test(value);
     };

     // Check if user is logged in already
     useEffect(() => {
          if (!isClientCheckComplete) {
               return;
          }

          if (!isClient) {
               return;
          }

          setIsLoggedInCheckStarted(true);

          if (!isLoggedIn && !isLoggedInCheckStarted) {
               if (isLoggedInCheckStarted) {
                    return;
               }

               if (!isError) {
                    isLoggedInApi();
               }
          } else if (isLoggedIn) {
               setIsLoggedInCheckComplete(true);
          } else {
               setIsLoggedInCheckComplete(true);
          }
     }, [isClient, isClientCheckComplete, isLoggedIn, isLoggedInCheckStarted, userData]);

     // Get WatchList
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListPayload = require("./demo/index").demoWatchListPayload;

               setWatchList(demoWatchListPayload);
               setWatchListLoadingStarted(true);
               setWatchListLoadingComplete(true);

               return;
          }

          if (!watchListLoadingStarted && !watchListLoadingComplete) {
               setWatchListLoadingStarted(true);

               axios.get(`/api/GetWatchList`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchList>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList with the error " + res.data[1])
                              setIsError(true);
                              return;
                         }

                         setWatchList(res.data[1]);
                         setWatchListLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheck, isLoggedIn, userData, watchListLoadingStarted, watchListLoadingComplete, watchListSortColumn, watchListSortDirection]);

     // Get WatchListItems
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;

               setWatchListItems(demoWatchListItemsPayload);
               setWatchListItemsLoadingStarted(true);
               setWatchListItemsLoadingComplete(true);

               return;
          }

          if (watchListLoadingComplete && !watchListItemsLoadingStarted && !watchListItemsLoadingComplete) {
               setWatchListItemsLoadingStarted(true);

               axios.get(`/api/GetWatchListItems${Object.keys(watchListItemsSortColumns).includes(watchListSortColumn) ? `?SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}` : ``}`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListItem>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Items with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         setWatchListItems(res.data[1]);
                         setWatchListItemsLoadingComplete(true);
                         setWatchListItemsSortingComplete(false);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Items with the error " + err.message);

                         setIsError(true);
                    });
          }
     }, [autoAdd, isLoggedInCheck, isLoggedInCheckComplete, isLoggedIn, watchListLoadingComplete, watchListItemsLoadingStarted, watchListItemsLoadingComplete, watchListItemsSortColumns, watchListSortColumn, watchListSortDirection]);

     // Get WatchListSources
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListSourcesPayload = require("./demo/index").demoWatchListSources;

               setWatchListSources(demoWatchListSourcesPayload);
               setWatchListSourcesLoadingStarted(true);
               setWatchListSourcesLoadingComplete(true);

               return;
          }

          if (watchListItemsLoadingComplete && !watchListSourcesLoadingStarted && !watchListSourcesLoadingComplete) {
               setWatchListSourcesLoadingStarted(true);

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
                         setWatchListSourcesLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Sources with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheck, isLoggedInCheckComplete, isLoggedIn, watchListItemsLoadingComplete, watchListSourcesLoadingStarted, watchListSourcesLoadingComplete]);

     // Get WatchListTypes
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (demoMode) {
               const demoWatchListTypesPayload = require("./demo/index").demoWatchListTypes;

               setWatchListTypes(demoWatchListTypesPayload);
               setWatchListTypesLoadingStarted(true);
               setWatchListTypesLoadingComplete(true);

               return;
          }

          if (watchListSourcesLoadingComplete && !watchListTypesLoadingStarted && !watchListTypesLoadingComplete) {
               setWatchListTypesLoadingStarted(true);

               axios.get(`/api/GetWatchListTypes`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListType>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Types with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         setWatchListTypes(res.data[1]);
                         setWatchListTypesLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Types with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [isLoggedInCheck, isLoggedInCheckComplete, isLoggedIn, watchListSourcesLoadingComplete, watchListTypesLoadingStarted, watchListTypesLoadingComplete]);

     /* useEffect that does isClient check */
     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);

          setIsClientCheckComplete(true);
     }, []);

     /* useEffect that routes the current user */
     useEffect(() => {
          if (!isClient) {
               return;
          }

          if (isError) {
               router.push("404");
               return;
          }

          if (!isLoggedInCheckComplete) { // Tabs should never be rendered if the logged in check is not complete
               return;
          }

          if (!isLoggedIn && activeRoute !== "Login" && activeRoute !== "Setup") { // Tabs should never be rendered if the user is not logged in
               return;
          }

          let newRoute = "";

          if (!isLoggedIn) {
               pullToRefreshEnabled(false);

               if (activeRoute === "Setup" || activeRoute === "Login") {
                    newRoute = activeRoute;
               } else {
                    newRoute = "Login";
               }
          } else {
               pullToRefreshEnabled(true);

               const currentPath = location.pathname !== "" ? location.pathname.replace("/", "") : "";
               const queryParams = location.search;

               if (currentPath === routeList["Login"].Path && isLoggedIn) {
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
          }

          setActiveRoute(newRoute);

          const path = getPath(newRoute);

          router.push(path);

          const displayName = getDisplayName(newRoute);

          if (displayName !== "") {
               setActiveRouteDisplayName(displayName);
          }
     }, [defaultRoute, isError, isLoggedIn, isLoggedInCheckComplete]); // Do not add activeRoute, getDisplayName, routeList, setActiveRoute, setActiveRouteDisplayName to dependencies. Causes dtl to close when you click on edit

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
               Enabled: String(process.env.NEXT_PUBLIC_ENABLE_BUGLOGS) === "true" ? true : false
          }
     };

     // These 2 methods reference routeList and have to be defined after routeList is defined
     const getDisplayName = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].DisplayName;
          } else {
               return "";
          }
     }, [routeList]);

     const getPath = useCallback((routeName: string) => {
          const matchingRoute = Object.keys(routeList).filter((currentRouteList) => routeList[currentRouteList].Name === routeName)

          if (matchingRoute.length === 1) {
               return routeList[matchingRoute[0]].Path;
          } else {
               return "";
          }
     }, [isError, routeList]);

     const dataContextProps = {
          activeRoute: activeRoute,
          activeRouteDisplayName: activeRouteDisplayName,
          AddIconComponent: AddIconComponent,
          archivedVisible: archivedVisible,
          autoAdd: autoAdd,
          BrokenImageIconComponent: BrokenImageIconComponent,
          bugLogs: bugLogs,
          buildDate: buildDate,
          CancelIconComponent: CancelIconComponent,
          darkMode: darkMode,
          defaultRoute: defaultRoute,
          DeleteIconComponent: DeleteIconComponent,
          demoMode: demoMode,
          demoPassword: demoPassword,
          demoUsername: demoUsername,
          EditIconComponent: EditIconComponent,
          getFormattedDate: getFormattedDate,
          generateRandomPassword: generateRandomPassword,
          getDisplayName: getDisplayName,
          getPath: getPath,
          hideTabs: hideTabs,
          imdbSearchEnabled: imdbSearchEnabled,
          isAdding: isAdding,
          isAdmin: isAdmin,
          isClient: isClient,
          isEditing: isEditing,
          isEnabled: isEnabled,
          isError: isError,
          errorMessage: errorMessage,
          isLoggedIn: isLoggedIn,
          isLoggedInCheckComplete: isLoggedInCheckComplete,
          LogOutIconComponent: LogOutIconComponent,
          openDetailClickHandler: openDetailClickHandler,
          ratingMax: ratingMax,
          recommendationsEnabled: recommendationsEnabled,
          RemoveIconComponent: RemoveIconComponent,
          routeList: routeList,
          SaveIconComponent: SaveIconComponent,
          searchCount: searchCount,
          SearchIconComponent: SearchIconComponent,
          searchTerm: searchTerm,
          searchVisible: searchVisible,
          setActiveRoute: setActiveRoute,
          setActiveRouteDisplayName: setActiveRouteDisplayName,
          setArchivedVisible: setArchivedVisible,
          setAutoAdd: setAutoAdd,
          setBugLogs: setBugLogs,
          setDarkMode: setDarkMode,
          setDemoMode: setDemoMode,
          setHideTabs: setHideTabs,
          setIsAdding: setIsAdding,
          setIsEditing: setIsEditing,
          setIsError: setIsError,
          setErrorMessage,
          setIsLoggedIn: setIsLoggedIn,
          setIsLoggedInCheckComplete: setIsLoggedInCheckComplete,
          setOptions: setOptions,
          setSearchCount: setSearchCount,
          setSearchTerm: setSearchTerm,
          setSearchVisible: setSearchVisible,
          setSettingsVisible: setSettingsVisible,
          setShowMissingArtwork: setShowMissingArtwork,
          setStillWatching: setStillWatching,
          setSourceFilter: setSourceFilter,
          setUsers: setUsers,
          SettingsIconComponent: SettingsIconComponent,
          settingsVisible: settingsVisible,
          setTypeFilter: setTypeFilter,
          setUserData: setUserData,
          setVisibleSections: setVisibleSections,
          setWatchList: setWatchList,
          setWatchListItems: setWatchListItems,
          setWatchListItemsLoadingStarted: setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete: setWatchListItemsLoadingComplete,
          setWatchListLoadingComplete: setWatchListLoadingComplete,
          setWatchListLoadingStarted: setWatchListLoadingStarted,
          setWatchListSortColumn: setWatchListSortColumn,
          setWatchListSortDirection: setWatchListSortDirection,
          setWatchListSortingComplete: setWatchListSortingComplete,
          setWatchListItemsSortingComplete: setWatchListItemsSortingComplete,
          setWatchListSources: setWatchListSources,
          setWatchListSourcesLoadingStarted: setWatchListSourcesLoadingStarted,
          setWatchListSourcesLoadingComplete: setWatchListSourcesLoadingComplete,
          setWatchListTypes: setWatchListTypes,
          setWatchListTypesLoadingStarted: setWatchListTypesLoadingStarted,
          setWatchListTypesLoadingComplete: setWatchListTypesLoadingComplete,
          showMissingArtwork: showMissingArtwork,
          showSearch: showSearch,
          showSettings: showSettings,
          signOut: signOut,
          sourceFilter: sourceFilter,
          stillWatching: stillWatching,
          pullToRefreshEnabled: pullToRefreshEnabled,
          typeFilter: typeFilter,
          users: users,
          userData: userData,
          validatePassword: validatePassword,
          visibleSectionChoices: visibleSectionChoices,
          visibleSections: visibleSections,
          watchList: watchList,
          watchListItems: watchListItems,
          watchListItemsLoadingStarted: watchListItemsLoadingStarted,
          watchListItemsLoadingComplete: watchListItemsLoadingComplete,
          watchListItemsSortColumns: watchListItemsSortColumns,
          watchListItemsSortingComplete: watchListItemsSortingComplete,
          watchListLoadingComplete: watchListLoadingComplete,
          watchListSortColumn: watchListSortColumn,
          watchListSortColumns: watchListSortColumns,
          watchListSortDirection: watchListSortDirection,
          watchListSortingComplete: watchListSortingComplete,
          watchListSources: watchListSources,
          watchListSourcesLoadingComplete: watchListSourcesLoadingComplete,
          watchListTypes: watchListTypes,
          watchListTypesLoadingComplete: watchListTypesLoadingComplete,
     };

     return (
          <DataContext.Provider value={dataContextProps}>{children}</DataContext.Provider>
     )
}

DataProvider.propTypes = {
     children: PropTypes.any
}

export { DataContext, DataProvider };
