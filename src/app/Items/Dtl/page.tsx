"use client"

import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import Recommendations from "../../components/Recommendations";
import { APIStatus, ItemsDtlContext } from "../../data-context";
import IWatchListItem from "../../interfaces/IWatchListItem";
import IWatchListType from "../../interfaces/IWatchListType";
import { ItemsDtlContextType } from "@/app/interfaces/contexts/ItemsDtlContextType";

export default function ItemsDtl() {
     const {
          BrokenImageIconComponent, CancelIconComponent, EditIconComponent, SaveIconComponent, darkMode, demoMode, getMissingPoster, getWatchListItems, isAdding, isEditing, isEnabled, isLoading, pullToRefreshEnabled, setErrorMessage, setIsAdding, setIsEditing, setIsError, watchListTypes
     } = useContext(ItemsDtlContext) as ItemsDtlContextType

     const [addWatchListItemDtl, setAddWatchListItemDtl] = useState<IWatchListItem | null>();
     const [editModified, setEditModified] = useState(false);
     const [addModified, setAddModified] = useState(false);
     const [isClosing, setIsClosing] = useState(false);
     const [originalWatchListItemDtl, setOriginalWatchListItemDtl] = useState<IWatchListItem | null>();
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState<string>("");
     const [recommendationType, setRecommendationType] = useState("");
     const [watchListItemDtl, setWatchListItemDtl] = useState<IWatchListItem | null>();
     const [watchListItemDtlLoadingCheck, setWatchListItemDtlLoadingCheck] = useState(APIStatus.Idle);
     const [watchListItemDtlID, setWatchListItemDtlID] = useState<number>(-1);

     const router = useRouter();

     const addWatchListItemDetailChangeHandler = (fieldName: string, fieldValue: number | string) => {
          const newAddWatchListItemDtl = Object.assign({}, addWatchListItemDtl);

          newAddWatchListItemDtl[fieldName] = fieldValue;
          newAddWatchListItemDtl.IsModified = true;

          setAddWatchListItemDtl(newAddWatchListItemDtl);
     };

     const cancelClickHandler = async () => {
          setIsEditing(false);
          setWatchListItemDtl(originalWatchListItemDtl);
          setOriginalWatchListItemDtl(null);
          setAddModified(false);
          setEditModified(false);
     };

     const checkURL = async (URL: string) => {
          const result = await axios.get(URL)
               .then(() => {
                    return true;
               })
               .catch(() => {
                    return false;
               });

          return result;
     };

     const closeDetail = async () => {
          setAddWatchListItemDtl(null);
          setWatchListItemDtl(null);
          setOriginalWatchListItemDtl(null);

          if (addModified || editModified) {
               getWatchListItems();
          }

          pullToRefreshEnabled(true);

          setIsClosing(true);
     };

     const onIMDBPosterChangeHandler = async (URL: string) => {
          const result = await checkURL(URL);

          if (isAdding) {
               const newAddWatchListItemDtl = Object.assign([], addWatchListItemDtl);

               newAddWatchListItemDtl["IMDB_Poster_Error"] = !result;

               setAddWatchListItemDtl(newAddWatchListItemDtl);
          } else {
               const newWatchListItemDtl = Object.assign([], watchListItemDtl);
               newWatchListItemDtl["IMDB_Poster_Error"] = !result;
               setWatchListItemDtl(newWatchListItemDtl);
          }
     };

     const recommendationsClickHandler = () => {
          const name = watchListItemDtl?.WatchListItemName;

          if (watchListItemDtl?.WatchListTypeName !== null) {
               setRecommendationName(typeof name !== "undefined" ? name : "");
               setRecommendationType(typeof watchListItemDtl?.WatchListTypeName !== "undefined" ? watchListItemDtl?.WatchListTypeName : "");
          }
     };

     const reloadImageClickHandler = async (watchListItemID: number) => {
          const result = await getMissingPoster(watchListItemID);

          if (result !== null && result[0].Status === "OK") {
               const newWatchListItemDtl = Object.assign([], watchListItemDtl);
               newWatchListItemDtl["IMDB_Poster"] = result[0].IMDB_Poster;

               setWatchListItemDtl(newWatchListItemDtl);

               const queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemDtl?.WatchListItemID}&IMDB_Poster=${result[0].IMDB_Poster}`;

               axios.put(queryURL)
                    .then((res: AxiosResponse<IWatchListItem>) => {
                         getWatchListItems();
                    })
                    .catch((err: Error) => {
                         //alert(`The error ${err.message} occurred while updating the item detail`);
                    });
          }
     }

     const saveClickHandler = async () => {
          if (demoMode) {
               alert("Saving is disabled in demo mode");
               return;
          }

          if (!editModified) {
               setIsEditing(false);
               return;
          }

          if (watchListItemDtl !== null) {
               if (watchListItemDtl?.WatchListItemName === "") {
                    alert("Please enter the name of the Movie or TV Show");
                    return;
               }

               let queryURL = ``;

               if (watchListItemDtl?.WatchListItemNameIsModified === true) {
                    queryURL += `&WatchListItemName=${watchListItemDtl.WatchListItemName}`;
               }

               if (watchListItemDtl?.WatchListTypeIDIsModified === true) {
                    queryURL += `&WatchListTypeID=${watchListItemDtl.WatchListTypeID}`;
               }

               if (watchListItemDtl?.IMDB_URLIsModified === true) {
                    queryURL += `&IMDB_URL=${watchListItemDtl.IMDB_URL}`;
               }

               if (watchListItemDtl?.IMDB_PosterIsModified === true) {
                    queryURL += `&IMDB_Poster=${watchListItemDtl.IMDB_Poster}`;
               }

               if (watchListItemDtl?.ItemNotesIsModified === true) {
                    queryURL += `&ItemNotes=${watchListItemDtl.ItemNotes}`;
               }

               if (watchListItemDtl?.ArchivedIsModified === true) {
                    queryURL += `&Archived=${watchListItemDtl.Archived}`;
               }

               if (queryURL != "") {
                    queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemDtl?.WatchListItemID}${queryURL}`;

                    axios.put(queryURL)
                         .then((res: AxiosResponse<IWatchListItem>) => {
                              if (res.data[0] === "ERROR") {
                                   alert(`The error ${res.data[1]} occurred while updating the item detail`);
                              } else {
                                   // Update type name if needed
                                   if (watchListItemDtl?.WatchListTypeIDIsModified === true) {
                                        const result = watchListTypes?.filter((currentWatchList: IWatchListType) => {
                                             return String(currentWatchList.WatchListTypeID) === String(watchListItemDtl["WatchListTypeID"]);
                                        });

                                        if (result.length !== 1) {
                                             alert("Unable to update type name");
                                             return;
                                        }

                                        const newWatchListItemDtl = Object.assign({}, watchListItemDtl);

                                        newWatchListItemDtl["WatchListTypeName"] = result[0].WatchListTypeName;

                                        setWatchListItemDtl(newWatchListItemDtl);
                                   }

                                   setIsEditing(false);

                                   setEditModified(true);
                              }
                         })
                         .catch((err: Error) => {
                              alert(`The error ${err.message} occurred while updating the item detail`);
                         });
               } else {
                    alert("query params is empty in saveClickHandler()");
                    return;
               }
          } else {
               setIsEditing(false);

               setEditModified(true);
          }
     };

     const saveNewClickHandler = async () => {
          if (demoMode) {
               alert("Saving is disabled in demo mode");
               return;
          }

          if (addWatchListItemDtl?.WatchListItemName === "") {
               alert("Please enter the item name");
               return;
          }

          if (addWatchListItemDtl?.WatchListTypeID === -1) {
               alert("Please select the type");
               return;
          }

          if (addWatchListItemDtl?.IMDB_URL === "") {
               alert("Please enter the IMDB URL");
               return;
          }

          let queryURL = `/api/AddWatchListItem?WatchListItemName=${addWatchListItemDtl?.WatchListItemName}&WatchListTypeID=${addWatchListItemDtl?.WatchListTypeID}&IMDB_URL=${addWatchListItemDtl?.IMDB_URL}&Archived=${addWatchListItemDtl?.Archived}`;

          if (addWatchListItemDtl?.IMDB_Poster !== "") {
               queryURL += `&IMDB_Poster=${addWatchListItemDtl?.IMDB_Poster}`;
          }

          if (addWatchListItemDtl?.ItemNotes !== "") {
               queryURL += `&ItemNotes=${addWatchListItemDtl?.ItemNotes}`;
          }

          axios.put(queryURL).then((res: AxiosResponse<IWatchListItem>) => {
               if (res.data[0] === "ERROR") {
                    alert(`The error ${res.data[1]} occurred while adding the detail`);
               } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
                    alert(res.data[1]);
               } else {
                    setAddModified(true);

                    setIsAdding(false);

                    const addNewWatchListPrompt = confirm("Do you want to add a new WatchList record now ?");

                    if (addNewWatchListPrompt) {
                         setIsAdding(true);
                         router.push(`/WatchList/Dtl?WatchListItemID=${res.data[1]}`);
                         getWatchListItems();
                    }
               }
          })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the detail`);
               });
     };

     const showDefaultSrc = () => {
          if (isAdding) {
               const newAddWatchListItemDtl = Object.assign([], addWatchListItemDtl);

               newAddWatchListItemDtl["IMDB_Poster_Error"] = true;

               setAddWatchListItemDtl(newAddWatchListItemDtl);
          } else {
               const newWatchListItemDtl = Object.assign([], watchListItemDtl);

               newWatchListItemDtl["IMDB_Poster_Error"] = true;

               setWatchListItemDtl(newWatchListItemDtl);
          }
     };

     const startEditing = () => {
          setOriginalWatchListItemDtl(watchListItemDtl);
          setIsEditing(!isEditing);
     };

     const watchListItemDetailChangeHandler = (fieldName: string, fieldValue: boolean | string) => {
          const newWatchListItemDtl: IWatchListItem = Object.assign({}, watchListItemDtl);

          newWatchListItemDtl[fieldName] = fieldValue;
          newWatchListItemDtl[`${fieldName}IsModified`] = true;

          if (!editModified) {
               setEditModified(true);
          }

          setWatchListItemDtl(newWatchListItemDtl);
     };

     useEffect(() => {
          if (!isAdding && watchListItemDtlLoadingCheck === APIStatus.Idle && watchListItemDtlID !== null && watchListItemDtlID !== -1 && watchListItemDtl == null) {
               setWatchListItemDtlLoadingCheck(APIStatus.Loading);

               if (demoMode) {
                    const demoWatchListItemPayload = require("../../demo/index").demoWatchListItemsPayload;

                    const detailWatchListItem = demoWatchListItemPayload.filter((currentWatchList: IWatchListItem) => {
                         return String(currentWatchList.WatchListItemID) === String(watchListItemDtlID);
                    });

                    // This should never happen
                    if (detailWatchListItem.length !== 1) {
                         alert("Unable to get the detail");
                         return;
                    }

                    setWatchListItemDtl(detailWatchListItem[0]);
                    setWatchListItemDtlLoadingCheck(APIStatus.Success);

                    return;
               }

               axios.get(`/api/GetWatchListItemDtl?WatchListItemID=${watchListItemDtlID}`)
                    .then((res: AxiosResponse<IWatchListItem>) => {
                         setWatchListItemDtlLoadingCheck(APIStatus.Success);

                         if (res.data[0] === "ERROR") {
                              setErrorMessage(`The error ${res.data[1]} occurred while getting the item detail`);
                              setIsError(true);
                              return;
                         } else {
                              // Sanitize object by replacing all null fields with "". There are issues with binding to input fields when the value is null
                              const wlid = res.data[1];

                              if (wlid[0]?.IMDB_JSON !== null && typeof wlid[0]?.IMDB_JSON !== "undefined") {
                                   const IMDB_JSON = (JSON.parse(wlid[0]?.IMDB_JSON));

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

                                   wlid[0].Tooltip = tooltip;
                              }

                              Object.keys(wlid[0]).map((keyName) => {
                                   if (wlid[0][keyName] === null) {
                                        wlid[0][keyName] = "";
                                   }
                              });

                              setWatchListItemDtl(wlid[0]);

                              setWatchListItemDtlLoadingCheck(APIStatus.Success);
                         }
                    })
                    .catch((err: Error) => {
                         setErrorMessage(`The fatal error ${err.message} occurred while getting the item detail`);
                         setIsError(true);
                    });
          } else if (isAdding && watchListItemDtlID === -1) {
               const newAddWatchListItemDtl: IWatchListItem = { WatchListItemID: 0, WatchListItemName: "", WatchListTypeID: -1, WatchListTypeName: "", IMDB_URL: "", IMDB_Poster: "", ItemNotes: "", Archived: 0 };
               newAddWatchListItemDtl.WatchListItemName = "";
               newAddWatchListItemDtl.WatchListTypeID = -1;
               newAddWatchListItemDtl.IMDB_URL = "";
               newAddWatchListItemDtl.IMDB_Poster = "";
               newAddWatchListItemDtl.ItemNotes = "";

               setAddWatchListItemDtl(newAddWatchListItemDtl);

               setWatchListItemDtlLoadingCheck(APIStatus.Success);
          }
     }, [demoMode, isAdding, setErrorMessage, setIsError, watchListItemDtlLoadingCheck, watchListItemDtl, watchListItemDtlID]);

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

                    if (paramSpl[0] === "WatchListItemID" && paramSpl[1] !== "") {
                         setWatchListItemDtlID(parseInt(paramSpl[1], 10));
                    }
               }
          }
     }, []);

     useEffect(() => {
          if (isClosing) {
               if (isEnabled("Items")) {
                    router.push("/Items");
               } else {
                    router.push("/WatchList");
               }
          }
     }, [isClosing, isEnabled, router]);

     return (
          <>
               {!isLoading && !isClosing && watchListItemDtlLoadingCheck === APIStatus.Success &&
                    <div className="modal">
                         <div className={`modal-content ${watchListItemDtlID != null ? "fade-in" : ""}${!darkMode ? " lightMode" : " darkMode"}`}>
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
                                                       <span className={`clickable saveIcon ${!darkMode ? " lightMode" : " darkMode"}`} onClick={isAdding ? saveNewClickHandler : saveClickHandler}>
                                                            {SaveIconComponent}
                                                       </span>
                                                  }
                                             </div>

                                             {!isAdding &&
                                                  <div className="narrow card"><div>ID: {watchListItemDtl?.WatchListItemID}</div></div>
                                             }

                                             <div className="narrow card rightAligned">
                                                  {!isAdding && !isEditing &&
                                                       <span className={`clickable closeButton ${!darkMode ? " lightMode" : " darkMode"}`} onClick={closeDetail}>
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
                                                  {!isAdding &&
                                                       <span className="topMargin">
                                                            {typeof watchListItemDtl?.IMDB_Poster !== "undefined" && watchListItemDtl?.IMDB_Poster !== null && watchListItemDtl?.IMDB_Poster !== "" && watchListItemDtl?.IMDB_Poster_Error !== true && typeof watchListItemDtl?.WatchListItemName !== "undefined" && <Image alt={watchListItemDtl?.WatchListItemName} className="poster-detail" width="175" height="200" style={{ position: "relative", top: "55px" }} src={watchListItemDtl?.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                                            {(typeof watchListItemDtl?.IMDB_Poster === "undefined" || watchListItemDtl?.IMDB_Poster === null || watchListItemDtl?.IMDB_Poster === "" || watchListItemDtl?.IMDB_Poster_Error === true || typeof watchListItemDtl?.WatchListItemName === "undefined") && <>{BrokenImageIconComponent}</>}

                                                            <div className="clickable hyperlink text-label rightAligned" onClick={recommendationsClickHandler}>Recommendations</div>
                                                       </span>
                                                  }

                                                  {isAdding && addWatchListItemDtl !== null && typeof addWatchListItemDtl !== "undefined" &&
                                                       <span className="topMargin column">{typeof addWatchListItemDtl?.IMDB_Poster !== "undefined" && addWatchListItemDtl?.IMDB_Poster !== null && addWatchListItemDtl?.IMDB_Poster !== "" && addWatchListItemDtl?.IMDB_Poster_Error !== true && <Image className="poster-detail" width="175" height="200" alt="Image Not Available" src={addWatchListItemDtl.IMDB_Poster} />}</span>
                                                  }
                                             </div>

                                             <div className="narrow card">
                                                  <span className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>Name:&nbsp;</span>
                                             </div>

                                             <div className="labelWidth card">
                                                  {!isAdding && !isEditing &&
                                                       <>
                                                            {typeof watchListItemDtl?.IMDB_URL !== "undefined" &&
                                                                 <a className="text-label" href={watchListItemDtl?.IMDB_URL} target='_blank' title={watchListItemDtl?.Tooltip}>{watchListItemDtl?.WatchListItemName}</a>
                                                            }

                                                            {typeof watchListItemDtl?.IMDB_URL === "undefined" &&
                                                                 <div title={watchListItemDtl?.Tooltip}>
                                                                      {watchListItemDtl?.WatchListItemName}
                                                                 </div>
                                                            }

                                                            {watchListItemDtl?.Archived === 1 ? <span>&nbsp;(A)</span> : <></>}
                                                       </>
                                                  }

                                                  {isEditing &&
                                                       <div className="narrow card no-width">
                                                            <input className={`inputStyle lightMode`} autoFocus value={watchListItemDtl?.WatchListItemName} onChange={(event) => watchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                                       </div>
                                                  }

                                                  {isAdding && typeof addWatchListItemDtl !== "undefined" && addWatchListItemDtl !== null && addWatchListItemDtl?.WatchListItemName !== null &&
                                                       <input className={`inputStyle lightMode`} autoFocus value={addWatchListItemDtl?.WatchListItemName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <span className={`textLabel ${!darkMode ? " lightMode" : "darkMode"}`}>Type:&nbsp;</span>
                                             </div>

                                             <div className="narrow card">
                                                  {!isAdding && !isEditing &&
                                                       <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>{watchListItemDtl?.WatchListTypeName}</span>
                                                  }

                                                  {isEditing &&
                                                       <div className="narrow card">
                                                            <select className="selectStyle editing" value={watchListItemDtl?.WatchListTypeID} onChange={(event) => watchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                                 <option value="-1">Please select</option>

                                                                 {watchListTypes?.map((watchListType: IWatchListType, index: number) => {
                                                                      return (
                                                                           <option key={index} value={watchListType?.WatchListTypeID}>
                                                                                {watchListType?.WatchListTypeName}
                                                                           </option>
                                                                      );
                                                                 })}
                                                            </select>
                                                       </div>
                                                  }

                                                  {isAdding &&
                                                       <select className="selectStyle" value={addWatchListItemDtl?.WatchListTypeID} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => addWatchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {watchListTypes?.map((watchListType: IWatchListType, index: number) => {
                                                                 return (
                                                                      <option key={index} value={watchListType?.WatchListTypeID}>
                                                                           {watchListType?.WatchListTypeName}
                                                                      </option>
                                                                 );
                                                            })}
                                                       </select>
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card no-width">
                                                  <span className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>URL:&nbsp;</span>
                                             </div>

                                             <div className="narrow card minWidth150">
                                                  {!isAdding && !isEditing &&
                                                       <a className={`${!darkMode ? "lightMode" : "darkMode"}`} href={watchListItemDtl?.IMDB_URL} target="_blank">
                                                            Open in IMDB
                                                       </a>
                                                  }

                                                  {isEditing && typeof watchListItemDtl?.IMDB_URL !== "undefined" && watchListItemDtl?.IMDB_URL !== null &&
                                                       <input className={`inputStyle lightMode`} value={watchListItemDtl?.IMDB_URL} onChange={(event) => watchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                                  }

                                                  {isAdding && typeof addWatchListItemDtl?.IMDB_URL !== "undefined" && addWatchListItemDtl?.IMDB_URL !== null &&
                                                       <input className={`inputStyle lightMode`} value={addWatchListItemDtl?.IMDB_URL} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>Image:&nbsp;</div>
                                             </div>

                                             <div className="narrow card">
                                                  {isEditing && typeof watchListItemDtl?.IMDB_Poster !== "undefined" && watchListItemDtl?.IMDB_Poster !== null &&
                                                       <input className={`inputStyle lightMode`} value={watchListItemDtl?.IMDB_Poster} onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onIMDBPosterChangeHandler(event.target.value)} onChange={(event) => watchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                                  }

                                                  {isAdding && typeof addWatchListItemDtl?.IMDB_Poster !== "undefined" && addWatchListItemDtl?.IMDB_Poster !== null &&
                                                       <input className={`inputStyle lightMode`} value={addWatchListItemDtl?.IMDB_Poster} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                                  }
                                             </div>

                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>Notes:&nbsp;</div>
                                             </div>

                                             <div className="narrow card no-width">
                                                  {!isAdding && !isEditing &&
                                                       <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>{watchListItemDtl?.ItemNotes}</div>
                                                  }

                                                  {isEditing && typeof watchListItemDtl?.ItemNotes !== "undefined" && watchListItemDtl?.ItemNotes !== null &&
                                                       <input className={`inputStyle lightMode`} value={watchListItemDtl?.ItemNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                                  }

                                                  {isAdding && typeof addWatchListItemDtl?.ItemNotes !== "undefined" && addWatchListItemDtl?.ItemNotes !== null &&
                                                       <input className={`inputStyle lightMode`} value={addWatchListItemDtl?.ItemNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                                  }
                                             </div>

                                             {!isAdding && !isEditing && typeof watchListItemDtl !== "undefined" && watchListItemDtl !== null &&
                                                  <div className={`clickable textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>
                                                       <a onClick={() => reloadImageClickHandler(watchListItemDtl.WatchListItemID)}>
                                                            Reload Image
                                                       </a>
                                                  </div>
                                             }

                                             {(isAdding || isEditing) &&
                                                  <>
                                                       <div className="narrow card"></div>

                                                       <div className="narrow card">
                                                            <div className={`textLabel ${!darkMode ? " lightMode" : " darkMode"}`}>Archived:&nbsp;</div>
                                                       </div>

                                                       {isAdding && typeof addWatchListItemDtl !== "undefined" && addWatchListItemDtl !== null &&
                                                            <div className="narrow card">
                                                                 <input className={`lightMode`} type="checkbox" checked={addWatchListItemDtl.Archived === 1 ? true : false} onChange={(event) => addWatchListItemDetailChangeHandler("Archived", event.target.value)} />
                                                            </div>

                                                       }

                                                       {isEditing && typeof watchListItemDtl !== "undefined" && watchListItemDtl !== null &&
                                                            <div className="narrow card">
                                                                 <input className={`lightMode`} type="checkbox" checked={watchListItemDtl?.Archived === 1 ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("Archived", event.target.checked)} />
                                                            </div>
                                                       }
                                                  </>
                                             }
                                        </div>
                                   </div>
                              }

                              {recommendationsVisible && (
                                   <>
                                        <Recommendations queryTerm={recommendationName} type={recommendationType} setRecommendationName={setRecommendationName} setRecommendationType={setRecommendationName} setRecommendationsVisible={setRecommendationsVisible} />
                                   </>
                              )}
                         </div>
                    </div>
               }
          </>
     );
}