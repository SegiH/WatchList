"use client"

import axios, { AxiosResponse } from "axios";
import Image from "next/image";

import { Autocomplete, Rating } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Recommendations from "../../components/Recommendations";

import StarIcon from '@mui/icons-material/Star';

import IWatchList from "../../interfaces/IWatchList";
import IWatchListItem from "../../interfaces/IWatchListItem";
import IWatchListSource from "../../interfaces/IWatchListSource";

import "../../page.css";

import { APIStatus, WatchListDtlContext } from "../../data-context";
import { WatchListDtlContextType } from "@/app/interfaces/contexts/WatchListDtlContextType";

// I have a very specific use case here where I'm using a custom type for the Auto Complete dropdown that only has these 2 properties and is only used here so the interface is created here
interface AutoCompleteWatchListItem {
     WatchListItemID: number; // Adjust the type as necessary (e.g., string, number)
     WatchListItemName: string;
}

export default function WatchListDtl() {
     const {
          BrokenImageIconComponent, CancelIconComponent, EditIconComponent, SaveIconComponent, darkMode, demoMode, getWatchList, imdbSearchEnabled, isAdding, isEditing, isLoading, pullToRefreshEnabled, recommendationsEnabled, setErrorMessage, setIsAdding, setIsEditing, setIsError, setStillWatching, showSearch, stillWatching, watchListSortDirection, watchListSources
     } = useContext(WatchListDtlContext) as WatchListDtlContextType

     const currentDate = new Date().toLocaleDateString();

     const [addModified, setAddModified] = useState(false);
     const [addWatchListDtl, setAddWatchListDtl] = useState<IWatchList | null>(null);
     const [autoComplete, setAutoComplete] = useState<IAutoCompleteOption | null>(null);
     const [formattedNames, setFormattedNames] = useState<IAutoCompleteOption[]>([]);
     const [formattedNamesWithId, setFormattedNamesWithId] = useState<AutoCompleteWatchListItem[]>([]);
     const [editModified, setEditModified] = useState(false);
     const [isClosing, setIsClosing] = useState(false);
     const [originalWatchListDtl, setOriginalWatchListDtl] = useState<IWatchList | null>(null); (null);
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState<string>("");
     const [recommendationType, setRecommendationType] = useState<string>("");
     const [watchListDtl, setWatchListDtl] = useState<IWatchList | null>(null);
     const [watchListDtlID, setWatchListDtlID] = useState<number>(-1);
     const [watchListDtlLoadingCheck, setWatchListDtlLoadingCheck] = useState(APIStatus.Idle);
     const [watchListItemDtlID, setWatchListItemDtlID] = useState<number>(0);
     const [watchListItems, setWatchListItems] = useState<IWatchListItem[]>([]);

     const router = useRouter();

     let addingStarted = false;

     const defaultProps = {
          options: formattedNames,
          getOptionLabel: (option: IAutoCompleteOption) => option?.name.toString(),
     };

     // When you go to add a WL, if you forgot to add the WLI, the Add Link will show the search so you can add it immediately. This only applies to adding a WL, not editing one.
     const addNewChangeHandler = () => {
          if (addModified && (addWatchListDtl?.WatchListItemID !== -1 || addWatchListDtl.StartDate !== getLocaleDate() || addWatchListDtl.EndDate !== "" || addWatchListDtl.WatchListSourceID !== -1 || addWatchListDtl.Season !== 0 || addWatchListDtl.Rating !== 0 || addWatchListDtl.Notes !== "")) {
               const confirmLeave = confirm("You have started to add a record. Are you sure you want to leave ?");

               if (!confirmLeave) {
                    return;
               }
          } else if (editModified) {
               const confirmLeave = confirm("You have edited this record. Save it now ?");

               if (confirmLeave) {
                    updateWatchList(true);
               }
          }

          closeDetail();

          showSearch();
     };

     const addWatchListDetailChangeHandler = (fieldName: string, fieldValue: string | number | boolean) => {
          const newAddWatchListDtl = Object.assign({}, addWatchListDtl);

          if (fieldName === "Archived") {
               newAddWatchListDtl[fieldName] = fieldValue === true ? 1 : 0;
          } else {
               newAddWatchListDtl[fieldName] = fieldValue;
          }

          newAddWatchListDtl.IsModified = true;

          setAddWatchListDtl(newAddWatchListDtl);

          setAddModified(true);
     };

     const autoCompleteChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (event.target.innerText === "") {
               return;
          }

          const watchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
               const IMDB_JSON = watchListItem?.IMDB_JSON !== null && typeof watchListItem?.IMDB_JSON !== "undefined" ? JSON.parse(watchListItem?.IMDB_JSON) : null;

               let itemName = watchListItem.WatchListItemName + (IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ``);


               if (watchListItems?.filter((watchListItemDupe: IWatchListItem) => {
                    return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
               }).length > 1) {
                    itemName += ` (${watchListItem.WatchListTypeName})`;
               }

               return itemName === event.target.innerText;
          });

          if (watchListItem.length === 1) {
               if (isAdding) {
                    const newAddWatchListDtl = Object.assign({}, addWatchListDtl);
                    newAddWatchListDtl["WatchListItemID"] = watchListItem[0].WatchListItemID;
                    newAddWatchListDtl["WatchListItem"] = watchListItem[0];
                    setAddWatchListDtl(newAddWatchListDtl);
                    setAddModified(true);
               } else if (isEditing) {
                    const newWatchListDtl = Object.assign({}, watchListDtl);
                    newWatchListDtl["WatchListItemID"] = watchListItem[0].WatchListItemID;
                    newWatchListDtl["WatchListItem"] = watchListItem[0];
                    newWatchListDtl[`WatchListItemIDIsModified`] = true;
                    setWatchListDtl(newWatchListDtl);
                    setEditModified(true);
               }

               setAutoComplete(null);
          }
     };

     const cancelClickHandler = async () => {
          setIsEditing(false);
          setWatchListDtl(originalWatchListDtl);
          setOriginalWatchListDtl(null);
          setAddModified(false);
          setEditModified(false);
     };

     const closeDetail = async () => {
          setAddWatchListDtl(null);
          setWatchListDtl(null);
          setOriginalWatchListDtl(null);

          if (addModified || editModified) {
               getWatchList();
          }

          pullToRefreshEnabled(true);

          setIsClosing(true);
     };

     const getLocaleDate = useCallback(() => {
          const dateSpl = currentDate.split("/");

          if (navigator.languages.includes("en-US")) { // Date is in format mm/dd/yyyy
               return `${dateSpl[2]}-${dateSpl[0].padStart(2, '0')}-${dateSpl[1].padStart(2, '0')}`;
          } else { // Date is in format dd/mm/yyyy
               try {
                    return `${dateSpl[2]}-${dateSpl[1].padStart(2, '0')}-${dateSpl[0].padStart(2, '0')}`;
               } catch (e) {
                    return "";
               }
          }
     }, [currentDate]);

     const getWatchListTypeID = (watchListItemID: number) => {
          const results = watchListItems?.filter((watchListItem: IWatchListItem) => {
               return String(watchListItem.WatchListItemID) === String(watchListItemID);
          });

          if (results.length === 1) {
               return results[0].WatchListTypeID;
          } else {
               return -1;
          }
     };

     const recommendationsClickHandler = () => {
          if (watchListDtl !== null) {
               setRecommendationName(watchListDtl.WatchListItemName);
               setRecommendationType(watchListDtl.WatchListTypeName);
          }
     };

     const saveClickHandler = async () => {
          if (demoMode) {
               alert("Saving is disabled in demo mode");
               return;
          }

          updateWatchList(false);
     };

     const saveNewClickHandler = async () => {
          if (demoMode) {
               alert("Adding is disabled in demo mode");
               return;
          }

          if (addingStarted) {
               return;
          }

          if (addWatchListDtl !== null) {
               if (addWatchListDtl.WatchListItemID === -1) {
                    alert("Please select the Movie or TV Show");
                    return;
               }

               if (addWatchListDtl.StartDate === "") {
                    alert("Please enter the start date");
                    return;
               }

               if (typeof addWatchListDtl.Season !== "undefined" && addWatchListDtl.Season === 0) {
                    alert("Please enter the season");
                    return;
               }

               if (addWatchListDtl.WatchListSourceID === -1) {
                    alert("Please select the source");
                    return;
               }

               addingStarted = true;

               let queryURL = `/api/AddWatchList?WatchListItemID=${addWatchListDtl.WatchListItemID}&StartDate=${addWatchListDtl.StartDate.substring(0, 10)}&WatchListSourceID=${addWatchListDtl.WatchListSourceID}&Archived=false`;

               if (addWatchListDtl.EndDate !== "") {
                    queryURL += `&EndDate=${addWatchListDtl.EndDate.substring(0, 10)}`;
               }

               if (addWatchListDtl.Season !== 0) {
                    queryURL += `&Season=${addWatchListDtl.Season}`;
               }

               if (addWatchListDtl.Rating != 0) {
                    queryURL += `&Rating=${addWatchListDtl.Rating}`;
               }

               if (addWatchListDtl.Notes !== "") {
                    queryURL += `&Notes=${addWatchListDtl.Notes}`;
               }


               axios.put(queryURL).then((res: AxiosResponse<IWatchList>) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while adding the detail`);
                    } else {
                         setIsAdding(false);
                         getWatchList();
                         addingStarted = false;

                         if (typeof addWatchListDtl.EndDate !== "undefined" && !stillWatching) {
                              setStillWatching(true);
                         }

                         router.push("/WatchList");
                    }
               }).catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the detail`);
               });
          } else { // This shouldn't ever happen
               alert("Unable to save new record. addWatchListDtl is null!");
          }
     };

     const startEditing = () => {
          setOriginalWatchListDtl(watchListDtl);
          setIsEditing(!isEditing);
     };

     const showDefaultSrc = () => {
          if (isAdding) {
               const newAddWatchListDtl = Object.assign([], addWatchListDtl);

               newAddWatchListDtl["IMDB_Poster_Error"] = true;

               setAddWatchListDtl(newAddWatchListDtl);
          } else {
               const newWatchListDtl = Object.assign([], watchListDtl);

               newWatchListDtl["IMDB_Poster_Error"] = true;

               setWatchListDtl(newWatchListDtl);
          }
     };

     const updateWatchList = (silent: boolean) => {
          if (watchListDtl !== null) {
               if (watchListDtl.WatchListItemID === -1) {
                    alert("Please select the Movie or TV Show");
                    return;
               }

               if (watchListDtl.StartDate === "" && watchListDtl.Archived !== 1) {
                    alert("Please enter the start date");
                    return;
               }

               if (typeof watchListDtl.Season !== "undefined" && watchListDtl.Season === 0) {
                    alert("Please enter the season");
                    return;
               }

               if (watchListDtl.WatchListSourceID === -1) {
                    alert("Please select the source");
                    return;
               }

               let queryURL = ``;

               if (watchListDtl.WatchListItemIDIsModified === true) {
                    queryURL += `&WatchListItemID=${watchListDtl.WatchListItemID}`;
               }

               if (watchListDtl.WatchListSourceIDIsModified === true) {
                    queryURL += `&WatchListSourceID=${watchListDtl.WatchListSourceID}`;
               }

               if (watchListDtl.StartDateIsModified === true) {
                    // Fix start date formatting
                    if (watchListDtl.StartDate.toString().indexOf("-") === -1) {
                         watchListDtl.StartDate = `${watchListDtl.StartDate.substring(0, 4)}-${watchListDtl.StartDate.substring(4, 6)}-${watchListDtl.StartDate.substring(6, 8)}`;
                    }

                    queryURL += `&StartDate=${watchListDtl.StartDate}`;
               }

               if (watchListDtl.EndDateIsModified === true) {
                    // Fix end date formatting
                    if (watchListDtl.EndDate.toString().indexOf("-") === -1) {
                         watchListDtl.EndDate = `${watchListDtl.EndDate.substring(0, 4)}-${watchListDtl.EndDate.substring(4, 6)}-${watchListDtl.EndDate.substring(6, 8)}`;
                    }

                    queryURL += `&EndDate=${watchListDtl.EndDate.substring(0, 10)}`;
               }

               if (watchListDtl.SeasonIsModified === true) {
                    queryURL += `&Season=${watchListDtl.Season}`;
               }

               if (watchListDtl.ArchivedIsModified === true) {
                    queryURL += `&Archived=${watchListDtl.Archived}`;
               }

               if (watchListDtl.RatingIsModified === true) {
                    queryURL += `&Rating=${watchListDtl.Rating}`;
               }

               if (watchListDtl.NotesIsModified === true) {
                    queryURL += `&Notes=${watchListDtl.Notes}`;
               }

               if (queryURL != "") {
                    queryURL = `/api/UpdateWatchList?WatchListID=${watchListDtl.WatchListID}${queryURL}`;

                    axios.put(queryURL).then((res: AxiosResponse<IWatchList>) => {
                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while updating the detail`);
                         } else {
                              setIsEditing(false);
                         }
                    }).catch((err: Error) => {
                         if (!silent) {
                              alert(`The error ${err.message} occurred while updating the detail`);
                         }
                    });
               } else {
                    setIsEditing(false);
               }
          }
     }

     const watchListDetailChangeHandler = (fieldName: string, fieldValue: boolean | string | number) => {
          const newWatchListDtl = Object.assign({}, watchListDtl);

          if (fieldName === "Archived") {
               newWatchListDtl[fieldName] = fieldValue === true ? 1 : 0;
          } else if (fieldName === "Rating") {
               newWatchListDtl[fieldName] = parseFloat(fieldValue as string);
          } else {
               newWatchListDtl[fieldName] = fieldValue;
          }

          newWatchListDtl[`${fieldName}IsModified`] = true;

          if (fieldName === "WatchListItemID") {
               if (demoMode) {
                    const demoWatchListItemsPayload = require("../../demo/index").demoWatchListItemsPayload;

                    const demoWatchListItem = demoWatchListItemsPayload.filter((watchListItem: IWatchListItem) => {
                         return String(watchListItem.WatchListItemID) === String(fieldValue);
                    });

                    if (demoWatchListItem.length === 1) {
                         newWatchListDtl["WatchListItem"] = demoWatchListItem[0];
                    }
               } else {
                    const watchListItem = watchListItems?.filter((watchListItem: IWatchListItem) => {
                         return String(watchListItem.WatchListItemID) === String(fieldValue);
                    });

                    if (watchListItem.length === 1) {
                         newWatchListDtl["WatchListItem"] = watchListItem[0];
                    }
               }
          }

          setWatchListDtl(newWatchListDtl);

          setEditModified(true);
     };

     const imdbImage = typeof watchListDtl?.IMDB_Poster !== "undefined" && watchListDtl?.IMDB_Poster !== null && watchListDtl?.IMDB_Poster_Error !== true && watchListDtl?.IMDB_Poster !== "" && watchListDtl?.IMDB_Poster.length > 0
          ?
          <Image className="poster-detail" width="175" height="260" alt="Image Not Available" src={watchListDtl?.IMDB_Poster} onError={() => showDefaultSrc()} />
          :
          <>{BrokenImageIconComponent}</>;

     useEffect(() => {
          if (!isAdding && watchListDtlLoadingCheck === APIStatus.Idle && watchListDtlID !== -1 && watchListDtlID !== -1 && !isNaN(watchListDtlID)) {
               setWatchListDtlLoadingCheck(APIStatus.Loading);

               if (demoMode && watchListDtlID !== -1) {
                    const demoWatchListPayload = require("../../demo/index").demoWatchListPayload;

                    const detailWatchList = demoWatchListPayload.filter((currentWatchList: IWatchList) => {
                         return String(currentWatchList.WatchListID) === String(watchListDtlID);
                    });

                    // This should never happen
                    if (detailWatchList.length !== 1) {
                         alert("Unable to get the detail");
                         return;
                    }

                    setWatchListDtl(detailWatchList[0]);
                    setWatchListDtlLoadingCheck(APIStatus.Success);

                    return;
               }

               axios.get(`/api/GetWatchListDtl?WatchListID=${watchListDtlID}`)
                    .then((res: AxiosResponse<IWatchList>) => {
                         if (res.data[0] === "ERROR") {
                              setErrorMessage(`The error ${res.data[1]} occurred while getting the detail`);
                              setIsError(true);
                              return;
                         } else {
                              // Sanitize object by replacing all fields with null
                              const wld = res.data[1];

                              if (wld[0]?.IMDB_JSON !== null && typeof wld[0]?.IMDB_JSON !== "undefined") {
                                   const IMDB_JSON = (JSON.parse(wld[0]?.IMDB_JSON));

                                   const tooltip = IMDB_JSON && IMDB_JSON !== null &&
                                        `Rated: ${IMDB_JSON.Rated} 
Year: ${IMDB_JSON.Year}
Rated: ${IMDB_JSON.imdbRating}
Genre: ${IMDB_JSON.Genre}
Runtime: ${IMDB_JSON.Runtime}
Release Date: ${IMDB_JSON.Released}
Director: ${IMDB_JSON.Director}
Plot: ${IMDB_JSON.Plot}
${typeof IMDB_JSON.totalSeasons !== "undefined" ? `Seasons: ${IMDB_JSON.totalSeasons}` : ""}
     `;

                                   wld[0].Tooltip = tooltip;
                              }

                              Object.keys(wld[0]).map((keyName) => {
                                   if (wld[0][keyName] === null) {
                                        wld[0][keyName] = "";
                                   }
                              });

                              setWatchListDtl(wld[0]);
                              setWatchListDtlLoadingCheck(APIStatus.Success);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage(`The fatal error ${err.message} occurred while getting the detail`);
                         setIsError(true);
                    });
          } else if (isAdding) {
               const newAddWatchListDtl: IWatchList = {} as IWatchList;
               newAddWatchListDtl.WatchListItemID = watchListItemDtlID !== null ? watchListItemDtlID : -1;
               newAddWatchListDtl.StartDate = getLocaleDate();
               newAddWatchListDtl.EndDate = "";
               newAddWatchListDtl.WatchListSourceID = -1;
               newAddWatchListDtl.Season = 0;
               newAddWatchListDtl.Rating = 0;
               newAddWatchListDtl.Notes = "";

               setAddWatchListDtl(newAddWatchListDtl);

               setWatchListDtlLoadingCheck(APIStatus.Success);
          }
     }, [demoMode, getLocaleDate, isAdding, setErrorMessage, setIsError, watchListDtl, watchListDtlID, watchListDtlLoadingCheck, watchListItemDtlID]);

     useEffect(() => {
          if (formattedNames.length == 0) {
               axios.get(`/api/GetWatchListItems?AllData=true`, { withCredentials: true })
                    .then((res: AxiosResponse<IWatchListItem>) => {
                         if (res.data[0] !== "OK") {
                              setErrorMessage("Failed to get WatchList Items with the error " + res.data[1]);
                              setIsError(true);
                              return;
                         }

                         setWatchListItems(res.data[1]);

                         // Generate names for auto complete
                         const namesOnlyItems: IAutoCompleteOption[] = res.data[1].map((watchListItem: IWatchListItem) => {
                              const IMDB_JSON = watchListItem?.IMDB_JSON !== null && typeof watchListItem?.IMDB_JSON !== "undefined" ? JSON.parse(watchListItem?.IMDB_JSON) : null;

                              let itemName = watchListItem.WatchListItemName + (IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ``);


                              if (res.data[1]?.filter((watchListItemDupe: IWatchListItem) => {
                                   return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
                              }).length > 1) {
                                   itemName += ` (${watchListItem.WatchListTypeName})`;
                              }

                              return { name: itemName };
                         });

                         const namesSorted = namesOnlyItems.sort((a: any, b: any) => {
                              // Convert names to lowercase for case-insensitive sorting
                              const nameA = a.name.toLowerCase().trim();
                              const nameB = b.name.toLowerCase().trim();

                              // Compare the names
                              if (nameA < nameB) {
                                   return -1;
                              }
                              if (nameA > nameB) {
                                   return 1;
                              }

                              // Names are equal
                              return 0;
                         });

                         const seenNames = new Map<string, number>();
                         const duplicateMessages: string[] = [];

                         namesSorted.forEach((item, index) => {
                              if (seenNames.has(item.name)) {
                                   duplicateMessages.push(`Duplicate found for "${item.name}"`);
                              }
                              seenNames.set(item.name, index); // Overwrite to keep the last occurrence
                         });

                         if (duplicateMessages.length > 0) {
                              console.log(duplicateMessages.join("\n"));
                         }

                         setFormattedNames(namesSorted);

                         const namesWithIdItems = res.data[1].map((watchListItem: IWatchListItem) => {
                              let itemName = watchListItem.WatchListItemName

                              if (watchListItems?.filter((watchListItemDupe: IWatchListItem) => {
                                   return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
                              }).length > 1) {
                                   itemName += " (" + watchListItem.WatchListTypeName + ")"
                              }

                              let newItem: AutoCompleteWatchListItem = {
                                   WatchListItemID: watchListItem.WatchListItemID,
                                   WatchListItemName: itemName
                              }

                              return newItem;
                         });

                         const namesWithIdItemsSorted = namesWithIdItems.sort((a: IWatchListItem, b: IWatchListItem) => {
                              // Convert names to lowercase for case-insensitive sorting
                              const nameA = a.WatchListItemName.toLowerCase().trim();
                              const nameB = b.WatchListItemName.toLowerCase().trim();

                              // Compare the names
                              if (nameA < nameB) {
                                   return -1;
                              }
                              if (nameA > nameB) {
                                   return 1;
                              }

                              // Names are equal
                              return 0;
                         });

                         setFormattedNamesWithId(namesWithIdItemsSorted);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get WatchList Items with the error " + err.message);

                         setIsError(true);
                    });
          }
     }, [formattedNames]);

     useEffect(() => {
          if (recommendationName !== "" && recommendationType !== "") {
               setRecommendationsVisible(true);
          }
     }, [recommendationName, recommendationType]);

     useEffect(() => {
          const searchParams = window.location.search.replace("?", "&").split("&");

          for (let i = 0; i < searchParams.length; i++) {
               if (searchParams[i] !== "") {
                    const paramSpl = searchParams[i].split("=");

                    if (paramSpl[0] === "WatchListID" && paramSpl[1] !== "") {
                         setWatchListDtlID(parseInt(paramSpl[1], 10));
                    } else if (paramSpl[0] === "WatchListItemID" && paramSpl[1] !== "") {
                         setWatchListItemDtlID(parseInt(paramSpl[1], 10));
                    }
               }
          }
     }, []);

     useEffect(() => {
          if (isClosing) {
               router.push("/WatchList");
          }
     }, [isClosing, router]);

     return (
          <>
               {!isLoading && !isClosing && watchListDtlLoadingCheck === APIStatus.Success &&
                    <div className="modal">
                         <div className={`modal-content ${watchListDtlID != null ? "fade-in" : ""}${!darkMode ? " lightMode" : " darkMode"}`}>
                              {!recommendationsVisible &&
                                   <div className="container">
                                        <div className="cards">
                                             <div className="narrow card">
                                                  {!isAdding && !isEditing &&
                                                       <span onClick={startEditing}>
                                                            <span className={`clickable editsaveCancelButton ${!darkMode ? " lightMode" : " darkMode"}`}>{EditIconComponent}</span>
                                                       </span>
                                                  }

                                                  {(isAdding || isEditing) &&
                                                       <span className={`clickable saveIcon${!darkMode ? " lightMode" : " darkMode"}`} onClick={isAdding ? saveNewClickHandler : saveClickHandler}>
                                                            {SaveIconComponent}
                                                       </span>
                                                  }
                                             </div>

                                             <div className="labelWidth card">
                                                  {!isAdding && !isEditing &&
                                                       <>
                                                            {typeof watchListDtl?.IMDB_URL !== "undefined" &&
                                                                 <a className={`linkStyle text-label${!darkMode ? " lightMode" : " darkMode"}`} href={watchListDtl?.IMDB_URL} target='_blank' title={watchListDtl?.Tooltip}>{watchListDtl?.WatchListItemName}</a>
                                                            }

                                                            {typeof watchListDtl?.IMDB_URL === "undefined" &&
                                                                 <>
                                                                      <div title={watchListDtl?.Tooltip} className={`${!darkMode ? "lightMode" : "darkMode"}`} style={{ position: "relative", left: "-5px" }}>
                                                                           {watchListDtl?.WatchListItemName}
                                                                      </div>
                                                                 </>
                                                            }

                                                            {watchListDtl?.Archived === 1 ? <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>&nbsp;(A)</span> : <></>}
                                                       </>
                                                  }

                                                  {(isEditing || isAdding) && formattedNames &&
                                                       <div className="narrow card">
                                                            <Autocomplete id="wl_autocomplete" className={`labelWidth lightMode`} size="small" sx={{ width: 250, height: 40 }} {...defaultProps} options={formattedNames} value={autoComplete} onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => autoCompleteChangeHandler(event)} renderInput={(params: TextFieldProps) => <TextField {...params} label="Search" />} />
                                                       </div>
                                                  }
                                             </div>

                                             <div className="narrow card rightAligned">
                                                  {!isAdding && !isEditing &&
                                                       <div>ID: {watchListDtl?.WatchListID}</div>
                                                  }

                                                  {!isAdding && !isEditing &&
                                                       <span className={`clickable closeButton ${!darkMode ? " lightMode" : "darkMode"}`} style={{ position: "relative", top: "-20px" }} onClick={closeDetail}>
                                                            X
                                                       </span>
                                                  }

                                                  {(isAdding || isEditing) &&
                                                       <span className={`clickable cancelIcon${!darkMode ? " lightMode" : " darkMode"}`} onClick={isAdding ? closeDetail : cancelClickHandler}>
                                                            {CancelIconComponent}
                                                       </span>
                                                  }
                                             </div>

                                             <div className="narrow card">
                                                  {!isAdding && !isClosing &&
                                                       <>
                                                            {imdbImage}
                                                       </>
                                                  }

                                                  {isAdding && addWatchListDtl && watchListItems?.filter((currentWatchListItem: IWatchListItem) => String(currentWatchListItem?.WatchListItemID) === String(addWatchListDtl?.WatchListItemID)).length === 1 && !isClosing &&
                                                       <span className="column"><Image className="poster-detail" width="175" height="280" alt="Image Not Available" src={watchListItems?.filter((currentWatchListItem: IWatchListItem) => String(currentWatchListItem?.WatchListItemID) === String(addWatchListDtl?.WatchListItemID))[0].IMDB_Poster ?? ""} /></span>
                                                  }
                                             </div>

                                             {!isAdding && !isEditing &&
                                                  <>
                                                       <div className="narrow card"></div>
                                                       <div className="narrow card"></div>
                                                  </>
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <div className="narrow card">
                                                       <select className="selectStyle editing" autoFocus value={addWatchListDtl?.WatchListItemID} onChange={(event) => addWatchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {formattedNamesWithId && formattedNamesWithId.map((watchListItem: IWatchListItem, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListItem?.WatchListItemID}>
                                                                           {watchListItem?.WatchListItemName}
                                                                      </option>
                                                                 )
                                                            })}
                                                       </select>
                                                  </div>
                                             }

                                             {isEditing &&
                                                  <div className="narrow card">
                                                       <select className="selectStyle editing" autoFocus value={watchListDtl?.WatchListItemID} onChange={(event) => watchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {watchListItems?.sort((a: IWatchListItem, b: IWatchListItem) => {
                                                                 return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                                                            }).map((watchListItem: IWatchListItem, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListItem.WatchListItemID}>
                                                                           {watchListItem.WatchListItemName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  </div>
                                             }

                                             <div className="narrow card">
                                                  {((isAdding && addWatchListDtl) || isEditing) && imdbSearchEnabled &&
                                                       <div className="clickable hyperlink text-label rightAligned" onClick={addNewChangeHandler}>Add</div>
                                                  }
                                             </div>

                                             {(isAdding || isEditing) &&
                                                  <div className="narrow card"></div>
                                             }

                                             <div className="narrow card topMargin">
                                                  <span className={`textLabel minWidth105 ${!darkMode ? " lightMode" : "darkMode"}`}>Start Date:&nbsp;</span>
                                             </div>

                                             <div className="labelWidth narrow card topMargin">
                                                  {!isAdding && !isEditing &&
                                                       <span className={`${!darkMode ? " lightMode" : " darkMode"}`}>{watchListDtl?.StartDate && watchListDtl?.StartDate}</span>
                                                  }

                                                  {isEditing &&
                                                       <input className={`lightMode`} type="date" value={watchListDtl?.StartDate !== null ? watchListDtl?.StartDate : ""} onChange={(event) => watchListDetailChangeHandler("StartDate", event.target.value)} />
                                                  }

                                                  {isAdding && addWatchListDtl &&
                                                       <input className={`lightMode`} type="date" value={addWatchListDtl?.StartDate} onChange={(event) => addWatchListDetailChangeHandler("StartDate", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <span className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>End Date:&nbsp;</span>
                                             </div>

                                             <div className="labelWidth narrow card">
                                                  {!isAdding && !isEditing &&
                                                       <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>{watchListDtl?.EndDate && watchListDtl?.EndDate}</span>
                                                  }

                                                  {isEditing &&
                                                       <input className={`lightMode`} type="date" value={watchListDtl?.EndDate !== null ? watchListDtl?.EndDate : ""} onChange={(event) => watchListDetailChangeHandler("EndDate", event.target.value)} />
                                                  }

                                                  {isAdding && addWatchListDtl &&
                                                       <input className={`lightMode`} type="date" value={addWatchListDtl?.EndDate} onChange={(event) => addWatchListDetailChangeHandler("EndDate", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : "darkMode"}`}>Source:</div>
                                             </div>

                                             <div className="narrow card">
                                                  {!isAdding && !isEditing &&
                                                       <div className={`${!darkMode ? " lightMode" : "darkMode"}`}>{watchListDtl?.WatchListSourceName}</div>
                                                  }

                                                  {isEditing &&
                                                       <select className="selectStyle" value={watchListDtl?.WatchListSourceID} onChange={(event) => watchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {watchListSources?.map((watchListSource: IWatchListSource, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListSource?.WatchListSourceID}>
                                                                           {watchListSource?.WatchListSourceName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  }

                                                  {isAdding && addWatchListDtl &&
                                                       <select className="selectStyle" value={addWatchListDtl?.WatchListSourceID} onChange={(event) => addWatchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {watchListSources?.map((watchListSource: IWatchListSource, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListSource?.WatchListSourceID}>
                                                                           {watchListSource?.WatchListSourceName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  }
                                             </div>

                                             {((isAdding && addWatchListDtl !== null && addWatchListDtl?.WatchListItemID !== -1 && getWatchListTypeID(addWatchListDtl.WatchListItemID) === 2) || (!isAdding && watchListDtl?.WatchListTypeID === 2)) &&
                                                  <>
                                                       <div className="narrow card"></div>

                                                       <div className="narrow card">
                                                            <div className={`textLabel ${!darkMode ? " lightMode" : "darkMode"}`}>Season:</div>
                                                       </div>

                                                       <div className="narrow card">
                                                            {!isAdding && !isEditing &&
                                                                 <div>{watchListDtl?.Season}</div>
                                                            }

                                                            {isEditing &&
                                                                 <input className={`inputStyle narrowWidth lightMode`} type="number" value={watchListDtl?.Season !== null ? watchListDtl?.Season : ""} onChange={(event) => watchListDetailChangeHandler("Season", event.target.value)} />
                                                            }

                                                            {isAdding && addWatchListDtl &&
                                                                 <input className={`inputStyle narrowWidth lightMode`} type="number" value={addWatchListDtl?.Season} onChange={(event) => addWatchListDetailChangeHandler("Season", event.target.value)} />
                                                            }
                                                       </div>
                                                  </>
                                             }

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : "darkMode"}`}>Notes:</div>
                                             </div>

                                             <div className="narrow card no-width">
                                                  {!isAdding && !isEditing &&
                                                       <div className={`scrollableText ${!darkMode ? "lightMode" : "darkMode"}`}>{watchListDtl?.Notes}</div>
                                                  }

                                                  {isEditing &&
                                                       <input className={`inputStyle lightMode`} value={watchListDtl?.Notes} onChange={(event) => watchListDetailChangeHandler("Notes", event.target.value)} />
                                                  }

                                                  {isAdding && addWatchListDtl &&
                                                       <input className={`inputStyle lightMode`} value={addWatchListDtl?.Notes} onChange={(event) => addWatchListDetailChangeHandler("Notes", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card topMargin">
                                                  {!isAdding && !isEditing && recommendationsEnabled &&
                                                       <div className={`clickable hyperlink text-label rightAligned topMargin`} onClick={recommendationsClickHandler}>Recommendations</div>
                                                  }
                                             </div>

                                             <div className="narrow card">
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : "darkMode"}`}>Rating:</div>
                                             </div>

                                             <div className="labelWidth narrow card">
                                                  {!isAdding && !isEditing &&
                                                       <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                                                            <span className={`favoriteIcon`}>
                                                                 {watchListDtl && watchListDtl?.Rating !== null && watchListDtl?.Rating.toString() !== "" &&
                                                                      <Rating
                                                                           name="hover-feedback"
                                                                           disabled
                                                                           value={watchListDtl?.Rating}
                                                                           precision={0.5}
                                                                           style={{ opacity: 1 }}
                                                                      />
                                                                 }

                                                                 {watchListDtl && (watchListDtl?.Rating === null || watchListDtl?.Rating.toString() === "") &&
                                                                      <span>Not Rated</span>
                                                                 }
                                                            </span>
                                                       </span>
                                                  }

                                                  {(isEditing || (isAdding && addWatchListDtl)) &&
                                                       <span className={`customTopMargin clickable ${!darkMode ? "lightMode" : "darkMode"}`}>
                                                            <span className={`favoriteIcon ${!darkMode ? "lightMode" : "darkMode"}`}>
                                                                 <Rating
                                                                      name="hover-feedback"
                                                                      value={watchListDtl?.Rating}
                                                                      sx={{
                                                                           padding: 1,
                                                                           '& .MuiRating-iconEmpty': {
                                                                                color: 'white' // Change the empty star color. Important when dark mode is enabled
                                                                           }
                                                                      }}
                                                                      precision={0.5}
                                                                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                                      onChange={(event, newValue) => {
                                                                           if (isAdding) {
                                                                                addWatchListDetailChangeHandler("Rating", newValue as number);
                                                                           } else if (isEditing) {
                                                                                watchListDetailChangeHandler("Rating", newValue as number);
                                                                           }
                                                                      }}
                                                                 />
                                                            </span>
                                                       </span>
                                                  }
                                             </div>

                                             {(isAdding || isEditing) &&
                                                  <>
                                                       <div className="narrow card"></div>

                                                       <div className="narrow card">
                                                            <div className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>Archive:</div>
                                                       </div>

                                                       {isAdding &&
                                                            <div className="narrow card">
                                                                 <input className={`lightMode`} type="checkbox" checked={addWatchListDtl?.Archived === 1 ? true : false} onChange={(event) => addWatchListDetailChangeHandler("Archived", event.target.checked)} />
                                                            </div>

                                                       }

                                                       {isEditing &&
                                                            <div className="narrow card">
                                                                 <input className={`lightMode`} type="checkbox" checked={watchListDtl?.Archived === 1 ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListDetailChangeHandler("Archived", event.target.checked)} />
                                                            </div>
                                                       }
                                                  </>
                                             }
                                        </div>
                                   </div>
                              }

                              {recommendationsVisible && (
                                   <Recommendations queryTerm={recommendationName} type={recommendationType} setRecommendationName={setRecommendationName} setRecommendationType={setRecommendationName} setRecommendationsVisible={setRecommendationsVisible} />
                              )}
                         </div>
                    </div>
               }
          </>
     )
}