import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Multiselect from 'multiselect-react-dropdown';
import { DataContext, DataContextType } from "../data-context";

const Settings = () => {
     const {
          activeRoute,
          archivedVisible,
          autoAdd,
          buildDate,
          darkMode,
          defaultRoute,
          getDisplayName,
          hideTabs,
          isLoggedIn,
          LogOutIconComponent,
          setActiveRoute,
          setActiveRouteDisplayName,
          setArchivedVisible,
          setAutoAdd,
          setBugLogVisible,
          setDarkMode,
          setHideTabs,
          setSettingsVisible,
          setShowMissingArtwork,
          setStillWatching,
          showMissingArtwork,
          setVisibleSections,
          signOut,
          visibleSectionChoices,
          visibleSections
     } = useContext(DataContext) as DataContextType

     const [formattedBuildDate, setFormattedBuildDate] = useState("");
     const [titleClickCount, setTitleClickCount] = useState(0);

     const router = useRouter();

     const addRemoveVisibleSectionChange = async (newList: []) => {
          setVisibleSections(newList);

          // Handle situation where activeRoute is no longer visible
          if (newList.filter((section) => section["name"] === activeRoute).length === 0) {
               setActiveRoute(defaultRoute);

               const displayName = getDisplayName(defaultRoute);

               if (displayName !== "") {
                    setActiveRouteDisplayName(displayName);
               }

               router.push("/" + defaultRoute);
          }
     }

     const closeDetail = async () => {
          setSettingsVisible(false);
     };

     const titleClickHandler = () => {
          const newTitleClick = titleClickCount + 1;

          if (newTitleClick === 2) {
               setBugLogVisible(true);
               setTitleClickCount(0);
          } else {
               setTitleClickCount(newTitleClick);
               setBugLogVisible(false);
          }
     }

     useEffect(() => {
          setFormattedBuildDate(buildDate);
     }, []);

     return (
          <div className="modal">
               <div className={`modal-content settingsPanel textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                    <div onDoubleClick={titleClickHandler}>Settings</div>
                    <span className="clickable closeButton closeButtonAdjustment" onClick={closeDetail}>
                         X
                    </span>

                    <ul className="menuContent">
                         <li className="topMargin">
                              <span className="firstItem">
                                   <span>Visible Sections</span>
                              </span>

                              <span className="leftMargin" title="Show WatchList Items">
                                   <Multiselect
                                        className={`${!darkMode ? " lightMode" : " darkMode"}`}
                                        options={visibleSectionChoices}
                                        selectedValues={visibleSections}
                                        onSelect={(newList) => addRemoveVisibleSectionChange(newList)}
                                        onRemove={(newList) => addRemoveVisibleSectionChange(newList)}
                                        displayValue="name"
                                   />
                              </span>
                         </li>

                         <li className="topMargin">
                              <span className="firstItem">
                                   <span>Dark Mode</span>
                              </span>

                              <span className="leftMargin" title="Show WatchList Items">
                                   <label className="switch">
                                        <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
                                        <span className="slider round"></span>
                                   </label>
                              </span>
                         </li>

                         {(activeRoute === "WatchList" || activeRoute === "Items") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Archived</span>
                                   </span>

                                   <span className="leftMargin" title="Archived Items">
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

                         {(activeRoute === "WatchList" || activeRoute === "Items" || activeRoute === "SearchIMDB") && (
                              <li className="topMargin">
                                   <span className="firstItem">
                                        <span>Auto Add</span>
                                   </span>

                                   <span className="leftMargin" title="Automatically add WatchList after adding new item">
                                        <label className="switch">
                                             <input type="checkbox" checked={autoAdd} onChange={(event) => setAutoAdd(event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </li>
                         )}

                         <li className="topMargin">
                              <span className="firstItem">
                                   <span>Hide Tabs</span>
                              </span>

                              <span className="leftMargin" title="Hide bottom tab bar">
                                   <label className="switch">
                                        <input type="checkbox" checked={hideTabs} onChange={(event) => setHideTabs(event.target.checked)} />
                                        <span className="slider round"></span>
                                   </label>
                              </span>
                         </li>

                         {(activeRoute === "Items") && (
                              <li className="topMargin">
                                   <span className="leftMargin" title="Show WatchListItems with missing images">
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
                         <span className="rightAligned small-text">Build: {formattedBuildDate}</span>
                    </span>
               </div>
          </div>
     );
};

export default Settings;
