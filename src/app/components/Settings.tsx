import Multiselect from 'multiselect-react-dropdown';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { DataContext, DataContextType } from "../data-context";
import IUserOption from "../interfaces/IUserOption";

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
          pullToRefreshEnabled,
          routeList,
          setActiveRoute,
          setActiveRouteDisplayName,
          setOptions,
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
          pullToRefreshEnabled(true);

          setSettingsVisible(false);
     };

     const optionChanged = (columnName: string, columnValue: boolean | string) => {
          const options :IUserOption = {
               "ArchivedVisible": columnName === "ArchivedVisible" ? columnValue === true ? 1 : 0 : archivedVisible ? 1 : 0,
               "AutoAdd": columnName === "AutoAdd" ? columnValue === true ? 1 : 0 : autoAdd ? 1 : 0,
               "DarkMode": columnName === "DarkMode" ? columnValue === true ? 1 : 0 : darkMode ? 1 : 0,
               "HideTabs": columnName === "HideTabs" ? columnValue === true ? 1 : 0 : hideTabs ? 1 : 0,
               "ShowMissingArtwork": columnName === "ShowMissingArtwork" ? columnValue === true ? 1 : 0 : showMissingArtwork ? 1 : 0
          }

          setOptions(options, true);
     }

     useEffect(() => {
          setFormattedBuildDate(buildDate);
     }, []);

     const filteredVisibleSectionChoices = visibleSectionChoices?.filter((section) => routeList[section["name"]].Enabled === true);

     return (
          <div className="modal">
               <div className={`modal-content settingsPanel textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                    <div>Settings</div>
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
                                        options={filteredVisibleSectionChoices}
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
                                        <input type="checkbox" checked={darkMode} onChange={(event) => optionChanged("DarkMode", event.target.checked)} />
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
                                                  optionChanged("ArchivedVisible", event.target.checked)

                                                  if (event.target.checked === true) {
                                                       setStillWatching(false);
                                                  }
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
                                             <input type="checkbox" checked={autoAdd} onChange={(event) => optionChanged("AutoAdd", event.target.checked)} />
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
                                        <input type="checkbox" checked={hideTabs} onChange={(event) => optionChanged("HideTabs", event.target.checked)} />
                                        <span className="slider round"></span>
                                   </label>
                              </span>
                         </li>

                         {(activeRoute === "Items") && (
                              <li className="topMargin">
                                   <span className="firstItem" title="Show WatchListItems with missing images">
                                        <span>No Image</span>
                                   </span>

                                   <span className="leftMargin">
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
