"use client"
// NOTE: If you run this script in VS Code in Docker, you HAVE to run the web app on port 8080 or websocket will stop working which breaks hot reloading
//
import PropTypes from 'prop-types';

const axios = require("axios");
const createContext = require("react").createContext;
const useCallback = require("react").useCallback;
const useEffect = require("react").useEffect;
const useMemo = require("react").useMemo;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;
const IBugLog = require("./interfaces/IBugLog");
const IRoute = require("./interfaces/IRoute");
const IUser = require("./interfaces/IUser");
const IWatchList = require("./interfaces/IWatchList");
const IWatchListItem = require("./interfaces/IWatchListItem");
const IWatchListSource = require("./interfaces/IWatchListSource");
const IWatchListType = require("./interfaces/IWatchListType");

const React = require("react");

import "./page.css";

const ratingMax = 5;

const AddIcon = require("@mui/icons-material/Add").default;
const AddIconComponent = <AddIcon className="icon" />;

const AdminConsoleIcon = require("@mui/icons-material/AdminPanelSettings").default;
const AdminConsoleIconComponent = <AdminConsoleIcon />;

const BrokenImageIcon = require("@mui/icons-material/BrokenImage").default;
const BrokenImageIconComponent = <BrokenImageIcon className="brokenImage" />;

const BugReport = require("@mui/icons-material/BugReport").default;
const BugReportIconComponent = <BugReport className="icon" />;

const CancelIcon = require("@mui/icons-material/Cancel").default;
const CancelIconComponent = <CancelIcon />;

const DeleteIcon = require("@mui/icons-material/Delete").default;
const DeleteIconComponent = <DeleteIcon />;

const EditIcon = require("@mui/icons-material/Edit").default;
const EditIconComponent = <EditIcon />;

const LogOutIcon = require("@mui/icons-material/Logout").default;
const LogOutIconComponent = <LogOutIcon className="icon" />;

const RemoveIcon = require("@mui/icons-material/Remove").default;
const RemoveIconComponent = <RemoveIcon className="icon" />;

const SaveIcon = require("@mui/icons-material/Save").default;
const SaveIconComponent = <SaveIcon />;

const SearchIcon = require("@mui/icons-material/Search").default;
const SearchIconComponent = <SearchIcon className="icon" />;

const SettingsIcon = require("@mui/icons-material/Settings").default;
const SettingsIconComponent = <SettingsIcon className="icon" />;

const StatsIcon = require("@mui/icons-material/BarChart").default;
const StatsIconComponent = <StatsIcon className="icon" />;

const WatchListIcon = require("@mui/icons-material/Movie").default;
const WatchListIconComponent = <WatchListIcon className="icon" />;

const WatchListItemsIcon = require("@mui/icons-material/SmartDisplay").default;
const WatchListItemsIconComponent = <WatchListItemsIcon className="icon" />;

const DataContext = createContext({});

