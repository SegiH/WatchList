"use client"

import "./page.css";
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


import { APIStatus, WatchListDtlContext } from "../../context";
import { WatchListDtlContextType } from "@/app/contexts/WatchListDtlContextType";
import IAutoCompleteOption from "@/app/interfaces/IAutoCompleteOption";

// I have a very specific use case here where I'm using a custom type for the Auto Complete dropdown that only has these 2 properties and is only used here so the interface is created here
interface AutoCompleteWatchListItem {
     WatchListItemID: number; // Adjust the type as necessary (e.g., string, number)
     WatchListItemName: string;
}

function FieldRow({ label, children, className }: {
     label: string; children: React.ReactNode; className?: string;
}) {
     return (
          <div className={`wl-field ${className ?? ""}`}>
               <span className="wl-field-label">{label || "\u00A0"}</span>
               <div className="wl-field-value">{children}</div>
          </div>
     );
}

export default function WatchListDtl() {
     const {
          BrokenImageIconComponent, CancelIconComponent, demoMode, EditIconComponent, getMissingPoster, getWatchList, imageHeight, imageIsValid, imageWidth, isAdding, isEditing, isLoading, pullToRefreshEnabled, modalVisible, recommendationsEnabled, SaveIconComponent, setErrorMessage, setIsAdding, setIsEditing, setIsLoading, setModalVisible, setStillWatching, stillWatching, tmdbSearchEnabled, watchListSortDirection, watchListSources, writeLog
     } = useContext(WatchListDtlContext) as WatchListDtlContextType

     const currentDate = new Date().toLocaleDateString();

     const [addModified, setAddModified] = useState(false);
     const [addWatchListDtl, setAddWatchListDtl] = useState<IWatchList | null>(null);
     const [autoComplete, setAutoComplete] = useState<IAutoCompleteOption | null>(null);
     const [defaultProps, setDefaultProps] = useState(null);
     const [formattedNames, setFormattedNames] = useState<IAutoCompleteOption[]>([]);
     const [formattedNamesWithId, setFormattedNamesWithId] = useState<AutoCompleteWatchListItem[]>([]);
     const [formattedNamesLoadingComplete, setFormattedNamesLoadingComplete] = useState(APIStatus.Idle);
     const [editModified, setEditModified] = useState(false);
     const [isClosing, setIsClosing] = useState(false);
     const [originalWatchListDtl, setOriginalWatchListDtl] = useState<IWatchList | null>(null);
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState<string>("");
     const [recommendationType, setRecommendationType] = useState<string>("");
     const [watchListDtl, setWatchListDtl] = useState<IWatchList | null>(null);
     const [watchListDtlID, setWatchListDtlID] = useState<number>(-1);
     const [watchListDtlLoadingCheck, setWatchListDtlLoadingCheck] = useState(APIStatus.Idle);
     const [watchListItemDtlID, setWatchListItemDtlID] = useState<number>(-1);
     const [watchListItems, setWatchListItems] = useState<IWatchListItem[]>([]);

     const router = useRouter();

     let addingStarted = false;

     // When you go to add a WL, if you forgot to add the WLI, the Add Link will show the search so you can add it immediately. This only applies to adding a WL, not editing one.
     /*const addNewChangeHandler = () => {
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
     };*/

     const addWatchListDetailChangeHandler = (fieldName: string, fieldValue: string | number | boolean) => {
          const newAddWatchListDtl = { ...addWatchListDtl } as IWatchList;

          if (fieldName === "Archived") {
               newAddWatchListDtl[fieldName] = fieldValue === true ? 1 : 0;
          } else {
               newAddWatchListDtl[fieldName] = fieldValue;
          }

          newAddWatchListDtl.IsModified = 1;

          setAddWatchListDtl(newAddWatchListDtl);

          setAddModified(true);
     };

     const autoCompleteChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (event.target.innerText === "") {
               return;
          }

          const watchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
               let itemName = watchListItem.WatchListItemName + (typeof watchListItem?.Year !== "undefined" ? ` (${watchListItem.Year})` : ``);


               if (watchListItems?.filter((watchListItemDupe: IWatchListItem) => {
                    return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
               }).length > 1) {
                    itemName += ` (${watchListItem.WatchListTypeName})`;
               }

               return itemName === event.target.innerText;
          });

          if (watchListItem.length === 1) {
               if (isAdding) {
                    const newAddWatchListDtl = { ...addWatchListDtl } as IWatchList;
                    newAddWatchListDtl["WatchListItemID"] = watchListItem[0].WatchListItemID;
                    newAddWatchListDtl["WatchListItem"] = watchListItem[0];
                    setAddWatchListDtl(newAddWatchListDtl);
                    setAddModified(true);
               } else if (isEditing) {
                    const newWatchListDtl = { ...watchListDtl } as IWatchList;
                    newWatchListDtl.WatchListItemID = watchListItem[0].WatchListItemID;
                    newWatchListDtl["WatchListItem"] = watchListItem[0];
                    newWatchListDtl.WatchListItemName = watchListItem[0].WatchListItemName;
                    newWatchListDtl.WatchListTypeName = watchListItem[0].WatchListTypeName;
                    newWatchListDtl.IMDB_Poster = watchListItem[0].IMDB_Poster;
                    newWatchListDtl.IMDB_URL = watchListItem[0].IMDB_URL;

                    if (typeof newWatchListDtl.Season !== "undefined" && watchListItem[0].WatchListTypeID !== 2) {
                         delete newWatchListDtl.Season;
                    } else {
                         newWatchListDtl.Season = 1;
                    }

                    newWatchListDtl.Rating = 0;
                    newWatchListDtl.Notes = "";
                    newWatchListDtl.Archived = 0;


                    newWatchListDtl[`WatchListItemIDIsModified`] = 1;
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
          setIsAdding(false);
          setAddWatchListDtl(null);
          setWatchListDtl(null);
          setOriginalWatchListDtl(null);

          if (addModified || editModified || watchListDtlID !== null || watchListItemDtlID !== null) {
               getWatchList();
          }

          pullToRefreshEnabled(true);

          setIsLoading(false);
          setIsClosing(true);
     };

     const getLocaleDate = useCallback(() => {
          const dateSpl = currentDate.split("/");

          if (navigator.languages.includes("en-US")) { // Date is in format mm/dd/yyyy
               return `${dateSpl[2]}-${dateSpl[0].padStart(2, '0')}-${dateSpl[1].padStart(2, '0')}`;
          } else { // Date is in format dd/mm/yyyy
               try {
                    return `${dateSpl[2]}-${dateSpl[1].padStart(2, '0')}-${dateSpl[0].padStart(2, '0')}`;
               } catch (e: any) {
                    return "";
               }
          }
     }, [currentDate]);

     const getWatchListDtl = async (watchListDtlID: number) => {
          try {
               const getWatchListDtlResponse = await fetch(`/api/GetWatchListDtl?WatchListID=${watchListDtlID}`, { credentials: 'include' });

               const getWatchListDtlResult = await getWatchListDtlResponse.json();

               if (getWatchListDtlResult[0] === "ERROR") {
                    alert(`The error ${getWatchListDtlResult[1]} occurred while getting the detail`);
                    return;
               }

               // Sanitize object by replacing all fields with null
               const wld = getWatchListDtlResult[1];

               if (typeof wld !== "undefined" && wld !== null && wld.length > 0) {
                    const tooltipFields = [
                         {
                              displayName: "Rated",
                              fieldName: "Rated"
                         },
                         {
                              displayName: "Year",
                              fieldName: "Year"
                         },
                         {
                              displayName: "IMDB Rating",
                              fieldName: "imdbRating"
                         },
                         {
                              displayName: "Genre",
                              fieldName: "Genre"
                         },
                         {
                              displayName: "Runtime",
                              fieldName: "Runtime"
                         },
                         {
                              displayName: "Release Date",
                              fieldName: "Released"
                         },
                         {
                              displayName: "Director",
                              fieldName: "Director"
                         },
                         {
                              displayName: "Plot",
                              fieldName: "Plot"
                         },
                    ];

                    let tooltip = ``;

                    for (let i = 0; i < Object.keys(tooltipFields).length; i++) {
                         if (typeof wld?.[tooltipFields[i].fieldName] !== "undefined") {
                              tooltip += `${wld?.[tooltipFields[i].displayName]}: ${wld?.[tooltipFields[i].fieldName]}`;
                         }
                    }

                    setWatchListDtl(wld[0]);

                    setWatchListDtlLoadingCheck(APIStatus.Success);

                    setModalVisible(true);
               } else {
                    alert("Unable to get the WatchList with ID " + watchListDtlID);
                    closeDetail();
               }
          } catch (e: any) {
               alert(e.message);
          }
     }

     const getWatchListItems = async () => {
          try {
               const getAllWatchListItemsResponse = await fetch(`/api/GetWatchListItems?AllData=true`, { credentials: 'include' });

               const getAllWatchListItemsResult = await getAllWatchListItemsResponse.json();

               if (getAllWatchListItemsResult[0] !== "OK") {
                    alert("Failed to get WatchList Items with the error " + getAllWatchListItemsResult[1]);
                    return;
               }

               setWatchListItems(getAllWatchListItemsResult[1]);

               // Generate names for auto complete
               const namesOnlyItems: IAutoCompleteOption[] = getAllWatchListItemsResult[1].map((watchListItem: IWatchListItem) => {
                    let itemName = watchListItem.WatchListItemName + (typeof watchListItem?.Year !== "undefined" ? ` (${watchListItem?.Year})` : ``);


                    if (getAllWatchListItemsResult[1]?.filter((watchListItemDupe: IWatchListItem) => {
                         return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
                    }).length > 1) {
                         itemName += ` (${watchListItem.WatchListTypeName})`;
                    }

                    return { name: itemName, id: watchListItem.WatchListItemID };
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

               const uniqueNames: IAutoCompleteOption[] = [];
               const duplicateMessages: string[] = [];

               namesSorted.forEach((item, index) => {
                    if (uniqueNames.filter((seenName: IAutoCompleteOption) => String(seenName.name) === String(item.name)).length > 0) {
                         duplicateMessages.push(`Duplicate found for "${item.name}"`);
                    }

                    if (item.name !== "undefined") {
                         uniqueNames.push(item);
                    }
               });

               if (duplicateMessages.length > 0) {
                    writeLog(duplicateMessages.join("\n"));
               }

               setFormattedNames(uniqueNames);

               setDefaultProps({
                    options: uniqueNames,
                    getOptionLabel: (option: IAutoCompleteOption) => option?.name.toString(),
               });

               const namesWithIdItems = getAllWatchListItemsResult[1]
                    .filter((watchListItem: IWatchListItem) => {
                         return typeof watchListItem.WatchListItemName !== "undefined" && watchListItem.WatchListItemName !== "" && watchListItem.WatchListItemName !== null
                    }).map((watchListItem: IWatchListItem) => {
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
                    const nameA = a.WatchListItemName?.toLowerCase().trim();
                    const nameB = b.WatchListItemName?.toLowerCase().trim();

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
          } catch (e: any) {
               alert("Failed to get WatchList Items with the error " + e.message);
               return;
          }
     }

     const getWatchListTypeID = (watchListItemID: number) => {
          const results = watchListItems?.filter((watchListItem: IWatchListItem) => {
               return String(watchListItem.WatchListItemID) === String(watchListItemID);
          });

          if (results.length === 1) {
               return String(results[0].WatchListTypeID);
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

     const reloadImageClickHandler = async (watchListItemID: number) => {
          const result = await getMissingPoster(watchListItemID);

          if (Array.isArray(result) && result.length > 0 && result[0]["Status"] === "OK") {
               const newWatchListDtl = { ...watchListDtl } as IWatchList;
               newWatchListDtl["IMDB_Poster"] = result[0].IMDB_Poster;

               setWatchListDtl(newWatchListDtl);

               const queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListDtl?.WatchListItemID}&IMDB_Poster=${result[0].IMDB_Poster}`;

               try {
                    const reloadImageResponse = await fetch(queryURL, { method: 'PUT', credentials: 'include' });

                    await reloadImageResponse.json();

                    getWatchListItems();
               } catch (e: any) {
                    writeLog(e.message);
               }
          }
     }

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

               if (typeof addWatchListDtl.EndDate !== "undefined" && addWatchListDtl.EndDate !== null && addWatchListDtl.EndDate !== "" && new Date(addWatchListDtl.EndDate) < new Date(addWatchListDtl.StartDate)) {
                    alert("The end date must be later than the start date");
                    return;
               }

               if (getWatchListTypeID(addWatchListDtl.WatchListItemID) === "2" && typeof addWatchListDtl.Season !== "undefined" && addWatchListDtl.Season === 0) {
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

               try {
                    const saveNewWatchListResponse = await fetch(queryURL, { method: 'PUT', credentials: 'include' });

                    const saveNewWatchListResult = await saveNewWatchListResponse.json();

                    if (saveNewWatchListResult[0] === "ERROR") {
                         alert(`The error ${saveNewWatchListResult[1]} occurred while adding the detail`);
                    } else {
                         setIsAdding(false);
                         getWatchList();
                         addingStarted = false;

                         if (typeof addWatchListDtl.EndDate !== "undefined" && !stillWatching) {
                              setStillWatching(true);
                         }

                         router.push("/WatchList");

                         setIsClosing(true);
                    }
               } catch (e: any) {
                    alert(`The error ${e.message} occurred while adding the detail`);
               }
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
               const newAddWatchListDtl = { ...addWatchListDtl } as IWatchList;

               newAddWatchListDtl["IMDB_Poster_Error"] = true;

               setAddWatchListDtl(newAddWatchListDtl);
          } else {
               const newWatchListDtl = { ...watchListDtl } as IWatchList;

               newWatchListDtl["IMDB_Poster_Error"] = true;
               setWatchListDtl(newWatchListDtl);
          }
     };

     const updateWatchList = async (silent: boolean) => {
          if (watchListDtl !== null) {
               if (watchListDtl.WatchListItemID === -1) {
                    alert("Please select the Movie or TV Show");
                    return;
               }

               if (watchListDtl.StartDate === "" && watchListDtl.Archived !== 1) {
                    alert("Please enter the start date");
                    return;
               }

               if (typeof watchListDtl.EndDate !== "undefined" && watchListDtl.EndDate !== null && watchListDtl.EndDate !== "" && new Date(watchListDtl.EndDate) < new Date(watchListDtl.StartDate)) {
                    alert("The end date must be later than the start date");
                    return;
               }

               if (getWatchListTypeID(watchListDtl.WatchListItemID) === "2" && typeof watchListDtl.Season !== "undefined" && watchListDtl.Season === 0) {
                    alert("Please enter the season");
                    return;
               }

               if (watchListDtl.WatchListSourceID === -1) {
                    alert("Please select the source");
                    return;
               }

               let queryURL = ``;

               if (watchListDtl.WatchListItemIDIsModified === 1) {
                    queryURL += `&WatchListItemID=${watchListDtl.WatchListItemID}`;
               }

               if (watchListDtl.WatchListSourceIDIsModified === 1) {
                    queryURL += `&WatchListSourceID=${watchListDtl.WatchListSourceID}`;
               }

               if (watchListDtl.StartDateIsModified === 1) {
                    // Fix start date formatting
                    if (watchListDtl.StartDate.toString().indexOf("-") === -1) {
                         watchListDtl.StartDate = `${watchListDtl.StartDate.substring(0, 4)}-${watchListDtl.StartDate.substring(4, 6)}-${watchListDtl.StartDate.substring(6, 8)}`;
                    }

                    queryURL += `&StartDate=${watchListDtl.StartDate}`;
               }

               if (watchListDtl.EndDateIsModified === 1) {
                    // Fix end date formatting
                    if (watchListDtl.EndDate.toString().indexOf("-") === -1) {
                         watchListDtl.EndDate = `${watchListDtl.EndDate.substring(0, 4)}-${watchListDtl.EndDate.substring(4, 6)}-${watchListDtl.EndDate.substring(6, 8)}`;
                    }

                    queryURL += `&EndDate=${watchListDtl.EndDate.substring(0, 10)}`;
               }

               if (watchListDtl.SeasonIsModified === 1) {
                    queryURL += `&Season=${watchListDtl.Season}`;
               }

               if (watchListDtl.ArchivedIsModified === 1) {
                    queryURL += `&Archived=${watchListDtl.Archived}`;
               }

               if (watchListDtl.RatingIsModified === 1) {
                    queryURL += `&Rating=${watchListDtl.Rating}`;
               }

               if (watchListDtl.NotesIsModified === 1) {
                    queryURL += `&Notes=${watchListDtl.Notes}`;
               }

               if (queryURL != "") {
                    queryURL = `/api/UpdateWatchList?WatchListID=${watchListDtl.WatchListID}${queryURL}`;

                    try {
                         const updateWatchListResponse = await fetch(queryURL, { method: 'PUT', credentials: 'include' });

                         const updateWatchListResult = await updateWatchListResponse.json();

                         if (updateWatchListResult[0] === "ERROR" && !silent) {
                              alert(`The error ${updateWatchListResult[1]} occurred while updating the detail`);
                         } else {
                              setIsEditing(false);
                         }
                    } catch (e: any) {
                         alert(e.message);
                    }
               } else {
                    setIsEditing(false);
               }
          }
     }

     const watchListDetailChangeHandler = (fieldName: string, fieldValue: boolean | string | number) => {
          const newWatchListDtl = { ...watchListDtl } as IWatchList;

          if (fieldName === "Archived") {
               newWatchListDtl[fieldName] = fieldValue === true ? 1 : 0;
          } else if (fieldName === "Rating") {
               newWatchListDtl[fieldName] = parseFloat(fieldValue as string);
          } else {
               newWatchListDtl[fieldName] = fieldValue;
          }

          newWatchListDtl[`${fieldName}IsModified`] = 1;

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
                         newWatchListDtl.WatchListItemID = watchListItem[0].WatchListItemID;
                         newWatchListDtl["WatchListItem"] = watchListItem[0];
                         newWatchListDtl.WatchListItemName = watchListItem[0].WatchListItemName;
                         newWatchListDtl.WatchListTypeName = watchListItem[0].WatchListTypeName;
                         newWatchListDtl.IMDB_Poster = watchListItem[0].IMDB_Poster;
                         newWatchListDtl.IMDB_URL = watchListItem[0].IMDB_URL;

                         if (typeof newWatchListDtl.Season !== "undefined" && watchListItem[0].WatchListTypeID !== 2) {
                              delete newWatchListDtl.Season;
                         } else {
                              newWatchListDtl.Season = 1;
                         }

                         newWatchListDtl.Rating = 0;
                         newWatchListDtl.Notes = "";
                         newWatchListDtl.Archived = 0;
                    }
               }
          }

          setWatchListDtl(newWatchListDtl);

          setEditModified(true);
     };

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

               getWatchListDtl(watchListDtlID);
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
          } else if (watchListItemDtlID !== -1) {
               setModalVisible(true);
               setIsLoading(false);
               setWatchListDtlLoadingCheck(APIStatus.Success);
               setIsAdding(true);
          }
     }, [demoMode, getLocaleDate, isAdding, setErrorMessage, watchListDtl, watchListDtlID, watchListDtlLoadingCheck, watchListItemDtlID]);

     useEffect(() => {
          if (formattedNames.length == 0) {
               getWatchListItems();
          } else {
               setFormattedNamesLoadingComplete(APIStatus.Success);
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
               setModalVisible(false);
               router.push("/WatchList");
          }
     }, [isClosing, router]);

     const addingImage = !isAdding ? null : watchListItems?.filter((currentWatchListItem: IWatchListItem) => String(currentWatchListItem?.WatchListItemID) === String(addWatchListDtl?.WatchListItemID));

     const editing = isAdding || isEditing;
     const view = !isAdding && !isEditing && !isClosing;
     const src = isAdding ? addWatchListDtl : watchListDtl;
     const setField = isAdding ? addWatchListDetailChangeHandler : watchListDetailChangeHandler;
     const isSeries = isAdding
          ? !!addWatchListDtl && addWatchListDtl.WatchListItemID !== -1 && getWatchListTypeID(addWatchListDtl.WatchListItemID) === "2"
          : String(watchListDtl?.WatchListTypeID) === "2";
     const canReloadImage = (isEditing ? typeof watchListDtl !== "undefined" : watchListDtl !== null) &&
          imageIsValid(watchListDtl?.IMDB_Poster, watchListDtl?.IMDB_Poster_Error);

     return (
          <>
               {!isClosing && watchListDtlLoadingCheck === APIStatus.Success &&
                    formattedNamesLoadingComplete && formattedNames.length > 0 &&
                    defaultProps !== null && modalVisible && (
                         <div className="wl-modal">
                              <div className={`wl-modal-content ${watchListDtlID != null ? "wl-fade-in" : ""}`}>

                                   {/* action icons live here, right-aligned, so they never push the name */}
                                   <div className="wl-toolbar">
                                        {!editing && watchListDtl && (
                                             <span className="wl-action" onClick={startEditing}>{EditIconComponent}</span>
                                        )}
                                        {editing && (
                                             <span className="wl-action" onClick={isAdding ? saveNewClickHandler : saveClickHandler}>
                                                  {SaveIconComponent}
                                             </span>
                                        )}
                                        {editing
                                             ? <span className="wl-action wl-cancel" onClick={isAdding ? closeDetail : cancelClickHandler}>{CancelIconComponent}</span>
                                             : <span className="wl-action wl-close" onClick={closeDetail}>X</span>}
                                   </div>

                                   {!recommendationsVisible ? (
                                        <div className="wl-form">
                                             {/* poster + id only */}
                                             <div className="wl-poster-row">
                                                  <div className="wl-poster">
                                                       {!isAdding && (
                                                            imageIsValid(watchListDtl?.IMDB_Poster, watchListDtl?.IMDB_Poster_Error)
                                                                 ? <Image className="wl-poster-img" width={imageWidth * 1.5} height={imageHeight * 1.2}
                                                                      alt="Image Not Available" src={watchListDtl?.IMDB_Poster} onError={() => showDefaultSrc()} />
                                                                 : <div className="wl-poster-placeholder">{BrokenImageIconComponent}</div>
                                                       )}
                                                       {isAdding && addWatchListDtl && addingImage.length === 1 &&
                                                            addingImage[0].IMDB_Poster !== "N/A" &&
                                                            (addingImage[0].IMDB_Poster?.toString()?.startsWith("http")) && (
                                                                 <Image className="wl-poster-img" width={imageWidth} height={imageHeight}
                                                                      alt="Image Not Available" src={addingImage[0].IMDB_Poster ?? ""} />
                                                            )}
                                                  </div>
                                             </div>

                                             {!isAdding &&
                                                  <FieldRow label="ID:">
                                                       <div className="wl-id">{watchListDtl?.WatchListID}</div>
                                                  </FieldRow>
                                             }

                                             {editing && (
                                                  <FieldRow label="">
                                                       <select className="wl-select"
                                                            value={src?.WatchListItemID}
                                                            onChange={(e) => setField("WatchListItemID", e.target.value)}>
                                                            <option value="-1">Please select</option>
                                                            {(isAdding
                                                                 ? formattedNamesWithId
                                                                 : watchListItems?.sort((a: IWatchListItem, b: IWatchListItem) =>
                                                                      String(a.WatchListItemName) > String(b.WatchListItemName)
                                                                           ? (watchListSortDirection === "ASC" ? 1 : -1)
                                                                           : (watchListSortDirection === "ASC" ? -1 : 1)
                                                                 )
                                                            )?.map((it: IWatchListItem, i: number) => (
                                                                 <option key={i} value={it?.WatchListItemID}>{it?.WatchListItemName}</option>
                                                            ))}
                                                       </select>
                                                  </FieldRow>
                                             )}

                                             <FieldRow label="Name:">
                                                  {view ? (
                                                       watchListDtl?.IMDB_URL !== undefined
                                                            ? <a className="wl-link" href={watchListDtl.IMDB_URL} target="_blank" rel="noreferrer">
                                                                 {watchListDtl.WatchListItemName}
                                                            </a>
                                                            : <span className="wl-name-view" title={watchListDtl?.Tooltip}>{watchListDtl?.WatchListItemName}</span>
                                                  ) : (
                                                       <Autocomplete
                                                            id="wl_autocomplete"
                                                            size="small"
                                                            sx={{ width: "100%", maxWidth: 360, height: 40 }}
                                                            {...defaultProps}
                                                            options={formattedNames}
                                                            value={autoComplete}
                                                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => autoCompleteChangeHandler(event)}
                                                            renderInput={(params: TextFieldProps) => <TextField {...params} label="Search" />}
                                                       />
                                                  )}
                                                  {view && watchListDtl?.Archived === 1 && <span className="wl-archived">&nbsp;(A)</span>}
                                             </FieldRow>

                                             <FieldRow label="Start Date:">
                                                  {view
                                                       ? <span>{watchListDtl?.StartDate}</span>
                                                       : <input type="date" value={src?.StartDate ?? ""} onChange={(e) => setField("StartDate", e.target.value)} />}
                                             </FieldRow>

                                             <FieldRow label="End Date:">
                                                  {view
                                                       ? <span>{watchListDtl?.EndDate}</span>
                                                       : <input type="date" value={src?.EndDate ?? ""} onChange={(e) => setField("EndDate", e.target.value)} />}
                                             </FieldRow>

                                             <FieldRow label="Source:">
                                                  {view
                                                       ? <div>{watchListDtl?.WatchListSourceName}</div>
                                                       : <select className="wl-select" value={src?.WatchListSourceID}
                                                            onChange={(e) => setField("WatchListSourceID", e.target.value)}>
                                                            <option value="-1">Please select</option>
                                                            {watchListSources
                                                                 ?.filter((s: IWatchListSource) => isAdding ? s.Enabled === 1 : (s.Enabled === 1 || demoMode))
                                                                 .map((s: IWatchListSource, i: number) => (
                                                                      <option key={i} value={s?.WatchListSourceID}>{s?.WatchListSourceName}</option>
                                                                 ))}
                                                       </select>}
                                             </FieldRow>

                                             {isSeries && (
                                                  <FieldRow label="Season:">
                                                       {view
                                                            ? <div>{watchListDtl?.Season}</div>
                                                            : <input type="number" value={src?.Season ?? ""} onChange={(e) => setField("Season", e.target.value)} />}
                                                  </FieldRow>
                                             )}

                                             <FieldRow label="Notes:">
                                                  {view
                                                       ? <div className="wl-notes-view">{watchListDtl?.Notes}</div>
                                                       : <input type="text" value={src?.Notes || ""} onChange={(e) => setField("Notes", e.target.value)} />}
                                             </FieldRow>

                                             <FieldRow label="Rating:">
                                                  {view ? (
                                                       <span className="wl-rating">
                                                            {watchListDtl && watchListDtl?.Rating !== null && watchListDtl?.Rating.toString() !== "" ? (
                                                                 <Rating name="hover-feedback" disabled value={watchListDtl?.Rating} precision={0.5} />
                                                            ) : (
                                                                 <span>Not Rated</span>
                                                            )}
                                                       </span>
                                                  ) : (
                                                       <span className="wl-rating">
                                                            <Rating
                                                                 name="hover-feedback"
                                                                 value={watchListDtl?.Rating}
                                                                 sx={{ padding: 1, "& .MuiRating-iconEmpty": { color: "white" } }}
                                                                 precision={0.5}
                                                                 emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
                                                                 onChange={(_e, newValue) => setField("Rating", String(newValue))}
                                                            />
                                                       </span>
                                                  )}
                                             </FieldRow>

                                             {editing && (
                                                  <FieldRow label="Archive:">
                                                       <input type="checkbox" checked={src?.Archived === 1}
                                                            onChange={(e) => setField("Archived", e.target.checked)} />
                                                  </FieldRow>
                                             )}

                                             <div className="wl-inline-actions">
                                                  {view && recommendationsEnabled && (
                                                       <span className="wl-link" onClick={recommendationsClickHandler}>Recommendations</span>
                                                  )}
                                                  {canReloadImage && (
                                                       <span className="wl-link"
                                                            onClick={() => reloadImageClickHandler(isAdding ? addWatchListDtl.WatchListItemID : watchListDtl.WatchListItemID)}>
                                                            Reload Image
                                                       </span>
                                                  )}
                                             </div>
                                        </div>
                                   ) : (
                                        <Recommendations queryTerm={recommendationName} type={recommendationType}
                                             setRecommendationName={setRecommendationName}
                                             setRecommendationType={setRecommendationName}
                                             setRecommendationsVisible={setRecommendationsVisible} />
                                   )}
                              </div>
                         </div>
                    )}
          </>
     );
}