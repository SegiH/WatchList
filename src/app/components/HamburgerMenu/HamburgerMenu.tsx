"use client"

import { useContext, useState, useRef, useEffect } from "react";
import { APIStatus, HamburgerMenuContext } from "../../context";
import "./HamburgerMenu.css";
import { HamburgerMenuContextType } from "../../contexts/HamburgerMenuContextType";
import IUserOption from "../../interfaces/IUserOption";
import IWatchListSource from "../../interfaces/IWatchListSource";
import { Button } from "@mui/material";
import Select from 'react-select';
import IWatchListType from "../../interfaces/IWatchListType";
import MetaDataFilter from "../MetadataFilter";
import { useRouter } from "next/navigation";

const HamburgerMenu = () => {
     const {
          activeRoute, archivedVisible, autoAdd, buildDate, darkMode, defaultRoute, demoMode, demoModeNotificationVisible, hideTabs, isAdding, isAdmin, isEditing, isEnabled, loggedInCheck, LogOutIconComponent, metaDataFilters, openDetailClickHandler, routes, saveOptions, setActiveRoute, setIsLoading, setMetaDataFilters, setNewPage, setOptions, setShowMissingArtwork, setSourceFilter, setStillWatching, setTypeFilter, setVisibleSections, setWatchListSortColumn, setWatchListSortDirection, showMissingArtwork, signOut, sourceFilter, stillWatching, typeFilter, visibleSections, visibleSectionChoices, watchListItemsSortColumns, watchListSortColumn, watchListSortColumns, watchListSortDirection, watchListSources, watchListTypes
     } = useContext(HamburgerMenuContext) as HamburgerMenuContextType

     const [drawerCloseCountdown, setDrawerCloseCountdown] = useState(-1);
     const [isOpen, setIsOpen] = useState(false);
     const [metadataFiltervisible, setMetadataFiltervisible] = useState(false);

     const menuRef = useRef<HTMLDivElement | null>(null);
     const iconRef = useRef<HTMLDivElement | null>(null);
     const router = useRouter();
     const closeDrawerTimeout = 5;

     const addRemoveVisibleSectionChange = async (newList: []) => {
          setVisibleSections(newList);

          // Handle situation where activeRoute is no longer visible
          if (newList.filter((section) => section["label"] === activeRoute).length === 0) {
               setActiveRoute(defaultRoute);

               router.push("/" + defaultRoute);
          }

          if (!demoMode) {
               const options = {
                    "ArchivedVisible": archivedVisible === true ? 1 : 0,
                    "AutoAdd": autoAdd === true ? 1 : 0,
                    "DarkMode": darkMode === true ? 1 : 0,
                    "HideTabs": hideTabs === true ? 1 : 0,
                    "ShowMissingArtwork": showMissingArtwork === true ? 1 : 0,
                    "VisibleSections": JSON.stringify(newList)
               }

               saveOptions(options);
          }

          setDrawerCloseCountdown(0);
     }

     const addRecordClickHandler = () => {
          setIsOpen(false);
          openDetailClickHandler(-1)
     }

     const closeMetaDataFilters = async () => {
          setMetadataFiltervisible(false);
     }

     const filterByMetadataClickHandler = () => {
          setMetadataFiltervisible(true);
          setDrawerCloseCountdown(0);
     }

     const optionChanged = (columnName: string, columnValue: boolean | string) => {
          const options: IUserOption = {
               "ArchivedVisible": columnName === "ArchivedVisible" ? columnValue === true ? 1 : 0 : archivedVisible ? 1 : 0,
               "AutoAdd": columnName === "AutoAdd" ? columnValue === true ? 1 : 0 : autoAdd ? 1 : 0,
               "DarkMode": columnName === "DarkMode" ? columnValue === true ? 1 : 0 : darkMode ? 1 : 0,
               "HideTabs": columnName === "HideTabs" ? columnValue === true ? 1 : 0 : hideTabs ? 1 : 0,
               "ShowMissingArtwork": columnName === "ShowMissingArtwork" ? columnValue === true ? 1 : 0 : showMissingArtwork ? 1 : 0,
               "WatchListSortColumn": watchListSortColumn,
               "VisibleSections": JSON.stringify(visibleSections)
          }

          setOptions(options);

          saveOptions(options);

          setDrawerCloseCountdown(0);
     }

     const settingChangeHandler = async (name: string, value: string | number | boolean) => {
          const options: IUserOption = {}

          setIsLoading(true);

          switch (name) {
               case "StillWatching":
                    options["StillWatching"] = (value === true ? 1 : 0);
                    setStillWatching(value as boolean);
                    break;
               case "SourceFilter":
                    options["SourceFilter"] = (value as number);
                    setSourceFilter(value as number);
                    break;
               case "TypeFilter":
                    options["TypeFilter"] = (value as number);
                    setTypeFilter(value as number);
                    break;
               case "SortColumn": // Do not auto close menu bar because sort has 2 dropdowns
                    options["SortColumn"] = value;
                    setWatchListSortColumn(value as string);
                    break;
               case "SortDirection":
                    options["SortDirection"] = value;
                    setWatchListSortDirection(value as string);
                    break;
          }

          saveOptions(options);

          setIsLoading(false);

          setDrawerCloseCountdown(0);
     }

     const toggleMenu = () => {
          if (isAdding || isEditing) {
               return;
          }

          setIsOpen(!isOpen);
     };

     const tabDropdownChangeHandler = async (newTab: string) => {
          setActiveRoute(newTab);

          if (newTab === "WatchList" || newTab === "Items") {
               setNewPage(1);
          }

          router.push("/" + newTab);

          setDrawerCloseCountdown(0);
     }

     useEffect(() => {
          if (!isOpen) {
               return;
          }

          setDrawerCloseCountdown(0);

          const handleClickOutside = (event: MouseEvent) => {
               const target = event.target as Node;

               // If click is inside menu OR hamburger icon, do nothing
               if (
                    menuRef.current?.contains(target) ||
                    iconRef.current?.contains(target)
               ) {
                    return;
               }

               setIsOpen(false);
          };

          document.addEventListener("mousedown", handleClickOutside);

          return () => {
               document.removeEventListener("mousedown", handleClickOutside);
          };
     }, [isOpen]);

     useEffect(() => {
          if (!isOpen) {
               setDrawerCloseCountdown(-1);
               return;
          }

          if (drawerCloseCountdown < 0) return;

          if (drawerCloseCountdown >= closeDrawerTimeout) {
               console.log(new Date().toTimeString() + "closing")
               setIsOpen(false);
               return;
          }

          const timer = setTimeout(() => {
               setDrawerCloseCountdown(c => c + 1);
          }, 1000);

          return () => clearTimeout(timer);
     }, [isOpen, drawerCloseCountdown]);

     return (
          <>
               <div className="hamburger-container">
                    <div className={`hamburger-icon ${demoModeNotificationVisible ? "demoModeNotificationVisible" : ""}`} onClick={toggleMenu} ref={iconRef}>
                         ☰ {isOpen && <span className="leftMargin">WatchList</span>}
                    </div>

                    <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={menuRef}>
                         <div className="menu-content">
                              {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                   <div className="menu-row">
                                        <span className={`bottomMargin20 clickable customTopMargin`} onClick={() => addRecordClickHandler()}>
                                             <span className={`title`}>Add Record</span>
                                        </span>
                                   </div>
                              }

                              {hideTabs &&
                                   <div className="menu-row">
                                        <span>Tab</span>

                                        <span title="Section">
                                             <select className="leftMargin selectStyle" value={activeRoute !== null ? activeRoute : ""} onChange={(event) => tabDropdownChangeHandler(event.target.value)}>
                                                  {Object.keys(routes)
                                                       .filter((routeName) => {
                                                            return routes[routeName].RequiresAuth === true
                                                                 && routeName !== "Setup"
                                                                 && routeName !== "Search"
                                                                 && (routeName !== "Admin" || (routeName === "Admin" && isAdmin() === true && isEnabled("/Admin")))
                                                                 && (routeName !== "Items" || (routeName === "Items" && isEnabled("/Items")))
                                                                 && (routeName !== "BugLogs" || (routeName === "BugLogs" && isEnabled("/BugLogs") && !demoMode))
                                                                 && (routeName !== "Stats" || (routeName === "Stats" && isEnabled("/Stats")))
                                                       }
                                                       )
                                                       .sort().map((routeName, index) => {
                                                            return (
                                                                 <option key={index} value={routeName}>
                                                                      {routes[routeName].DisplayName}
                                                                 </option>
                                                            );
                                                       })}
                                             </select>
                                        </span>
                                   </div>
                              }

                              {activeRoute === "WatchList" &&
                                   <>
                                        <div className="menu-row">
                                             <span className={`title`}>Still Watching</span>

                                             <span title="Stuff you are still watching">
                                                  <label className="leftMargin switch">
                                                       <input type="checkbox" checked={stillWatching} onChange={(event) => settingChangeHandler("StillWatching", event.target.checked)} />
                                                       <span className="slider round"></span>
                                                  </label>
                                             </span>
                                        </div>

                                        <div className="menu-row">
                                             <span>Source</span>

                                             <span title="Filter by source">
                                                  <select className="leftMargin selectStyle" value={sourceFilter} onChange={(event) => settingChangeHandler("SourceFilter", parseInt(event.target.value, 10))}>
                                                       <option value="-1">Please select</option>

                                                       {watchListSources?.map((watchListSource: IWatchListSource, index: number) => {
                                                            return (
                                                                 <option key={index} value={watchListSource.WatchListSourceID}>
                                                                      {watchListSource.WatchListSourceName}
                                                                 </option>
                                                            );
                                                       })}
                                                  </select>
                                             </span>
                                        </div>
                                   </>
                              }

                              {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                   <>
                                        <div className="menu-row">
                                             <span>Type</span>

                                             <span title="Filter by type">
                                                  <select className="leftMargin selectStyle" value={typeFilter} onChange={(event) => settingChangeHandler("TypeFilter", parseInt(event.target.value, 10))}>
                                                       <option value="-1">Please select</option>

                                                       {watchListTypes?.map((watchListType: IWatchListType, index: number) => {
                                                            return (
                                                                 <option key={index} value={watchListType.WatchListTypeID}>
                                                                      {watchListType.WatchListTypeName}
                                                                 </option>
                                                            );
                                                       })}
                                                  </select>
                                             </span>
                                        </div>

                                        <div className="menu-row">
                                             <span>Sort By</span>

                                             <span title="Sort by">
                                                  <select className="leftMargin selectStyle" value={watchListSortColumn} onChange={(event) => settingChangeHandler("SortColumn", event.target.value)}>
                                                       {activeRoute === "WatchList" &&
                                                            Object.keys(watchListSortColumns).filter((sortColumn) => {
                                                                 return sortColumn !== "EndDate" || (sortColumn === "EndDate" && !stillWatching);
                                                            }).map((sortColumn: string, index: number) => {
                                                                 return (
                                                                      <option key={index} value={sortColumn}>
                                                                           {watchListSortColumns[sortColumn]}
                                                                      </option>
                                                                 );
                                                            })
                                                       }

                                                       {activeRoute === "Items" &&
                                                            Object.keys(watchListItemsSortColumns).map((sortColumn: string, index: number) => {
                                                                 return (
                                                                      <option key={index} value={sortColumn}>
                                                                           {watchListItemsSortColumns[sortColumn]}
                                                                      </option>
                                                                 );
                                                            })
                                                       }
                                                  </select>

                                                  <select className="leftMargin selectStyle" value={watchListSortDirection} onChange={(event) => settingChangeHandler("SortDirection", event.target.value)}>
                                                       <option value="ASC">ASC</option>
                                                       <option value="DESC">DESC</option>
                                                  </select>
                                             </span>
                                        </div>

                                        <div>
                                             <Button variant="contained" onClick={filterByMetadataClickHandler}>Filter by Metadata</Button>
                                        </div>
                                   </>
                              }

                              <span>Visible Sections</span>

                              <span title="Show WatchList Items">
                                   <Select
                                        isMulti
                                        value={visibleSections as any}
                                        defaultValue={visibleSections as any}
                                        onChange={addRemoveVisibleSectionChange}
                                        options={visibleSectionChoices}
                                        className="custom-select"
                                        styles={{
                                             control: (provided) => ({
                                                  ...provided,
                                                  backgroundColor: 'white',  // Set background of the input field to white
                                                  borderColor: 'black',      // Set border color of the input field to black
                                                  color: 'black',            // Set text color of the input field to black
                                             }),
                                             singleValue: (provided) => ({
                                                  ...provided,
                                                  color: 'black',            // Set color of the selected value to black
                                             }),
                                             multiValue: (provided) => ({
                                                  ...provided,
                                                  backgroundColor: 'white',  // Set background color of the multi-value to white
                                                  color: 'black',            // Set text color of the multi-value to black
                                             }),
                                             multiValueLabel: (provided) => ({
                                                  ...provided,
                                                  color: 'black',            // Set text color of the multi-value label to black
                                             }),
                                             menu: (provided) => ({
                                                  ...provided,
                                                  backgroundColor: 'white',  // Set background color of the dropdown to white
                                             }),
                                             option: (provided, state) => ({
                                                  ...provided,
                                                  backgroundColor: 'white',  // Set option background color on hover and select
                                                  color: 'black',            // Set text color of options to black
                                                  ':hover': {
                                                       backgroundColor: 'lightgray',  // Set hover background to light gray
                                                  },
                                             }),
                                             placeholder: (provided) => ({
                                                  ...provided,
                                                  color: 'black',
                                             }),
                                        }}
                                   />
                              </span>

                              <div className="menu-row">
                                   <span className={`title`}>Dark Mode</span>

                                   <span className="leftMargin" title="Show WatchList Items">
                                        <label className="switch">
                                             <input type="checkbox" checked={darkMode} onChange={(event) => optionChanged("DarkMode", event.target.checked)} />
                                             <span className="slider round"></span>
                                        </label>
                                   </span>
                              </div>

                              {(activeRoute === "WatchList" || activeRoute === "Items") &&
                                   <>
                                        <div className="menu-row">
                                             <span>Archived</span>

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
                                        </div>

                                        <div className="menu-row">
                                             <span>Auto Add</span>

                                             <span className="leftMargin" title="Automatically add WatchList after adding new item">
                                                  <label className="switch">
                                                       <input type="checkbox" checked={autoAdd} onChange={(event) => optionChanged("AutoAdd", event.target.checked)} />
                                                       <span className="slider round"></span>
                                                  </label>
                                             </span>
                                        </div>

                                        <div className="menu-row">
                                             <span>Hide Tabs</span>

                                             <span className="leftMargin" title="Hide bottom tab bar">
                                                  <label className="switch">
                                                       <input type="checkbox" checked={hideTabs} onChange={(event) => optionChanged("HideTabs", event.target.checked)} />
                                                       <span className="slider round"></span>
                                                  </label>
                                             </span>
                                        </div>
                                   </>
                              }

                              {(activeRoute === "Items") && (
                                   <div className="menu-row">
                                        <span className="firstItem" title="Show WatchListItems with missing images">
                                             <span>No Image</span>
                                        </span>

                                        <span className="leftMargin">
                                             <label className="switch">
                                                  <input type="checkbox" checked={showMissingArtwork} onChange={(event) => setShowMissingArtwork(event.target.checked)} />
                                                  <span className="slider round"></span>
                                             </label>
                                        </span>
                                   </div>
                              )}

                              {loggedInCheck == APIStatus.Success && (
                                   <div className="menu-row">
                                        <span>Sign Out</span>

                                        <span>
                                             <span className="clickable customLeftMargin" onClick={signOut}>
                                                  {LogOutIconComponent}
                                             </span>
                                        </span>
                                   </div>
                              )}

                              <div className="menu-row">
                                   <span className="small-text title" style={{ width: "205px", marginBottom: "25px" }}>Last built on {buildDate}</span>
                              </div>
                         </div>
                    </div>
               </div>

               {metadataFiltervisible &&
                    <MetaDataFilter closeMetaDataFilters={closeMetaDataFilters} darkMode={darkMode} metaDataFilters={metaDataFilters} setMetaDataFilters={setMetaDataFilters} />
               }
          </>
     );
};

export default HamburgerMenu;