export interface DataContextType {
     activeRoute: string;
     activeRouteDisplayName: string;
     AddIconComponent: React.ReactNode;
     admin: boolean;
     archivedVisible: boolean;
     autoAdd: boolean;
     bugLogs: typeof IBugLog[]
     bugLogVisible: boolean;
     buildDate: string;
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
     generateRandomPassword: () => void;
     getDisplayName: (value: string) => string;
     getPath: (value: string) => string;
     imdbSearchEnabled: boolean;
     isAdding: boolean;
     isAdmin: () => boolean;
     isClient: boolean;
     isEditing: boolean;
     isError: boolean;
     errorMessage: string;
     isLoggedIn: boolean;
     isLoggedInCheckComplete: boolean;
     isVisible: (value: string) => string;
     LogOutIconComponent: React.ReactNode;
     openDetailClickHandler: (value: number) => void;
     ratingMax: number;
     recommendationsEnabled: boolean,
     RemoveIconComponent: React.ReactNode;
     routeList: typeof IRoute;
     SaveIconComponent: React.ReactNode;
     searchCount: number;
     SearchIconComponent: React.ReactNode;
     searchTerm: string;
     searchVisible: boolean;
     setActiveRoute: (value: string) => void;
     setActiveRouteDisplayName: (value: string) => void;
     setArchivedVisible: (value: boolean) => void;
     setAutoAdd: (value: boolean) => void;
     setBugLogs: (value: typeof IBugLog) => void;
     setBugLogVisible: (value: boolean) => void;
     setDarkMode: (value: boolean) => void;
     setDemoMode: (value: boolean) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     setIsLoggedIn: (value: boolean) => void;
     setIsLoggedInCheckComplete: (value: boolean) => void;
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
     setupVisible: boolean;
     setUserData: (value: typeof IUser) => void;
     setUsers: (value: typeof IUser) => void;
     setVisibleSections: (value: []) => void;
     setWatchList: (value: typeof IWatchList) => void;
     setWatchListItems: (value: typeof IWatchListItem) => void;
     setWatchListItemsLoadingStarted: (value: boolean) => void;
     setWatchListItemsLoadingComplete: (value: boolean) => void;
     setWatchListItemsSortingComplete: (value: boolean) => void;
     setWatchListLoadingComplete: (value: boolean) => void;
     setWatchListLoadingStarted: (value: boolean) => void;
     setWatchListSortColumn: (value: string) => void;
     setWatchListSortDirection: (value: string) => void;
     setWatchListSortingComplete: (value: boolean) => void;
     setWatchListSources: (value: typeof IWatchListSource) => void;
     setWatchListSourcesLoadingStarted: (value: boolean) => void;
     setWatchListSourcesLoadingComplete: (value: boolean) => void;
     setWatchListTypes: (value: typeof IWatchListType) => void;
     setWatchListTypesLoadingStarted: (value: boolean) => void;
     setWatchListTypesLoadingComplete: (value: boolean) => void;
     showMissingArtwork: boolean;
     showSearch: () => void;
     showSettings: () => void;
     signOut: () => void;
     sourceFilter: number;
     stillWatching: boolean;
     typeFilter: number;
     users: typeof IUser,
     userData: typeof IUser;
     validatePassword: (value: string) => boolean;
     visibleSectionChoices: [],
     visibleSections: [],
     watchList: typeof IWatchList;
     watchListItems: typeof IWatchListItem;
     watchListItemsLoadingStarted: boolean;
     watchListItemsLoadingComplete: boolean;
     watchListItemsSortColumns: string;
     watchListItemsSortingComplete: boolean;
     watchListLoadingComplete: boolean;
     watchListSortColumn: string;
     watchListSortColumns: string;
     watchListSortDirection: string;
     watchListSortingComplete: boolean;
     watchListSources: typeof IWatchListSource;
     watchListTypes: typeof IWatchListType;
     watchListSourcesLoadingComplete: boolean;
     watchListTypesLoadingComplete: boolean;
}

