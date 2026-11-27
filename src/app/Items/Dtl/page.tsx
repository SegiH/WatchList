"use client"
import "./page.css";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import Recommendations from "../../components/Recommendations";
import { APIStatus, ItemsDtlContext } from "../../context";
import IWatchListItem from "../../interfaces/IWatchListItem";
import IWatchListType from "../../interfaces/IWatchListType";
import { ItemsDtlContextType } from "@/app/contexts/ItemsDtlContextType";
import MediaDetailsCard from "@/app/components/MediaDetailsCard";
import IWatchList from "../../interfaces/IWatchList";
import WatchListHistory from "@/app/components/WatchListHistory";

function FieldRow({ label, children, className }: {
     label: string; children: React.ReactNode; className?: string;
}) {
     return (
          <div className={`pg-field ${className ?? ""}`}>
               <span className="pg-field-label">{label || "\u00A0"}</span>
               <div className="pg-field-value">{children}</div>
          </div>
     );
}

export default function ItemsDtl() {
     const {
          autoAdd, CancelIconComponent, demoMode, EditIconComponent, formatWatchListDates, getMissingPoster, getWatchListItems, imageHeight, imageIsValid, imageWidth, isAdding, isEditing, isEnabled, isLoading, pullToRefreshEnabled, SaveIconComponent, setActiveRoute, setErrorMessage, setIsAdding, setIsEditing, setIsError, setModalVisible, watchListTypes, writeLog
     } = useContext(ItemsDtlContext) as ItemsDtlContextType

     const [addWatchListItemDtl, setAddWatchListItemDtl] = useState<IWatchListItem | null>();
     const [editModified, setEditModified] = useState(false);
     const [addModified, setAddModified] = useState(false);
     const [mediaDetailsCardVisible, setmediaDetailsVisible] = useState(false);
     const [isClosing, setIsClosing] = useState(false);
     const [originalWatchListItemDtl, setOriginalWatchListItemDtl] = useState<IWatchListItem | null>();
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState<string>("");
     const [recommendationType, setRecommendationType] = useState("");
     const [watchListHistory, setWatchListHistory] = useState<IWatchList[]>([]);
     const [watchListHistoryVisible, setWatchListHistoryVisible] = useState(false);
     const [watchListItemDtl, setWatchListItemDtl] = useState<IWatchListItem | null>();
     const [watchListItemDtlLoadingCheck, setWatchListItemDtlLoadingCheck] = useState(APIStatus.Idle);
     const [watchListItemDtlID, setWatchListItemDtlID] = useState<number>(-1);

     const movieRatings = ["G", "PG", "PG-13", "R", "NC-17"];
     const tvRatings = ["TV-G", "TV-PG", "TV-14", "TV-MA"];

     const router = useRouter();

     const addWatchListItemDetailChangeHandler = (fieldName: string, fieldValue: boolean | number | string) => {
          const newAddWatchListItemDtl = { ...addWatchListItemDtl } as IWatchListItem;

          newAddWatchListItemDtl[fieldName] = fieldValue;
          newAddWatchListItemDtl.IsModified = 1;

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
          try {
               const checkURLResponse = await fetch(URL);

               const checkURLResult = await checkURLResponse.json();

               if (checkURLResult) {
                    return true;
               } else {
                    return false;
               }
          } catch (e: any) {
               return false;
          }
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

          router.push(`/Items`);
     };

     const closeMediaDetailsCard = () => {
          setmediaDetailsVisible(false);
          setModalVisible(false);
     }

     const getWatchListItemDtl = async (id: number) => {
          try {
               const getWatchListItemDtlResponse = await fetch(`/api/GetWatchListItemDtl?WatchListItemID=${watchListItemDtlID}`, { credentials: 'include' });

               const getWatchListItemDtlResult = await getWatchListItemDtlResponse.json();

               setWatchListItemDtlLoadingCheck(APIStatus.Success);

               if (getWatchListItemDtlResult[0] === "ERROR") {
                    setErrorMessage(`The error ${getWatchListItemDtlResult[1]} occurred while getting the item detail`);
                    setIsError(true);
                    return;
               } else {
                    // Sanitize object by replacing all null fields with "". There are issues with binding to input fields when the value is null
                    const wlid = getWatchListItemDtlResult[1];

                    if (typeof wlid !== "undefined" && wlid !== null && wlid.length > 0) {
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
                              if (typeof wlid?.[tooltipFields[i].fieldName] !== "undefined") {
                                   tooltip += `${wlid?.[tooltipFields[i].displayName]}: ${wlid?.[tooltipFields[i].fieldName]}`;
                              }
                         }

                         wlid[0].Tooltip = tooltip;

                         Object.keys(wlid[0]).map((keyName) => {
                              if (wlid[0][keyName] === null) {
                                   wlid[0][keyName] = "";
                              }
                         });

                         setWatchListItemDtl(wlid[0]);

                         setWatchListHistory(wlid[0]?.WatchListHistory);

                         setWatchListItemDtlLoadingCheck(APIStatus.Success);
                    } else {
                         alert("Unable to get the Item with ID " + id);
                         closeDetail();
                    }
               }
          } catch (e: any) {
               alert(e.message);
          }
     }

     const MediaDetailsOpenClickHandler = () => {
          setmediaDetailsVisible(true);
     }

     const onIMDBPosterChangeHandler = async (URL: string) => {
          const result = await checkURL(URL);

          if (isAdding) {
               const newAddWatchListItemDtl = { ...addWatchListItemDtl } as IWatchListItem;

               newAddWatchListItemDtl["IMDB_Poster_Error"] = !result;

               setAddWatchListItemDtl(newAddWatchListItemDtl);
          } else {
               const newWatchListItemDtl = { ...watchListItemDtl } as IWatchListItem;
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

          if (Array.isArray(result) && result.length > 0 && result[0]["Status"] === "OK") {
               const newWatchListItemDtl = { ...watchListItemDtl } as IWatchListItem;
               newWatchListItemDtl["IMDB_Poster"] = result[0].IMDB_Poster;

               setWatchListItemDtl(newWatchListItemDtl);

               const queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemDtl?.WatchListItemID}&IMDB_Poster=${result[0].IMDB_Poster}`;

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

               if (watchListItemDtl?.WatchListItemNameIsModified === 1) {
                    queryURL += `&WatchListItemName=${watchListItemDtl.WatchListItemName}`;
               }

               if (watchListItemDtl?.WatchListTypeIDIsModified === 1) {
                    queryURL += `&WatchListTypeID=${watchListItemDtl.WatchListTypeID}`;
               }

               if (watchListItemDtl?.IMDB_URLIsModified === 1) {
                    queryURL += `&IMDB_URL=${watchListItemDtl.IMDB_URL}`;
               }

               if (watchListItemDtl?.IMDB_PosterIsModified === 1) {
                    queryURL += `&IMDB_Poster=${watchListItemDtl.IMDB_Poster}`;
               }

               if (watchListItemDtl?.ItemNotesIsModified === 1) {
                    queryURL += `&ItemNotes=${watchListItemDtl.ItemNotes}`;
               }

               if (watchListItemDtl?.YearIsModified === 1) {
                    queryURL += `&Year=${watchListItemDtl.Year}`;
               }

               if (watchListItemDtl?.RatingIsModified === 1) {
                    queryURL += `&Rated=${watchListItemDtl.Rating}`;
               }

               if (watchListItemDtl?.GenreIsModified === 1) {
                    queryURL += `&Genre=${watchListItemDtl.Genre}`;
               }

               if (watchListItemDtl?.ArchivedIsModified === 1) {
                    queryURL += `&Archived=${watchListItemDtl.Archived}`;
               }

               if (queryURL != "") {
                    queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemDtl?.WatchListItemID}${queryURL}`;

                    try {
                         const saveItemDtlResponse = await fetch(queryURL, { method: 'PUT', credentials: 'include' });

                         const saveItemDtlResult = await saveItemDtlResponse.json();

                         if (saveItemDtlResult[0] === "ERROR") {
                              alert(`The error ${saveItemDtlResult[1]} occurred while updating the item detail`);
                         } else {
                              // Update type name if needed
                              if (watchListItemDtl?.WatchListTypeIDIsModified === 1) {
                                   const result = watchListTypes?.filter((currentWatchList: IWatchListType) => {
                                        return String(currentWatchList.WatchListTypeID) === String(watchListItemDtl["WatchListTypeID"]);
                                   });

                                   if (result.length !== 1) {
                                        alert("Unable to update type name");
                                        return;
                                   }

                                   const newWatchListItemDtl = { ...watchListItemDtl } as IWatchListItem;

                                   newWatchListItemDtl["WatchListTypeName"] = result[0].WatchListTypeName;

                                   setWatchListItemDtl(newWatchListItemDtl);
                              }

                              setIsEditing(false);

                              setEditModified(true);
                         }
                    } catch (e: any) {
                         alert(e.message);
                    }
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

          if (addWatchListItemDtl?.YearIsModified === 1) {
               queryURL += `&Year=${addWatchListItemDtl.Year}`;
          }

          if (addWatchListItemDtl?.GenreIsModified === 1) {
               queryURL += `&Genre=${addWatchListItemDtl.Genre}`;
          }

          if (addWatchListItemDtl?.RatingIsModified === 1) {
               queryURL += `&Rated=${addWatchListItemDtl.Rating}`;
          }

          try {
               const saveNewItemDtlResponse = await fetch(queryURL, { method: 'PUT', credentials: 'include' });

               const saveNewItemDtlResult = await saveNewItemDtlResponse.json();

               if (saveNewItemDtlResult[0] === "ERROR") {
                    alert(`The error ${saveNewItemDtlResult[1]} occurred while adding the detail`);
                    return;
               } else if (saveNewItemDtlResult[0] === "ERROR-ALREADY-EXISTS") {
                    alert(saveNewItemDtlResult[1]);
                    return;
               }

               setAddModified(true);

               getWatchListItems();

               if (autoAdd) {
                    setActiveRoute("WatchList");
                    setModalVisible(true);
                    router.push(`/WatchList/Dtl?WatchListItemID=${saveNewItemDtlResult[1]}`);
               } else {
                    const addNewWatchListPrompt = confirm("Do you want to add a new WatchList record now ?");

                    if (addNewWatchListPrompt) {
                         setActiveRoute("WatchList");
                         setModalVisible(true);
                         router.push(`/WatchList/Dtl?WatchListItemID=${saveNewItemDtlResult[1]}`);
                    } else {
                         setIsAdding(false);
                         //setIsClosing(true);
                    }
               }
          } catch (e: any) {
               alert(e.message);
          }
     };

     const showDefaultSrc = () => {
          if (isAdding) {
               const newAddWatchListItemDtl = { ...addWatchListItemDtl } as IWatchListItem;

               newAddWatchListItemDtl["IMDB_Poster_Error"] = true;

               setAddWatchListItemDtl(newAddWatchListItemDtl);
          } else {
               const newWatchListItemDtl = { ...watchListItemDtl } as IWatchListItem;

               newWatchListItemDtl["IMDB_Poster_Error"] = true;

               setWatchListItemDtl(newWatchListItemDtl);
          }
     };

     const showWatchListHistory = () => {
          setWatchListHistoryVisible(true);
     }

     const startEditing = () => {
          setOriginalWatchListItemDtl(watchListItemDtl);
          setIsEditing(!isEditing);
     };

     const watchListItemDetailChangeHandler = (fieldName: string, fieldValue: boolean | string) => {
          const newWatchListItemDtl = { ...watchListItemDtl } as IWatchListItem;

          if (fieldName === "Archived") {
               newWatchListItemDtl[fieldName] = fieldValue === true ? 1 : 0;
          } else {
               newWatchListItemDtl[fieldName] = fieldValue;
          }

          newWatchListItemDtl[`${fieldName}IsModified`] = 1;

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

               getWatchListItemDtl(watchListItemDtlID);
          } else if (isAdding && watchListItemDtlID === -1) {
               const newAddWatchListItemDtl: IWatchListItem = { WatchListItemID: 0, WatchListItemName: "", WatchListTypeID: -1, WatchListTypeName: "", IMDB_URL: "", IMDB_Poster: "", ItemNotes: "", Rating: "", Year: 0, Rated: "", Genre: "", Archived: 0, WatchListHistory: [] };
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
               setModalVisible(false);
          }
     }, [isClosing, isEnabled, router]);

     const editing = isAdding || isEditing;
     const view = !isAdding && !isEditing;
     const src = (isAdding ? addWatchListItemDtl : watchListItemDtl) as IWatchListItem | null | undefined;
     const setField = isAdding ? addWatchListItemDetailChangeHandler : watchListItemDetailChangeHandler;

     return (
          <>
               {!isLoading && !isClosing && watchListItemDtlLoadingCheck === APIStatus.Success && !mediaDetailsCardVisible && !watchListHistoryVisible && (
                    <div className="pg-modal">
                         <div className={`pg-modal-content ${watchListItemDtlID != null ? "pg-fade-in" : ""}`}>

                              <div className="pg-toolbar">
                                   <div className="pg-toolbar-left">
                                        {!editing && watchListItemDtl && (
                                             <span className="pg-action" onClick={startEditing}>{EditIconComponent}</span>
                                        )}
                                        {editing && (
                                             <span className="pg-action" onClick={isAdding ? saveNewClickHandler : saveClickHandler}>
                                                  {SaveIconComponent}
                                             </span>
                                        )}
                                   </div>
                                   <div className="pg-toolbar-right">
                                        {editing
                                             ? <span className="pg-action pg-cancel" onClick={isAdding ? closeDetail : cancelClickHandler}>{CancelIconComponent}</span>
                                             : <span className="pg-action pg-close" onClick={closeDetail}>X</span>}
                                   </div>
                              </div>

                              {!recommendationsVisible && !mediaDetailsCardVisible && (
                                   <div className="pg-form">

                                        <div className="pg-poster-row">
                                             <div className="pg-poster">
                                                  {!isAdding && imageIsValid(watchListItemDtl?.IMDB_Poster, watchListItemDtl?.IMDB_Poster_Error) && (
                                                       <Image alt={watchListItemDtl?.WatchListItemName ?? "Unknown"} className="pg-poster-img"
                                                            width={imageWidth} height={imageHeight} src={watchListItemDtl?.IMDB_Poster} onError={() => showDefaultSrc()} />
                                                  )}
                                                  {isAdding && addWatchListItemDtl && imageIsValid(addWatchListItemDtl?.IMDB_Poster, addWatchListItemDtl?.IMDB_Poster_Error) && (
                                                       <Image className="pg-poster-img" width={imageWidth} height={imageHeight}
                                                            alt="Image Not Available" src={addWatchListItemDtl.IMDB_Poster} />
                                                  )}
                                             </div>
                                        </div>

                                        {!isAdding &&
                                             <FieldRow label="ID:">
                                                  <div className="pg-id">{watchListItemDtl?.WatchListItemID}</div>
                                             </FieldRow>
                                        }

                                        <FieldRow label="Name:">
                                             {view ? (
                                                  <>
                                                       <span className="pg-name-view" title={watchListItemDtl?.Tooltip}>{watchListItemDtl?.WatchListItemName}</span>
                                                       {watchListItemDtl?.Archived === 1 && <span className="pg-archived">&nbsp;(A)</span>}
                                                  </>
                                             ) : (
                                                  <input className="pg-input" value={src?.WatchListItemName ?? ""}
                                                       onChange={(e) => setField("WatchListItemName", e.target.value)} />
                                             )}
                                        </FieldRow>

                                        <FieldRow label="Type:">
                                             {view ? <span>{watchListItemDtl?.WatchListTypeName}</span> : (
                                                  <select className="pg-select" value={src?.WatchListTypeID ?? -1}
                                                       onChange={(e) => setField("WatchListTypeID", e.target.value)}>
                                                       <option value="-1">Please select</option>
                                                       {watchListTypes?.map((t: IWatchListType, i: number) => (
                                                            <option key={i} value={t?.WatchListTypeID}>{t?.WatchListTypeName}</option>
                                                       ))}
                                                  </select>
                                             )}
                                        </FieldRow>

                                        <FieldRow label="URL:">
                                             {view
                                                  ? <a className="pg-link" href={watchListItemDtl?.IMDB_URL} target="_blank" rel="noreferrer">Open in IMDB</a>
                                                  : <input className="pg-input" value={src?.IMDB_URL ?? ""} onChange={(e) => setField("IMDB_URL", e.target.value)} />}
                                        </FieldRow>

                                        <FieldRow label="Notes:">
                                             {view
                                                  ? <div className="pg-notes-view">{watchListItemDtl?.ItemNotes}</div>
                                                  : <input className="pg-input" value={src?.ItemNotes ?? ""} onChange={(e) => setField("ItemNotes", e.target.value)} />}
                                        </FieldRow>

                                        {editing && (
                                             <FieldRow label="Image:">
                                                  <input className="pg-input" value={src?.IMDB_Poster ?? ""}
                                                       onBlur={(e) => onIMDBPosterChangeHandler(e.target.value)}
                                                       onChange={(e) => setField("IMDB_Poster", e.target.value)} />
                                             </FieldRow>
                                        )}

                                        {editing && (
                                             <FieldRow label="Year:">
                                                  <input className="pg-input" type="number" value={src?.Year ?? 0}
                                                       onChange={(e) => setField("Year", e.target.value)} />
                                             </FieldRow>
                                        )}

                                        {editing && (
                                             <FieldRow label="Genre:">
                                                  <input className="pg-input" value={src?.Genre ?? ""}
                                                       onChange={(e) => setField("Genre", e.target.value)} />
                                             </FieldRow>
                                        )}

                                        {editing && src?.WatchListTypeID !== -1 && (
                                             <FieldRow label="Rated:">
                                                  <select className="pg-select" value={src?.Rating ?? "-1"}
                                                       onChange={(e) => setField("Rating", e.target.value)}>
                                                       <option value="-1">Please select</option>
                                                       {(String(src?.WatchListTypeID) === "2" ? tvRatings : movieRatings)?.map((r, i) => (
                                                            <option key={i} value={r}>{r}</option>
                                                       ))}
                                                  </select>
                                             </FieldRow>
                                        )}

                                        {editing && (
                                             <FieldRow label="Archived:">
                                                  <input type="checkbox" checked={src?.Archived === 1}
                                                       onChange={(e) => setField("Archived", e.target.checked)} />
                                             </FieldRow>
                                        )}

                                        {view && (
                                             <div className="pg-inline-actions">
                                                  <span className="pg-link" onClick={() => reloadImageClickHandler(watchListItemDtl!.WatchListItemID)}>Reload Image</span>
                                                  <span className="pg-link" onClick={recommendationsClickHandler}>Recommendations</span>
                                                  <span className="pg-link pg-font-style" onClick={MediaDetailsOpenClickHandler}>IMDB Info</span>
                                                  {watchListItemDtl?.WatchListHistory?.length > 0 && (
                                                       <span className="pg-link pg-font-style" onClick={showWatchListHistory}>Watched History</span>
                                                  )}
                                             </div>
                                        )}
                                   </div>
                              )}

                              {recommendationsVisible && !mediaDetailsCardVisible && (
                                   <Recommendations queryTerm={recommendationName} type={recommendationType}
                                        setRecommendationName={setRecommendationName}
                                        setRecommendationType={setRecommendationName}
                                        setRecommendationsVisible={setRecommendationsVisible} />
                              )}
                         </div>
                    </div>
               )}

               {mediaDetailsCardVisible && !recommendationsVisible && (
                    <MediaDetailsCard closeMediaDetails={closeMediaDetailsCard} watchListItem={watchListItemDtl} />
               )}

               {watchListHistoryVisible && (
                    <WatchListHistory formatWatchListDates={formatWatchListDates} name={watchListItemDtl?.WatchListItemName}
                         setWatchListHistoryVisible={setWatchListHistoryVisible} watchListHistory={watchListHistory} />
               )}
          </>
     );
}