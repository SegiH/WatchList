// NOTE: If you run this script in VS Code in Docker, you HAVE to run the web app on port 8080 or websocket will stop working which breaks hot reloading
//
// FIX
//
// Before deploying:
//
// In backend, clear config\default.json
// publish backend and frontend packages to releases for web, backend, windows and linux
//
// Known Issues/Future features
//
// Bundle is ~ 27MB. Sluggish overall in dev and console locks up when you open it for 20 - 30 seconds
// SQLite is not encrypted. Look into sqlite encryption options
const axios = require("axios");
const useEffect = require("react").useEffect;
const useState = require("react").useState;
const IimdbSearch = require("./interfaces/IimdbSearch");
const IUser = require("./interfaces/IUser");
const IWatchList = require("./interfaces/IWatchList");
const IWatchListItem = require("./interfaces/IWatchListItem");
const IWatchListSource = require("./interfaces/IWatchListSource");
const IWatchListType = require("./interfaces/IWatchListType");

const React = require("react");

import AdminConsole from "./components/admin/AdminConsole";
import IMDBSearch from "./components/IMDBSearch";
import Login from "./components/Login";
import Settings from "./components/Settings";
import Setup from "./components/Setup";
import WatchList from "./components/WatchList";
import WatchListItems from "./components/WatchListItems";
import WatchListStats from "./components/WatchListStats";
import TabParent from "./components/TabsComponent/TabParent";

import "./App.css";

const ratingMax = 5;

const AddIcon = require("@mui/icons-material/Add").default;
const AddIconComponent = <AddIcon className="icon" />;

const AdminConsoleIcon = require("@mui/icons-material/AdminPanelSettings").default;
const AdminConsoleIconComponent = <AdminConsoleIcon />;

const BrokenImageIcon = require("@mui/icons-material/BrokenImage").default;
const BrokenImageIconComponent = <BrokenImageIcon className="brokenImage" />;

const CancelIcon = require("@mui/icons-material/Cancel").default;
const CancelIconComponent = <CancelIcon />;

const EditIcon = require("@mui/icons-material/Edit").default;
const EditIconComponent = <EditIcon />;

const LogOutIcon = require("@mui/icons-material/Logout").default;
const LogOutIconComponent = <LogOutIcon className="icon" />;

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

import "./App.css";