const DataProvider = ({ children }) => {
     const [activeRoute, setActiveRoute] = useState("");
     const [activeRouteDisplayName, setActiveRouteDisplayName] = useState("");
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(true);
     const [buildDate, setBuildDate] = useState('');
     const [bugLogs, setBugLogs] = useState([]);
     const [bugLogVisible, setBugLogVisible] = useState(false);
     const [darkMode, setDarkMode] = useState(true);
     const [demoMode, setDemoMode] = useState(false);
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
     const [users, setUsers] = useState([]);
     const [userData, setUserData] = useState({ UserID: 0, Username: "", RealName: "", Admin: false }); // cannot use iUserEmpty() here
     const [watchList, setWatchList] = useState([]);
     const [watchListLoadingStarted, setWatchListLoadingStarted] = useState(false);
     const [watchListLoadingComplete, setWatchListLoadingComplete] = useState(false);
     const [watchListSortingComplete, setWatchListSortingComplete] = useState(false);

     const [watchListItems, setWatchListItems] = useState([]);
     const [watchListItemsLoadingStarted, setWatchListItemsLoadingStarted] = useState(false);
     const [watchListItemsLoadingComplete, setWatchListItemsLoadingComplete] = useState(false);
     const [watchListItemsSortingComplete, setWatchListItemsSortingComplete] = useState(false);

     const [watchListSources, setWatchListSources] = useState([]);
     const [watchListSourcesLoadingStarted, setWatchListSourcesLoadingStarted] = useState(false);
     const [watchListSourcesLoadingComplete, setWatchListSourcesLoadingComplete] = useState(false);

     const [watchListTypes, setWatchListTypes] = useState([]);
     const [watchListTypesLoadingStarted, setWatchListTypesLoadingStarted] = useState(false);
     const [watchListTypesLoadingComplete, setWatchListTypesLoadingComplete] = useState(false);

     const [watchListSortColumn, setWatchListSortColumn] = useState("Name");
     const [watchListSortDirection, setWatchListSortDirection] = useState("ASC");

     const [visibleSections, setVisibleSections] = useState([{ "name": "Admin", "id": 3 }]);

     const defaultRoute = "WatchList";
     const demoUsername = "demo";
     const demoPassword = "demo";

     const visibleSectionChoices = [{ name: 'Items', id: 1 }, { name: 'Stats', id: 2 }, { name: 'Admin', id: 3 }]

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
          return userData.Admin;
     }

     const isLoggedInCheck = useCallback(() => {
          if (isLoggedInCheckComplete == false) return false;

          if (isLoggedInCheckComplete && !isLoggedIn) return false;

          return true;
     }, [isLoggedIn, isLoggedInCheckComplete]);

     const isVisible = (sectionName: string) => {
          return visibleSections.length > 0 && visibleSections?.filter((section) => section["name"] === sectionName).length > 0 ? true : false;
     }

     const openDetailClickHandler = useCallback((Id: number) => {
          if (activeRoute === "WatchList" && Id !== null) {
               if (Id === -1) {
                    setIsAdding(true);
               }

               router.push(`/WatchList/Dtl${Id !== -1 ? `?WatchListID=${Id}` : ""}`);
          } else if (activeRoute === "Items" && Id !== null) {
               if (Id === -1) {
                    setIsAdding(true);
               }

               router.push(`/Items/Dtl?WatchListItemID=${Id}`);
          }
     }, [activeRoute, setIsAdding]);

     const showSearch = () => {
          setSearchVisible(true);
     };

     const showSettings = () => {
          setSettingsVisible(true);
     };

     const signOut = () => {
          if (demoMode) {
               signOutActions();
               return;
          }

          axios.get(`/api/SignOut`)
               .then((res: typeof IUser) => {
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
          newUserData.UserID = "";
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

          localStorage.removeItem("watchlist_demomode")

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
          if (!isClientCheckComplete) {
               return;
          }

          if (!isClient) {
               return;
          }

          setIsLoggedInCheckStarted(true);

          if (!isLoggedIn && !isLoggedInCheckStarted) {
               const newArchivedVisible = localStorage.getItem("WatchList.ArchivedVisible");
               const newAutoAdd = localStorage.getItem("WatchList.AutoAdd");
               const darkMode = localStorage.getItem("WatchList.DarkMode");
               const newSearchCount = localStorage.getItem("WatchList.SearchCount");
               const newStillWatching = localStorage.getItem("WatchList.StillWatching");
               const newShowMissingArtwork = localStorage.getItem("WatchList.ShowMissingArtwork");
               const newSourceFilter = localStorage.getItem("WatchList.SourceFilter");
               const newTypeFilter = localStorage.getItem("WatchList.TypeFilter");
               const newSortColumn = localStorage.getItem("WatchList.WatchListSortColumn");
               const newSortDirection = localStorage.getItem("WatchList.WatchListSortDirection");

               let newVisibleSections = localStorage.getItem("WatchList.VisibleSections");

               if (newVisibleSections !== null && typeof newVisibleSections !== "undefined" && newVisibleSections !== "") {
                    newVisibleSections = JSON.parse(newVisibleSections);
               }

               if (newArchivedVisible !== null) {
                    setArchivedVisible(newArchivedVisible === "true" ? true : false);
               }

               if (newAutoAdd !== null) {
                    setAutoAdd(newAutoAdd === "true" ? true : false);
               }

               if (darkMode !== null) {
                    setDarkMode(darkMode === "true" ? true : false);
               }

               if (newSearchCount !== null) {
                    setSearchCount(parseInt(newSearchCount, 10));
               }

               if (newShowMissingArtwork !== null) {
                    setShowMissingArtwork(newShowMissingArtwork === "true" ? true : false);
               }

               if (newStillWatching !== null) {
                    setStillWatching(newStillWatching === "true" ? true : false);
               }

               if (newSourceFilter !== null) {
                    setSourceFilter(parseInt(newSourceFilter, 10));
               }

               if (newTypeFilter !== null) {
                    setTypeFilter(parseInt(newTypeFilter, 10));
               }

               if (newSortColumn !== null) {
                    setWatchListSortColumn(newSortColumn);
               }

               if (newSortDirection !== null) {
                    setWatchListSortDirection(newSortDirection);
               }

               if (newVisibleSections !== null) {
                    setVisibleSections(newVisibleSections);
               }

               if (isLoggedInCheckStarted) {
                    return;
               }

               const previousDemoMode = localStorage.getItem("watchlist_demomode");

               if (previousDemoMode === "true") {
                    setDemoMode(true);

                    const newUserData = require("./demo/index").demoUsers[0];

                    setUserData(newUserData);

                    setIsLoggedIn(true);

                    setActiveRoute("WatchList");
                    setActiveRouteDisplayName("WatchList");

                    router.push("/WatchList");

                    setIsLoggedInCheckComplete(true);

                    return;
               }

               let token = localStorage.getItem("WatchList.Token");
               let tokenExpiration = localStorage.getItem("WatchList.TokenExpiration");

               if (token === 'undefined') {
                    token = null;
                    localStorage.removeItem("WatchList.Token");
               }

               if (tokenExpiration === 'undefined') {
                    tokenExpiration = null;
                    localStorage.removeItem("WatchList.TokenExpiration");
               }

               let params = '';

               if (token !== null && tokenExpiration !== null) {
                    // Validation token expiration
                    const currentEpoch = new Date().getTime();
                    const tokenExpirationNum = parseFloat(tokenExpiration);

                    if (currentEpoch >= tokenExpirationNum) {
                         localStorage.removeItem("WatchList.Token");
                         localStorage.removeItem("WatchList.TokenExpiration");
                    } else {
                         params = "?Token=" + encodeURIComponent(token);
                    }
               }

               axios.get(`/api/IsLoggedIn${params}`)
                    .then((res: typeof IUser) => {
                         if (res.data[0] === "OK") {
                              const newUserData = Object.assign({}, userData);
                              newUserData.UserID = res.data[1].UserID;
                              newUserData.Username = res.data[1].Username;
                              newUserData.RealName = res.data[1].RealName;
                              newUserData.Admin = res.data[1].Admin === 1 ? true : false;

                              localStorage.setItem("WatchList.Token", res.data[1].Token);
                              localStorage.setItem("WatchList.TokenExpiration", res.data[1].TokenExpiration);

                              setUserData(newUserData);

                              setIsLoggedIn(true);

                              setActiveRoute("WatchList");
                              setActiveRouteDisplayName("WatchList");

                              router.push("/WatchList");
                         } else {
                              if (res.data[1] === false) {
                                   setActiveRoute("Setup");
                                   setActiveRouteDisplayName("Setup");
                                   router.push("/Setup");
                                   return;
                              }

                              setIsLoggedIn(false);

                              setActiveRoute("Login");
                              setActiveRouteDisplayName("Login");

                              router.push("/Login");
                         }

                         setIsLoggedInCheckComplete(true);
                    })
                    .catch((err: Error) => {
                         setIsLoggedInCheckComplete(true);

                         router.push("/Login");
                    });
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

               axios.get(`/api/GetWatchList?SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}`, { withCredentials: true })
                    .then((res: typeof IWatchList) => {
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
                    .then((res: typeof IWatchListItem) => {
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
                    .then((res: typeof IWatchListSource) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Sources with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         const wls = res.data[1];

                         wls.sort((a: typeof IWatchListSource, b: typeof IWatchListSource) => {
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
                    .then((res: typeof IWatchListType) => {
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

     // Save preferences
     useEffect(() => {
          if (!isLoggedIn) {
               return;
          }

          localStorage.setItem("WatchList.ArchivedVisible", archivedVisible);
          localStorage.setItem("WatchList.AutoAdd", autoAdd);
          localStorage.setItem("WatchList.DarkMode", darkMode);
          localStorage.setItem("WatchList.SearchCount", searchCount);
          localStorage.setItem("WatchList.ShowMissingArtwork", showMissingArtwork);
          localStorage.setItem("WatchList.SourceFilter", sourceFilter);
          localStorage.setItem("WatchList.StillWatching", stillWatching);
          localStorage.setItem("WatchList.TypeFilter", typeFilter);
          localStorage.setItem("WatchList.VisibleSections", JSON.stringify(visibleSections));
          localStorage.setItem("WatchList.WatchListSortColumn", watchListSortColumn);
          localStorage.setItem("WatchList.WatchListSortDirection", watchListSortDirection);

          //setWatchListSortingComplete(false);
          //setWatchListItemsSortingComplete(false);
     }, [archivedVisible, autoAdd, darkMode, isLoggedIn, searchCount, showMissingArtwork, stillWatching, sourceFilter, typeFilter, visibleSections, watchListSortColumn, watchListSortDirection]);

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

          if (!isLoggedInCheckComplete) { // Tabs should never be rendered if the logged in check is not complete
               return;
          }

          if (!isLoggedIn && activeRoute !== "Login" && activeRoute !== "Setup") { // Tabs should never be rendered if the user is not logged in
               return;
          }

          if (isError) {
               router.push("/404");
               return;
          }

          let newRoute = "";

          if (!isLoggedIn) {
               if (activeRoute === "Setup" || activeRoute === "Login") {
                    newRoute = activeRoute;
               } else {
                    newRoute = "Login";
               }
          } else {
               const currentPath = location.pathname !== "" ? location.pathname : "";

               if (currentPath === routeList["Login"].Path && isLoggedIn) {
                    newRoute = defaultRoute;
               } else if (currentPath !== "") {
                    const findRouteByPath = Object.keys(routeList).filter((routeName) => routeList[routeName].Path === currentPath);

                    if (findRouteByPath.length !== 1) { // Path wasn't found so use default route
                         newRoute = defaultRoute;
                    } else if (
                         (currentPath === "/WatchList") ||
                         (currentPath === "/WatchListStats" && isVisible("Stats")) ||
                         (currentPath === "/Items" && isVisible("Items")) ||
                         (currentPath === "/Admin" && isVisible("Admin"))
                    ) {
                         newRoute = currentPath.replace("/", "").replace("\\", "");
                    } else if (currentPath === "/BugLog") {
                         setBugLogVisible(true);

                         newRoute="BugLog";
                    }
               } else if (activeRoute !== "") {
                    const findRouteByName = Object.keys(routeList).filter((routeName) => routeList[routeName].Name === activeRoute);

                    if (findRouteByName.length !== 1) { // Path wasn't found so use default route
                         newRoute = defaultRoute;
                    } else if (
                         (activeRoute === "/WatchList") ||
                         (activeRoute === "WatchListStats" && isVisible("Stats")) ||
                         (activeRoute === "Items" && isVisible("Items")) ||
                         (activeRoute === "Admin" && isVisible("Admin"))
                    ) {
                         newRoute = activeRoute.replace("/", "").replace("\\", "");
                    } else if (activeRoute === "BugLog") {
                         setBugLogVisible(true);

                         newRoute="BugLog";
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
               .then((res: any) => {
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
               .then((res: any) => {
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
                    setBuildDate(getFormattedDate(data.buildDate.substring(0, 10), "-"));
               });
     }, []);

     const routeList = {
          WatchList: {
               Name: "WatchList",
               DisplayName: "WatchList",
               Path: "/WatchList",
               Icon: WatchListIconComponent,
               RequiresAuth: true
          },
          Items: {
               Name: "Items",
               DisplayName: "Items",
               Path: "/Items",
               Icon: WatchListItemsIconComponent,
               RequiresAuth: true
          },
          WatchListStats: {
               Name: "WatchListStats",
               DisplayName: "Stats",
               Path: "/WatchListStats",
               Icon: StatsIconComponent,
               RequiresAuth: true
          },
          Admin: {
               Name: "Admin",
               DisplayName: "Admin",
               Path: "/Admin",
               Icon: AdminConsoleIconComponent,
               RequiresAuth: true
          },
          Login: {
               Name: "Login",
               DisplayName: "Login",
               Path: "/Login",
               RequiresAuth: false
          },
          BugLog: {
               Name: "BugLog",
               DisplayName: "Bug Log",
               Path: "/BugLog",
               Icon: BugReportIconComponent,
               RequiresAuth: true
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
     }, [routeList]);

     const dataContextProps = {
          activeRoute: activeRoute,
          activeRouteDisplayName: activeRouteDisplayName,
          AddIconComponent: AddIconComponent,
          admin: userData?.Admin,
          archivedVisible: archivedVisible,
          autoAdd: autoAdd,
          BrokenImageIconComponent: BrokenImageIconComponent,
          bugLogs: bugLogs,
          bugLogVisible: bugLogVisible,
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
          imdbSearchEnabled: imdbSearchEnabled,
          isAdding: isAdding,
          isAdmin: isAdmin,
          isClient: isClient,
          isEditing: isEditing,
          isError: isError,
          isVisible: isVisible,
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
          setBugLogVisible: setBugLogVisible,
          setDarkMode: setDarkMode,
          setDemoMode: setDemoMode,
          setIsAdding: setIsAdding,
          setIsEditing: setIsEditing,
          setIsError: setIsError,
          setErrorMessage,
          setIsLoggedIn: setIsLoggedIn,
          setIsLoggedInCheckComplete: setIsLoggedInCheckComplete,
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