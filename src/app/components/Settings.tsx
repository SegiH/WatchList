const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

const Settings = () => {
     const {
          activeRoute,
          archivedVisible,
          autoAdd,
          buildDate,
          getFormattedDate,
          isLoggedIn,
          LogOutIconComponent,
          setActiveRoute,
          setActiveRouteDisplayName,
          setArchivedVisible,
          setAutoAdd,
          setBugLogVisible,
          setSettingsVisible,
          setShowMissingArtwork,
          setShowWatchListItems,
          setStillWatching,
          showMissingArtwork,
          showWatchListItems,
          signOut
     } = useContext(DataContext) as DataContextType

     const [formattedBuildDate, setFormattedBuildDate] = useState("");
     const [titleClickCount, setTitleClickCount] = useState(0);

     const router = useRouter();

     const closeDetail = async () => {
          setSettingsVisible(false);
     };

     const setShowWatchListItemsClickHandler = async (checked: boolean) => {
          setShowWatchListItems(checked);

          if (checked === false && activeRoute === "WatchListItems") {
               setActiveRoute("WatchList");
               setActiveRouteDisplayName("WatchList");
               router.push("/WatchList");
          }
     }

     const titleClickHandler = () => {
          const newTitleClick = titleClickCount+1;

          if (newTitleClick === 2) {
               setBugLogVisible(true);
               setTitleClickCount(0);
          } else {
               setTitleClickCount(newTitleClick);
               setBugLogVisible(false);
          }
     }

     useEffect(() => {
          const newFormattedBuildDate = getFormattedDate(buildDate);

          setFormattedBuildDate(newFormattedBuildDate);
     }, []);

     return (
          <div className="modal">
               <div className="modal-content textLabel">
                    <div onDoubleClick={titleClickHandler}>Settings</div>
                    <span className="clickable closeButton closeButtonAdjustment" onClick={closeDetail}>
                         X
                    </span>

                    <ul className="menuContent">
                         <li className="topMargin">
                              <span className="firstItem">
                                   <span>Show WLI</span>
                              </span>

                              <span title="Show WatchList Items">
                                   <label className="switch">
                                        <input type="checkbox" checked={showWatchListItems} onChange={(event) => setShowWatchListItemsClickHandler(event.target.checked)} />
                                        <span className="slider round"></span>
                                   </label>
                              </span>
                         </li>

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Archived</span>
                                   </span>

                                   <span title="Archived Items">
                                        <label className="switch">
                                             <input type="checkbox" checked={archivedVisible} onChange={(event) => {
                                                  setArchivedVisible(event.target.checked);

                                                  if (event.target.checked === true) setStillWatching(false);
                                             }} />

                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {(activeRoute === "WatchList" || activeRoute === "WatchListItems" || activeRoute === "SearchIMDB") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Auto Add</span>
                                   </span>

                                   <span title="Automatically add WatchList after adding new item">
                                        <label className="switch">
                                             <input type="checkbox" checked={autoAdd} onChange={(event) => setAutoAdd(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {(activeRoute === "WatchListItems") && (
                              <li className="topMargin">
                                   <span title="Show WatchListItems with missing images">
                                        <span className="wordWrapLabel">Missing images</span>
                                   </span>

                                   <span>
                                        <label className="switch">
                                             <input type="checkbox" checked={showMissingArtwork} onChange={(event) => setShowMissingArtwork(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         {isLoggedIn && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Sign Out</span>
                                   </span>

                                   <span>
                                        <span className="clickable customLeftMargin" onClick={signOut}>
                                             {LogOutIconComponent}
                                        </span>
                                   </span>
                              </li>
                         )}
                    </ul>

                    <span>
                         <span className="rightAligned small-text">Build Date: {formattedBuildDate}</span>
                    </span>
               </div>
          </div>
     );
};

export default Settings;