const App = () => {
     const [activeRoute, setActiveRoute] = useState("");
     const [activeRouteDisplayName, setActiveRouteDisplayName] = useState("");
     const [archivedVisible, setArchivedVisible] = useState(false);
     const [autoAdd, setAutoAdd] = useState(false);
     const [isAdding, setIsAdding] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const [isIMDBSearchEnabled, setIsIMDBSearchEnabled] = useState(false);
     const [isIMDBSearchEnabledCheckStarted, setIsIMDBSearchEnabledCheckStarted] = useState(false);
     const [isIMDBSearchEnabledCheckComplete, setIsIMDBSearchEnabledCheckComplete] = useState(false);
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [isLoggedInCheckComplete, setIsLoggedInCheckComplete] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
     const [settingsVisible, setSettingsVisible] = useState(false);
     const [showMissingArtwork, setShowMissingArtwork] = useState(false);
     const [sourceFilter, setSourceFilter] = useState("-1");
     const [typeFilter, setTypeFilter] = useState("-1");
     const [stillWatching, setStillWatching] = useState(true);
     const [userData, setUserData] = useState({ UserID: 0, Username: "", RealName: "", BackendURL: "", Admin: false }); // cannot use iUserEmpty() here

     const [watchList, setWatchList] = useState([]);
     const [watchListLoadingStarted, setWatchListLoadingStarted] = useState(false);
     const [watchListLoadingComplete, setWatchListLoadingComplete] = useState(false);
     const [watchListSortingComplete, setWatchListSortingComplete] = useState(false);

     const [watchListItems, setWatchListItems] = useState([]);
     const [watchListItemsLoadingStarted, setWatchListItemsLoadingStarted] = useState(false);
     const [watchListItemsLoadingComplete, setWatchListItemsLoadingComplete] = useState(false);
     const [watchListItemsSortingComplete, setWatchListItemsSortingComplete] = useState(false);

     const [newWatchListItemDtlID, setNewWatchListItemDtlID] = useState(null); // After adding a new WLI, This will hold the new ID so it can be passed to WatchList and add a new record based on this WLI ID

     const [watchListSources, setWatchListSources] = useState([]);
     const [watchListSourcesLoadingStarted, setWatchListSourcesLoadingStarted] = useState(false);
     const [watchListSourcesLoadingComplete, setWatchListSourcesLoadingComplete] = useState(false);

     const [watchListTypes, setWatchListTypes] = useState([]);
     const [watchListTypesLoadingStarted, setWatchListTypesLoadingStarted] = useState(false);
     const [watchListTypesLoadingComplete, setWatchListTypesLoadingComplete] = useState(false);

     const [watchListSortColumn, setWatchListSortColumn] = useState("Name");
     const [watchListSortDirection, setWatchListSortDirection] = useState("ASC");

     const defaultRoute="WatchList";

     const watchListSortColumns = {
          ID: "ID",
          Name: "Name",
          StartDate: "Start Date",
          EndDate: "End Date",
     };

     const watchListItemsSortColumns = {
          ID: "ID",
          Name: "Name",
     };

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

      const isLoggedInCheck = () => {
          if (isLoggedInCheckComplete == false) return false;

          if (isLoggedInCheckComplete && !isLoggedIn) return false;

          if (typeof userData.BackendURL === "undefined") return false;

          return true;
     };

     const showSettings = () => {
          setSettingsVisible(true);
     };

     const signOut = () => {
          axios.get(`${userData.BackendURL}/SignOut`)
          .then((res: typeof IUser) => {
               if (res.data[0] === "OK") {
                    const newUserData = Object.assign({}, userData);
                    newUserData.UserID = "";
                    newUserData.Username = "";
                    newUserData.RealName = "";
                    newUserData.BackendURL = userData.BackendURL;
                    setUserData(newUserData);

                    setIsLoggedIn(false);

                    setActiveRoute("");
                    setActiveRouteDisplayName("");
                    setIsAdding(false);
                    setIsEditing(false);
                    setIsIMDBSearchEnabled(false);
                    setIsIMDBSearchEnabledCheckStarted(false);
                    setIsIMDBSearchEnabledCheckComplete(false);
                    setIsLoggedIn(false);
                    setIsLoggedInCheckComplete(false);
                    setSearchTerm("");
                    setSourceFilter("-1");
                    setTypeFilter("-1");

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
               } else {
                    alert(res.data[1]);
               }
          })
          .catch((err: Error) => {
               alert(err.message);
          });
     };

     const validatePassword = (value: string) => {
          // 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric, 1 special char, 8 chars long minimum
          const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

          return strongRegex.test(value);
     };

     // Login
     useEffect(() => {
          const backendURL = localStorage.getItem("WatchList.BackendURL");

          if (!isLoggedIn && backendURL !== null) {
               const newArchivedVisible = localStorage.getItem("WatchList.ArchivedVisible");
               const newAutoAdd = localStorage.getItem("WatchList.AutoAdd");
               const newStillWatching = localStorage.getItem("WatchList.StillWatching");
               const newShowMissingArtwork = localStorage.getItem("WatchList.ShowMissingArtwork");
               const newSourceFilter = localStorage.getItem("WatchList.SourceFilter");
               const newTypeFilter = localStorage.getItem("WatchList.TypeFilter");
               const newSortColumn = localStorage.getItem("WatchList.WatchListSortColumn");
               const newSortDirection = localStorage.getItem("WatchList.WatchListSortDirection");

               if (newAutoAdd !== null) {
                    setArchivedVisible(newArchivedVisible === "true" ? true : false);
               }

               if (newAutoAdd !== null) {
                    setAutoAdd(newAutoAdd === "true" ? true : false);
               }

               if (newShowMissingArtwork !== null) {
                    setShowMissingArtwork(newShowMissingArtwork === "true" ? true : false);
               }

               if (newStillWatching !== null) {
                    setStillWatching(newStillWatching === "true" ? true : false);
               }

               if (newSourceFilter !== null) {
                    setSourceFilter(newSourceFilter);
               }

               if (newTypeFilter !== null) {
                   setTypeFilter(newTypeFilter);
               }

               if (newSortColumn !== null) {
                    setWatchListSortColumn(newSortColumn);
               }

               if (newSortDirection !== null) {
                    setWatchListSortDirection(newSortDirection);
               }

               axios.get(`${backendURL}/IsLoggedIn`)
               .then((res: typeof IUser) => {
                    if (res.data[0] === "OK") {
                         const newUserData = Object.assign({}, userData);
                         newUserData.UserID = res.data[1].UserID;
                         newUserData.Username = res.data[1].Username;
                         newUserData.RealName = res.data[1].RealName;
                         newUserData.Admin = res.data[1].Admin === 1 ? true : false;
                         newUserData.BackendURL = backendURL;

                         setUserData(newUserData);

                         setIsLoggedIn(true);
                    } else {
                         setIsLoggedIn(false);
                    }

                    setIsLoggedInCheckComplete(true);
               })
               .catch((err: Error) => {
                    alert(new Date().toTimeString() + ": Error when calling /IsLoggedIn with the error " + err.message + " when backendURL=" + backendURL);
                    setIsLoggedInCheckComplete(true);
               });
          } else if (isLoggedIn && backendURL !== null) {
               setIsLoggedInCheckComplete(true);
          } else {
               setIsLoggedInCheckComplete(true);
          }
     }, [isLoggedIn, userData]);

     // Get WatchList
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (!watchListLoadingStarted && !watchListLoadingComplete && userData.BackendURL !== "") {
               setWatchListLoadingStarted(true);

               axios.get(`${userData.BackendURL}/GetWatchList?SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}`, { withCredentials: true })
               .then((res: typeof IWatchList) => {
                    setWatchList(res.data);
                    setWatchListLoadingComplete(true);
               })
               .catch((err: Error) => {
                    alert("Failed to get WatchList with the error " + err.message);
               });
          }
     }, [isLoggedInCheck, isLoggedIn, userData, watchListLoadingStarted, watchListLoadingComplete]);

     // Get WatchListItems
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (watchListLoadingComplete && !watchListItemsLoadingStarted && !watchListItemsLoadingComplete && userData.BackendURL !== "") {
               setWatchListItemsLoadingStarted(true);

               axios.get(`${userData.BackendURL}/GetWatchListItems${Object.keys(watchListItemsSortColumns).includes(watchListSortColumn) ? `?SortColumn=${watchListSortColumn}&SortDirection=${watchListSortDirection}` : ``}`, { withCredentials: true })
               .then((res: typeof IWatchListItem) => {
                    setWatchListItems(res.data);
                    setWatchListItemsLoadingComplete(true);
                    setWatchListItemsSortingComplete(false);

                    if (autoAdd && newWatchListItemDtlID !== null) {
                         setActiveRoute(defaultRoute);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to get WatchList Items with the error " + err.message);
               });
          }
     }, [isLoggedInCheck, isLoggedInCheckComplete, isLoggedIn, userData.BackendURL, watchListLoadingComplete, watchListItemsLoadingStarted, watchListItemsLoadingComplete]);

     // Get WatchListSources
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (watchListItemsLoadingComplete && !watchListSourcesLoadingStarted && !watchListSourcesLoadingComplete && userData.BackendURL !== "") {
               setWatchListSourcesLoadingStarted(true);

               axios.get(`${userData.BackendURL}/GetWatchListSources`, { withCredentials: true })
               .then((res: typeof IWatchListSource) => {
                    res.data.sort((a: typeof IWatchListSource, b: typeof IWatchListSource) => {
                         const aName = a.WatchListSourceName;
                         const bName = b.WatchListSourceName;
    
                         return String(aName) > String(bName) ? 1 : -1;
                    });

                    setWatchListSources(res.data);
                    setWatchListSourcesLoadingComplete(true);
               })
               .catch((err: Error) => {
                    alert("Failed to get WatchList Sources with the error " + err.message);
               });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, userData, watchListItemsLoadingComplete, watchListSourcesLoadingStarted, watchListSourcesLoadingComplete]);

     // Get WatchListTypes
     useEffect(() => {
          if (!isLoggedInCheck()) return;

          if (watchListSourcesLoadingComplete && !watchListTypesLoadingStarted && !watchListTypesLoadingComplete && userData.BackendURL !== "") {
               setWatchListTypesLoadingStarted(true);

               axios.get(`${userData.BackendURL}/GetWatchListTypes`, { withCredentials: true })
               .then((res: typeof IWatchListType) => {
                    setWatchListTypes(res.data);
                    setWatchListTypesLoadingComplete(true);
               })
               .catch((err: Error) => {
                    alert("Failed to get WatchList Types with the error " + err.message);
               });
          }
     }, [isLoggedInCheckComplete, isLoggedIn, userData, watchListSourcesLoadingComplete, watchListTypesLoadingStarted, watchListTypesLoadingComplete]);

     // Check if IMDB search is enabled.
     useEffect(() => {
          if (!isIMDBSearchEnabledCheckStarted && !isIMDBSearchEnabledCheckComplete && userData.BackendURL !== "") {
               setIsIMDBSearchEnabledCheckStarted(true);

               axios.get(`${userData.BackendURL}/IsIMDBSearchEnabled`, { withCredentials: true })
               .then((res: typeof IimdbSearch) => {
                    if (res.data === true) {
                         setIsIMDBSearchEnabled(true);
                    }

                    setIsIMDBSearchEnabledCheckComplete(true);
               })
               .catch(() => {
                    setIsIMDBSearchEnabledCheckComplete(true);
               });
          }
     }, [isIMDBSearchEnabled, isIMDBSearchEnabledCheckComplete, isIMDBSearchEnabledCheckStarted, userData.BackendURL]);

     // Save preferences
     useEffect(() => {
          if (!isLoggedIn) {
               return;
          }

          localStorage.setItem("WatchList.ArchivedVisible", archivedVisible);
          localStorage.setItem("WatchList.AutoAdd", autoAdd);
          localStorage.setItem("WatchList.ShowMissingArtwork", showMissingArtwork);
          localStorage.setItem("WatchList.SourceFilter", sourceFilter);
          localStorage.setItem("WatchList.StillWatching", stillWatching);
          localStorage.setItem("WatchList.TypeFilter", typeFilter);
          localStorage.setItem("WatchList.WatchListSortColumn", watchListSortColumn);
          localStorage.setItem("WatchList.WatchListSortDirection", watchListSortDirection);

          setWatchListSortingComplete(false);
          setWatchListItemsSortingComplete(false);
     }, [archivedVisible, autoAdd, showMissingArtwork, stillWatching, sourceFilter, typeFilter, watchListSortColumn, watchListSortDirection]);

     const routeList = {
          WatchList: {
               Name: "WatchList",
               DisplayName: "WatchList",
               Path: "/WatchList",
               Icon: WatchListIconComponent,
               RequiresAuth: true,
               Component: (
                    <WatchList
                         AddIcon={AddIconComponent}
                         archivedVisible={archivedVisible}
                         autoAdd={autoAdd}
                         backendURL={userData.BackendURL}
                         BrokenImageIcon={BrokenImageIconComponent}
                         isAdding={isAdding}
                         CancelIcon={CancelIconComponent}
                         EditIcon={EditIconComponent}
                         isEditing={isEditing}
                         isIMDBSearchEnabled={isIMDBSearchEnabled}
                         isLoggedIn={isLoggedIn}
                         newWatchListItemDtlID={newWatchListItemDtlID}
                         ratingMax={ratingMax}
                         SaveIcon={SaveIconComponent}
                         searchTerm={searchTerm}
                         setActiveRoute={setActiveRoute}
                         setIsAdding={setIsAdding}
                         setIsEditing={setIsEditing}
                         setNewWatchListItemDtlID={setNewWatchListItemDtlID}
                         setWatchList={setWatchList}
                         setWatchListLoadingComplete={setWatchListLoadingComplete}
                         setWatchListLoadingStarted={setWatchListLoadingStarted}
                         setWatchListSortingComplete={setWatchListSortingComplete}
                         sourceFilter={sourceFilter}
                         stillWatching={stillWatching}
                         typeFilter={typeFilter}
                         watchList={watchList}
                         watchListItems={watchListItems}
                         watchListLoadingComplete={watchListLoadingComplete}
                         watchListSortColumn={watchListSortColumn}
                         watchListSortDirection={watchListSortDirection}
                         watchListSortingComplete={watchListSortingComplete}
                         watchListSources={watchListSources}
                         watchListTypes={watchListTypes}
                    />
               ),
          },
          WatchListItems: {
               Name: "WatchListItems",
               DisplayName: "Items",
               Path: "/WatchListItems",
               Icon: WatchListItemsIconComponent,
               RequiresAuth: true,
               Component: (
                    <WatchListItems
                         AddIcon={AddIconComponent}
                         archivedVisible={archivedVisible}
                         backendURL={userData.BackendURL}
                         BrokenImageIcon={BrokenImageIconComponent}
                         CancelIcon={CancelIconComponent}
                         EditIcon={EditIconComponent}
                         isAdding={isAdding}
                         isEditing={isEditing}
                         SaveIcon={SaveIconComponent}
                         searchTerm={searchTerm}
                         setIsAdding={setIsAdding}
                         setIsEditing={setIsEditing}
                         setNewWatchListItemDtlID={setNewWatchListItemDtlID}
                         setWatchListItems={setWatchListItems}
                         setWatchListItemsLoadingComplete={setWatchListItemsLoadingComplete}
                         setWatchListItemsLoadingStarted={setWatchListItemsLoadingStarted}
                         setWatchListItemsSortingComplete={setWatchListItemsSortingComplete}
                         setWatchListLoadingComplete={setWatchListLoadingComplete}
                         setWatchListLoadingStarted={setWatchListLoadingStarted}
                         showMissingArtwork={showMissingArtwork}
                         typeFilter={typeFilter}
                         watchListCount={watchList.length}
                         watchListItems={watchListItems}
                         watchListItemsLoadingComplete={watchListItemsLoadingComplete}
                         watchListSortColumn={watchListSortColumn}
                         watchListSortDirection={watchListSortDirection}
                         watchListItemsSortingComplete={watchListItemsSortingComplete}
                         watchListTypes={watchListTypes}
                    />
               ),
          },
          IMDBSearch: {
               Name: "IMDBSearch",
               DisplayName: "Search",
               Path: "/IMDBSearch",
               Icon: SearchIconComponent,
               RequiresAuth: true,
               Component: (
                    <IMDBSearch
                         AddIcon={AddIconComponent}
                         autoAdd={autoAdd}
                         backendURL={userData.BackendURL}
                         setNewWatchListItemDtlID={setNewWatchListItemDtlID}
                         setWatchListItemsLoadingStarted={setWatchListItemsLoadingStarted}
                         setWatchListItemsLoadingComplete={setWatchListItemsLoadingComplete}
                    />
               ),
          },
          WatchListStats: {
               Name: "WatchListStats",
               DisplayName: "Stats",
               Path: "/WatchListStats",
               Icon: StatsIconComponent,
               RequiresAuth: true,
               Component: (
                    <WatchListStats
                         backendURL={userData.BackendURL}
                         isLoggedIn={isLoggedIn}
                         isLoggedInCheckComplete={isLoggedInCheckComplete}
                         ratingMax={ratingMax}
                    />
               )
          },
          AdminConsole: {
               Name: "AdminConsole",
               DisplayName: "Admin",
               Path: "/AdminConsole",
               Icon: AdminConsoleIconComponent,
               RequiresAuth: true,
               Component: (
                    <AdminConsole
                         backendURL={userData.BackendURL}
                         CancelIcon={CancelIcon}
                         EditIcon={EditIcon}
                         generateRandomPassword={generateRandomPassword}
                         SaveIcon={SaveIcon}
                         setWatchListSources={setWatchListSources}
                         setWatchListSourcesLoadingStarted={setWatchListSourcesLoadingStarted}
                         setWatchListSourcesLoadingComplete={setWatchListSourcesLoadingComplete}
                         setWatchListTypes={setWatchListTypes}
                         setWatchListTypesLoadingStarted={setWatchListTypesLoadingStarted}
                         setWatchListTypesLoadingComplete={setWatchListTypesLoadingComplete}
                         validatePassword={validatePassword}
                         watchListSources={watchListSources}
                         watchListTypes={watchListTypes}
                    />
               )
          },
          Login: {
               Name: "Login",
               DisplayName: "Login",
               Path: "/Login",
               RequiresAuth: false,
               Component: (
                    <Login
                         defaultRoute={defaultRoute}
                         setIsLoggedIn={setIsLoggedIn}
                         setActiveRoute={setActiveRoute}
                         setIsLoggedInCheckComplete={setIsLoggedInCheckComplete}
                         setUserData={setUserData}
                    />
               )
          },
          Setup: {
               Name: "Setup",
               DisplayName: "Setup",
               Path: "/Setup",
               RequiresAuth: false,
               Component:(
                    <Setup
                         backendURL={userData.BackendURL}
                         validatePassword={validatePassword}
                    />
               )
          },
     };

     return (
          <>    
               {isLoggedInCheckComplete && isLoggedIn && (
                    <span className="menuBar">
                         <span className="leftMargin menuBarActiveRoute">{activeRouteDisplayName}</span>

                         <span className="clickable settingsIcon" onClick={showSettings}>
                              {SettingsIconComponent}
                         </span>
                    </span>
               )}

               {isLoggedInCheckComplete && 
                    <TabParent activeRoute={activeRoute} admin={userData.Admin} defaultRoute= {defaultRoute} isIMDBSearchEnabled={isIMDBSearchEnabled} isLoggedIn={isLoggedIn} isLoggedInCheckComplete={isLoggedInCheckComplete} routeList={routeList} setActiveRoute={setActiveRoute} setActiveRouteDisplayName={setActiveRouteDisplayName} />
               }

               {settingsVisible && userData.BackendURL !== "" &&
                    <Settings
                         activeRoute={activeRoute}
                         archivedVisible={archivedVisible}
                         autoAdd={autoAdd}
                         backendURL={userData.BackendURL}
                         isLoggedIn={isLoggedIn}
                         LogOutIconComponent={LogOutIconComponent}
                         searchTerm={searchTerm}
                         setAutoAdd={setAutoAdd}
                         setSearchTerm={setSearchTerm}
                         setSettingsVisible={setSettingsVisible}
                         stillWatching={stillWatching}
                         setArchivedVisible={setArchivedVisible}
                         setShowMissingArtwork={setShowMissingArtwork}
                         setSourceFilter={setSourceFilter}
                         setStillWatching={setStillWatching}
                         setTypeFilter={setTypeFilter}
                         setWatchListSortColumn={setWatchListSortColumn}
                         setWatchListSortDirection={setWatchListSortDirection}
                         showMissingArtwork={showMissingArtwork}
                         signOut={signOut}
                         sourceFilter={sourceFilter}
                         typeFilter={typeFilter}
                         watchListItemsSortColumns={watchListItemsSortColumns}
                         watchListSortColumn={watchListSortColumn}
                         watchListSortColumns={watchListSortColumns}
                         watchListSortDirection={watchListSortDirection}
                         watchListSources={watchListSources}
                         watchListTypes={watchListTypes}
                    />
              }
          </>
     );
};

export default App;