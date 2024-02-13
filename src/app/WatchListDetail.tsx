import { useCallback } from "react";
import WatchListItems from "./WatchListItems";

const Autocomplete = require("@mui/material/Autocomplete").default;
const axios = require("axios");
const exact = require("prop-types-exact");
const IWatchList = require("./interfaces/IWatchList");
const IWatchListItem = require("./interfaces/IWatchListItem");
const IWatchListSource = require("./interfaces/IWatchListSource");
const IWatchListType = require("./interfaces/IWatchListType");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const ReactNode = require("react").ReactNode;
const Recommendations = require("./Recommendations").default;
const TextField = require("@mui/material/TextField").default;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

const EmptyIcon = require("@mui/icons-material/StarBorder").default;
const EmptyIconComponent = <EmptyIcon />;

const FullIcon = require("@mui/icons-material/Grade").default;
const FullIconComponent = <FullIcon />;

const HalfIcon = require("@mui/icons-material/StarHalf").default;
const HalfIconComponent = <HalfIcon />;

const WatchListDetail = ({ BrokenImageIcon, CancelIcon, demoMode, isAdding, EditIcon, isEditing, newWatchListItemDtlID, ratingMax, SaveIcon, setActiveRoute, setIsAdding, setIsEditing, setNewWatchListItemDtlID, setWatchListDtlID, setWatchListLoadingStarted, setWatchListLoadingComplete, setWatchListSortingComplete, watchListDtlID, watchListItems, watchListSortDirection, watchListSources, watchListTypes }
     :
     {
          BrokenImageIcon: typeof MuiIcon,
          CancelIcon: typeof MuiIcon,
          demoMode: boolean,
          isAdding: boolean,
          EditIcon: typeof MuiIcon,
          isEditing: boolean,
          isLoggedIn: boolean,
          newWatchListItemDtlID: number,
          ratingMax: number,
          SaveIcon: typeof MuiIcon,
          searchTerm: string,
          setActiveRoute: (arg0: string) => void,
          setIsAdding: (arg0: boolean) => void,
          setIsEditing: (arg0: boolean) => void,
          setNewWatchListItemDtlID: (arg0: number | null) => void,
          setWatchListDtlID: (arg0: number | null) => void,
          setWatchListLoadingStarted: (arg0: boolean) => void,
          setWatchListLoadingComplete: (arg0: boolean) => void,
          setWatchListSortingComplete: (arg0: boolean) => void,
          watchListDtlID: number
          watchListItems: typeof IWatchListItem,
          watchListSortDirection: string,
          watchListSources: typeof IWatchListSource,
          watchListTypes: typeof IWatchListType
     }) => {
     const currentDate = new Date().toLocaleDateString();

     const [addModified, setAddModified] = useState(false);
     const [addWatchListDtl, setAddWatchListDtl] = useState(null);
     const [autoComplete, setAutoComplete] = useState(null);
     const [formattedNames, setFormattedNames] = useState(null);
     const [formattedNamesWithId, setFormattedNamesWithId] = useState(null);
     const [editModified, setEditModified] = useState(false);
     const [originalWatchListDtl, setOriginalWatchListDtl] = useState(null);
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState("");
     const [recommendationType, setRecommendationType] = useState("");
     const [watchListDtl, setWatchListDtl] = useState(null);
     const [watchListDtlLoadingStarted, setWatchListDtlLoadingStarted] = useState(false);
     const [watchListDtlLoadingComplete, setWatchListDtlLoadingComplete] = useState(false);

     const defaultProps = {
          options: formattedNames,
          getOptionLabel: (option: typeof ReactNode) => option.toString(),
     };

     const addNewChangeHandler = () => {
          if (addModified && (addWatchListDtl.WatchListItemID !== "-1" || addWatchListDtl.StartDate !== getLocaleDate() || addWatchListDtl.EndDate !== "" || addWatchListDtl.WatchListSourceID !== "-1" || addWatchListDtl.Season !== "" || addWatchListDtl.Rating !== "0" || addWatchListDtl.Notes !== "")) {
               const confirmLeave = confirm("You have started to add a record. Are you sure you weant to leave ?");

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
          setActiveRoute("SearchIMDB");
     };

     const addWatchListDetailChangeHandler = (fieldName: string, fieldValue: string) => {
          const newAddWatchListDtl = Object.assign({}, addWatchListDtl);

          newAddWatchListDtl[fieldName] = fieldValue;
          newAddWatchListDtl.IsModified = true;

          setAddWatchListDtl(newAddWatchListDtl);

          setAddModified(true);
     };

     const autoCompleteChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (event.target.innerText === "") {
               return;
          }

          const watchListItem = watchListItems.filter((watchListItem: typeof IWatchListItem) => {
               return watchListItem.WatchListItemName === event.target.innerText;
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

               setAutoComplete("");
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
          setIsEditing(false);
          setAddWatchListDtl(null);
          setWatchListDtl(null);
          setOriginalWatchListDtl(null);
          setNewWatchListItemDtlID(null);

          if (addModified || editModified) {
               setWatchListLoadingStarted(false);
               setWatchListLoadingComplete(false);
               setWatchListSortingComplete(false);
          }

          setWatchListDtlID(null);
     };

     const getLocaleDate = useCallback(() => {
          const dateSpl = currentDate.split("/");

          if (navigator.languages.includes("en-US")) { // Date is in format mm/dd/yyyy
               return `${dateSpl[2]}-${dateSpl[0].padStart(2, '0')}-${dateSpl[1].padStart(2, '0')}`;
          } else { // Date is in format dd/mm/yyyy
               try {
                    return `${dateSpl[2]}-${dateSpl[1].padStart(2, '0')}-${dateSpl[0].padStart(2, '0')}`;
               } catch (e) { }
          }
     }, [currentDate]);

     const getRatingIcon = (index: number) => {
          if (isAdding)
               return addWatchListDtl?.Rating > index + 0.5 ? FullIconComponent : addWatchListDtl?.Rating === index + 0.5 ? HalfIconComponent : EmptyIconComponent;
          else
               return watchListDtl?.Rating > index + 0.5 ? FullIconComponent : watchListDtl?.Rating === index + 0.5 ? HalfIconComponent : EmptyIconComponent;
     };

     const getWatchListTypeID = (watchListItemID: number) => {
          const results = watchListItems?.filter((watchListItem: typeof IWatchListItem) => {
               return String(watchListItem.WatchListItemID) === String(watchListItemID);
          });

          if (results.length === 1) {
               return results[0].WatchListTypeID;
          } else {
               return null;
          }
     };

     const ratingClickHandler = (index: number) => {
          if (!isAdding && !isEditing) return true;

          if (isAdding) {
               if (String(addWatchListDtl?.Rating + ".0") === String(index + ".0")) {
                    addWatchListDtl.Rating = index + 0.5;
               } else if (String(addWatchListDtl?.Rating) === String(index + ".5")) {
                    addWatchListDtl.Rating = parseFloat((index + 1).toFixed(1));
               } else {
                    addWatchListDtl.Rating = parseFloat(index.toFixed(1));
               }

               addWatchListDetailChangeHandler("Rating", addWatchListDtl.Rating);

               return;
          } else {
               const newWatchListDtl = Object.assign({}, watchListDtl);

               if (newWatchListDtl.Rating === null) watchListDtl.Rating = 0;

               if (String(watchListDtl.Rating + ".0") === String(index + ".0")) {
                    watchListDtl.Rating = index + 0.5;
               } else if (String(watchListDtl.Rating) === String(index + ".5")) {
                    watchListDtl.Rating = parseFloat((index + 1).toFixed(1));
               } else {
                    watchListDtl.Rating = parseFloat(index.toFixed(1));
               }

               watchListDetailChangeHandler("Rating", watchListDtl.Rating);
          }
     };

     const recommendationsClickHandler = () => {
          const name = watchListDtl?.WatchListItem.WatchListItemName;

          const typeID = watchListDtl?.WatchListItem.WatchListTypeID;

          const typeNameResult = watchListTypes.filter((currentType: typeof IWatchListType) => currentType.WatchListTypeID === typeID);

          if (typeNameResult.length === 0) { // This should never happen!
               console.log("typeNameResult is null in useEffect() in WatchListDetailComponent");
               return;
          }

          const typeName = typeNameResult[0].WatchListTypeName;

          setRecommendationName(name);
          setRecommendationType(typeName);
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

          if (addWatchListDtl.WatchListItemID === "-1") {
               alert("Please select the Movie or TV Show");
               return;
          }

          if (addWatchListDtl.StartDate === "") {
               alert("Please enter the start date");
               return;
          }

          if (addWatchListDtl.WatchListSourceID === "-1") {
               alert("Please select the source");
               return;
          }

          let queryURL = `/api/AddWatchList?WatchListItemID=${addWatchListDtl.WatchListItemID}&StartDate=${addWatchListDtl.StartDate.substring(0, 10)}&WatchListSourceID=${addWatchListDtl.WatchListSourceID}`;

          if (addWatchListDtl.EndDate !== "") {
               queryURL += `&EndDate=${addWatchListDtl.EndDate.substring(0, 10)}`;
          }

          if (addWatchListDtl.Season !== "") {
               queryURL += `&Season=${addWatchListDtl.Season}`;
          }

          if (addWatchListDtl.Rating != "0") {
               queryURL += `&Rating=${addWatchListDtl.Rating}`;
          }

          if (addWatchListDtl.Notes !== "") {
               queryURL += `&Notes=${addWatchListDtl.Notes}`;
          }

          axios.put(queryURL).then((res: typeof IWatchListItem) => {
               if (res.data[0] === "ERROR") {
                    alert(`The error ${res.data[1]} occurred while  adding the detail`);
               } else {
                    //Update data
                    setWatchListDtlID(res.data[1]);

                    setIsAdding(false);
               }
          })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the detail`);
               });
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
          if (watchListDtl.WatchListItemID === "-1") {
               alert("Please select the Movie or TV Show");
               return;
          }

          if (watchListDtl.StartDate === "") {
               alert("Please enter the start date");
               return;
          }

          if (watchListDtl.WatchListSourceID === "-1") {
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

               axios.put(queryURL).then((res: typeof IWatchListItem) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while  updating the detail`);
                    } else {
                         setIsEditing(false);
                    }
               })
                    .catch((err: Error) => {
                         if (!silent) {
                              alert(`The error ${err.message} occurred while updating the detail`);
                         }
                    });
          } else {
               setIsEditing(false);
          }
     }

     const watchListDetailChangeHandler = (fieldName: string, fieldValue: boolean | string) => {
          const newWatchListDtl = Object.assign({}, watchListDtl);

          newWatchListDtl[fieldName] = fieldValue;
          newWatchListDtl[`${fieldName}IsModified`] = true;

          if (fieldName === "WatchListItemID") {
               if (demoMode) {
                    const demoWatchListItemsPayload = require("./demo/index").demoWatchListItemsPayload;

                    const demoWatchListItem = demoWatchListItemsPayload.filter((watchListItem: typeof IWatchListItem) => {
                         return String(watchListItem.WatchListItemID) === String(fieldValue);
                    });

                    if (demoWatchListItem.length === 1) {
                         newWatchListDtl["WatchListItem"] = demoWatchListItem[0];
                    }
               } else {
                    const watchListItem = watchListItems.filter((watchListItem: typeof IWatchListItem) => {
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

     useEffect(() => {
          if (!watchListDtlLoadingStarted && !watchListDtlLoadingComplete && watchListDtlID !== null && watchListDtlID !== -1 && !isNaN(watchListDtlID)) {
               setWatchListDtlLoadingStarted(true);

               if (demoMode) {
                    const demoWatchListPayload = require("./demo/index").demoWatchListPayload;

                    const detailWatchList = demoWatchListPayload.filter((currentWatchList: typeof IWatchList) => {
                         return String(currentWatchList.WatchListID) === String(watchListDtlID);
                    });

                    // This should never happen
                    if (detailWatchList.length !== 1) {
                         alert("Unable to get the detail");
                         return;
                    }

                    setWatchListDtl(detailWatchList[0]);
                    setWatchListDtlLoadingStarted(true);
                    setWatchListDtlLoadingComplete(true);

                    return;
               }

               axios.get(`/api/GetWatchListDtl?WatchListID=${watchListDtlID}`)
                    .then((res: typeof IWatchList) => {
                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while  getting the detail`);
                         } else {
                              // Sanitize object by replacing all fields with null
                              Object.keys(res.data[0]).map((keyName) => {
                                   if (res.data[0][keyName] === null) {
                                        res.data[0][keyName] = "";
                                   }
                              });

                              setWatchListDtl(res.data[0]);
                              setWatchListDtlLoadingComplete(true);
                         }
                    })
                    .catch((err: Error) => {
                         alert(`The fatal error ${err.message} occurred while  getting the detail`);
                    });
          } else if (isAdding) {
               const newAddWatchListDtl: typeof IWatchList = {};
               newAddWatchListDtl.WatchListItemID = newWatchListItemDtlID !== null ? newWatchListItemDtlID : "-1";
               newAddWatchListDtl.StartDate = getLocaleDate();
               newAddWatchListDtl.EndDate = "";
               newAddWatchListDtl.WatchListSourceID = "-1";
               newAddWatchListDtl.Season = "";
               newAddWatchListDtl.Rating = "0";
               newAddWatchListDtl.Notes = "";

               setAddWatchListDtl(newAddWatchListDtl);
          }
     }, [getLocaleDate, isAdding, newWatchListItemDtlID, watchListDtl, watchListDtlID, watchListDtlLoadingStarted, watchListDtlLoadingComplete]);

     useEffect(() => {
          if (watchListItems.length > 0) {
               // Generate names for auto complete
               const namesOnlyItems = watchListItems.map((watchListItem: typeof IWatchListItem) => {
                    let itemName = watchListItem.WatchListItemName

                    if (watchListItems.filter((watchListItemDupe: typeof IWatchListItem) => {
                         return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
                    }).length > 1) {
                         itemName += " (" + watchListItem.WatchListType.WatchListTypeName + ")"
                    }

                    return itemName;
               });

               const namesWithIdSorted = namesOnlyItems.sort();

               setFormattedNames(namesWithIdSorted);

               const namesWithIdItems = watchListItems.map((watchListItem: typeof IWatchListItem) => {
                    let itemName = watchListItem.WatchListItemName

                    if (watchListItems.filter((watchListItemDupe: typeof IWatchListItem) => {
                         return String(watchListItemDupe.WatchListItemName) === String(watchListItem.WatchListItemName);
                    }).length > 1) {
                         itemName += " (" + watchListItem.WatchListType.WatchListTypeName + ")"
                    }

                    let newItem: any = [];
                    newItem.WatchListItemID = watchListItem.WatchListItemID;
                    newItem.WatchListItemName = itemName;

                    return newItem;
               });

               const namesWithIdItemsSorted = namesWithIdItems.sort((a: typeof IWatchListItem, b: typeof IWatchListItem) => {
                    // Convert names to lowercase for case-insensitive sorting
                    const nameA = a.WatchListItemName.toLowerCase();
                    const nameB = b.WatchListItemName.toLowerCase();

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
          }
     }, [watchListItems]);

     useEffect(() => {
          if (recommendationName !== "" && recommendationType !== "") {
               setRecommendationsVisible(true);
          }
     }, [recommendationName, recommendationType]);

     return (
          <>
               <div className="modal">
                    <div className={`modal-content ${watchListDtlID != null ? "fade-in" : "fade-out"}`}>
                         {!recommendationsVisible &&
                              <div className="container">
                                   <div className="cards">
                                        <div className="narrow card">
                                             {!isAdding && !isEditing &&
                                                  <span onClick={startEditing}>
                                                       <span className="clickable editsaveCancelButton">{EditIcon}</span>
                                                  </span>
                                             }

                                             {(isAdding || isEditing) &&
                                                  <span className="clickable saveIcon" onClick={isAdding ? saveNewClickHandler : saveClickHandler}>
                                                       {SaveIcon}
                                                  </span>
                                             }
                                        </div>

                                        <div className="labelWidth card">
                                             {!isAdding && !isEditing &&
                                                  <>
                                                       {typeof watchListDtl?.WatchListItem.IMDB_URL !== "undefined" &&
                                                            <a className="text-label" href={watchListDtl?.WatchListItem.IMDB_URL} target='_blank'>{watchListDtl?.WatchListItem.WatchListItemName}</a>
                                                       }

                                                       {typeof watchListDtl?.WatchListItem.IMDB_URL === "undefined" &&
                                                            <div>
                                                                 {watchListDtl?.WatchListItem.WatchListItemName}
                                                            </div>
                                                       }

                                                       {watchListDtl?.Archived === true ? <span>&nbsp;(A)</span> : <></>}
                                                  </>
                                             }

                                             {(isEditing || isAdding) && formattedNames &&
                                                  <div className="narrow card">
                                                       <Autocomplete id="wl_autocomplete" className="labelWidth" size="small" sx={{ width: 250, height: 40 }} {...defaultProps} options={formattedNames} value={autoComplete} onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => autoCompleteChangeHandler(event)} renderInput={(params: typeof ReactNode) => <TextField {...params} label="Search" />} />
                                                  </div>
                                             }
                                        </div>

                                        <div className="narrow card rightAligned">
                                             {!isAdding && !isEditing &&
                                                  <span className="clickable closeButton" onClick={closeDetail}>
                                                       X
                                                  </span>
                                             }

                                             {(isAdding || isEditing) &&
                                                  <span className="clickable cancelIcon" onClick={isAdding ? closeDetail : cancelClickHandler}>
                                                       {CancelIcon}
                                                  </span>
                                             }
                                        </div>

                                        <div className="narrow card">
                                             {!isAdding &&
                                                  <>
                                                       {watchListDtl?.WatchListItem.IMDB_Poster !== null && watchListDtl?.IMDB_Poster_Error !== true && <img className="poster-detail" alt="Image Not Available" src={watchListDtl?.WatchListItem.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                                       {(watchListDtl?.WatchListItem.IMDB_Poster === null || watchListDtl?.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                                                  </>
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <span className="column">{watchListItems?.filter((currentWatchListItem: typeof IWatchListItem) => String(currentWatchListItem.WatchListItemID) === String(addWatchListDtl?.WatchListItemID)).length === 1 && <img className="poster-detail" alt="Image Not Available" src={watchListItems?.filter((currentWatchListItem: typeof IWatchListItem) => String(currentWatchListItem.WatchListItemID) === String(addWatchListDtl?.WatchListItemID))[0].IMDB_Poster} />}</span>
                                             }
                                        </div>

                                        {!isAdding && !isEditing &&
                                             <>
                                                  <div className="narrow card"></div>
                                                  <div className="narrow card"></div>
                                             </>
                                        }

                                        {isAdding && addWatchListDtl &&
                                             <select className="selectStyle" autoFocus value={addWatchListDtl?.WatchListItemID} onChange={(event) => addWatchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                                  <option value="-1">Please select</option>

                                                  {formattedNamesWithId && formattedNamesWithId.map((watchListItem: typeof IWatchListItem, index: number) => {
                                                       return (
                                                            <option key={index} value={watchListItem.WatchListItemID}>
                                                                 {watchListItem.WatchListItemName}
                                                            </option>
                                                       )
                                                  })}
                                             </select>
                                        }

                                        {isEditing &&
                                             <>
                                                  <div className="narrow card">
                                                       <select className="selectStyle selectWidth" autoFocus value={watchListDtl?.WatchListItemID} onChange={(event) => watchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                                            <option value="-1">Please select</option>

                                                            {watchListItems?.sort((a: typeof IWatchListItem, b: typeof IWatchListItem) => {
                                                                 return String(a.WatchListItemName) > String(b.WatchListItemName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
                                                            })
                                                                 .map((watchListItem: typeof IWatchListItem, index: number) => {
                                                                      return (
                                                                           <option key={index} value={watchListItem.WatchListItemID}>
                                                                                {watchListItem.WatchListItemName}
                                                                           </option>
                                                                      );
                                                                 })}
                                                       </select>
                                                  </div>
                                             </>
                                        }

                                        <div className="narrow card">
                                             {((isAdding && addWatchListDtl) || isEditing) &&
                                                  <div className="clickable hyperlink text-label rightAligned" onClick={addNewChangeHandler}>Add</div>
                                             }
                                        </div>

                                        {(isAdding || isEditing) &&
                                             <div className="narrow card"></div>
                                        }

                                        <div className="narrow card">
                                             <span className="textLabel">Start Date:&nbsp;</span>
                                        </div>

                                        <div className="labelWidth narrow card">
                                             {!isAdding && !isEditing &&
                                                  <span>{watchListDtl?.StartDate && watchListDtl?.StartDate}</span>
                                             }

                                             {isEditing &&
                                                  <input type="date" value={watchListDtl?.StartDate !== null ? watchListDtl?.StartDate : ""} onChange={(event) => watchListDetailChangeHandler("StartDate", event.target.value)} />
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <input type="date" value={addWatchListDtl?.StartDate} onChange={(event) => addWatchListDetailChangeHandler("StartDate", event.target.value)} />
                                             }
                                        </div>

                                        <div className="narrow card"></div>

                                        <div className="narrow card">
                                             <span className="textLabel">End Date:&nbsp;</span>
                                        </div>

                                        <div className="labelWidth narrow card">
                                             {!isAdding && !isEditing &&
                                                  <span>{watchListDtl?.EndDate && watchListDtl?.EndDate}</span>
                                             }

                                             {isEditing &&
                                                  <input type="date" value={watchListDtl?.EndDate !== null ? watchListDtl?.EndDate : ""} onChange={(event) => watchListDetailChangeHandler("EndDate", event.target.value)} />
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <input type="date" value={addWatchListDtl?.EndDate} onChange={(event) => addWatchListDetailChangeHandler("EndDate", event.target.value)} />
                                             }
                                        </div>

                                        <div className="narrow card"></div>

                                        <div className="narrow card">
                                             <div className="textLabel">Source:</div>
                                        </div>

                                        <div className="narrow card">
                                             {!isAdding && !isEditing &&
                                                  <div>{watchListDtl?.WatchListSource.WatchListSourceName}</div>
                                             }

                                             {isEditing &&
                                                  <select className="selectStyle selectWidth" value={watchListDtl?.WatchListSourceID} onChange={(event) => watchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                                       <option value="-1">Please select</option>

                                                       {watchListSources?.map((watchListSource: typeof IWatchListSource, index: number) => {
                                                            return (
                                                                 <option key={index} value={watchListSource.WatchListSourceID}>
                                                                      {watchListSource.WatchListSourceName}
                                                                 </option>
                                                            );
                                                       })}
                                                  </select>
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <select className="selectStyle" value={addWatchListDtl?.WatchListSourceID} onChange={(event) => addWatchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                                       <option value="-1">Please select</option>

                                                       {watchListSources?.map((watchListSource: typeof IWatchListSource, index: number) => {
                                                            return (
                                                                 <option key={index} value={watchListSource.WatchListSourceID}>
                                                                      {watchListSource.WatchListSourceName}
                                                                 </option>
                                                            );
                                                       })}
                                                  </select>
                                             }
                                        </div>

                                        {((isAdding && addWatchListDtl?.WatchListItemID !== "-1" && getWatchListTypeID(addWatchListDtl?.WatchListItemID) === 2) || (!isAdding && watchListDtl?.WatchListItem.WatchListType.WatchListTypeID === 2)) &&
                                             <>
                                                  <div className="narrow card"></div>

                                                  <div className="narrow card">
                                                       <div className="textLabel">Season:</div>
                                                  </div>

                                                  <div className="narrow card">
                                                       {!isAdding && !isEditing &&
                                                            <div>{watchListDtl?.Season}</div>
                                                       }

                                                       {isEditing &&
                                                            <input className="inputStyle narrowWidth" type="number" value={watchListDtl?.Season !== null ? watchListDtl?.Season : ""} onChange={(event) => watchListDetailChangeHandler("Season", event.target.value)} />
                                                       }

                                                       {isAdding && addWatchListDtl &&
                                                            <input className="inputStyle narrowWidth" type="number" value={addWatchListDtl?.Season} onChange={(event) => addWatchListDetailChangeHandler("Season", event.target.value)} />
                                                       }
                                                  </div>
                                             </>
                                        }

                                        <div className="narrow card"></div>

                                        <div className="narrow card">
                                             <div className="textLabel">Notes:</div>
                                        </div>

                                        <div className="narrow card no-width">
                                             {!isAdding && !isEditing &&
                                                  <div className="textLabel">{watchListDtl?.Notes}</div>
                                             }

                                             {isEditing &&
                                                  <input className="inputStyle" value={watchListDtl?.Notes} onChange={(event) => watchListDetailChangeHandler("Notes", event.target.value)} />
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <input className="inputStyle" value={addWatchListDtl?.Notes} onChange={(event) => addWatchListDetailChangeHandler("Notes", event.target.value)} />
                                             }
                                        </div>

                                        <div className="narrow card">
                                             {!isAdding && !isEditing &&
                                                  <div className="clickable hyperlink text-label rightAligned" onClick={recommendationsClickHandler}>Recommendations</div>
                                             }
                                        </div>

                                        <div className="narrow card">
                                             <div className="textLabel">Rating:</div>
                                        </div>

                                        <div className="labelWidth narrow card">
                                             {!isAdding && !isEditing &&
                                                  <span>
                                                       {Array.from(Array(ratingMax), (e: Event, index: number) => {
                                                            return (
                                                                 <span className="favoriteIcon" key={index}>
                                                                      {getRatingIcon(index)}
                                                                 </span>
                                                            );
                                                       })}
                                                  </span>
                                             }

                                             {isEditing &&
                                                  <span className="customTopMargin clickable">
                                                       {Array.from(Array(ratingMax), (e, index) => {
                                                            return (
                                                                 <span className="favoriteIcon" key={index} onClick={() => ratingClickHandler(index)}>
                                                                      {getRatingIcon(index)}
                                                                 </span>
                                                            );
                                                       })}
                                                  </span>
                                             }

                                             {isAdding && addWatchListDtl &&
                                                  <span className="customTopMargin clickable">
                                                       {Array.from(Array(ratingMax), (e, index) => {
                                                            return (
                                                                 <span className="favoriteIcon" key={index} onClick={() => ratingClickHandler(index)}>
                                                                      {getRatingIcon(index)}
                                                                 </span>
                                                            );
                                                       })}
                                                  </span>
                                             }
                                        </div>

                                        {isEditing &&
                                             <>
                                                  <div className="narrow card"></div>

                                                  <div className="narrow card">
                                                       <div className="textLabel">Archive:</div>
                                                  </div>

                                                  <div className="narrow card">
                                                       <input type="checkbox" checked={watchListDtl?.Archived} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListDetailChangeHandler("Archived", event.target.checked)} />
                                                  </div>
                                             </>
                                        }
                                   </div>
                              </div>
                         }

                         {recommendationsVisible && (
                              <Recommendations BrokenImageIcon={BrokenImageIcon} queryTerm={recommendationName} type={recommendationType} setRecommendationName={setRecommendationName} setRecommendationType={setRecommendationName} setRecommendationsVisible={setRecommendationsVisible} />
                         )}
                    </div>
               </div>
          </>
     )
};

WatchListDetail.propTypes = exact({
     BrokenImageIcon: PropTypes.object.isRequired,
     CancelIcon: PropTypes.object.isRequired,
     demoMode: PropTypes.bool.isRequired,
     EditIcon: PropTypes.object.isRequired,
     isAdding: PropTypes.bool.isRequired,
     isEditing: PropTypes.bool.isRequired,
     newWatchListItemDtlID: PropTypes.number,
     ratingMax: PropTypes.number.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setActiveRoute: PropTypes.func.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setIsEditing: PropTypes.func.isRequired,
     setNewWatchListItemDtlID: PropTypes.func.isRequired,
     setWatchListDtlID: PropTypes.func.isRequired,
     setWatchListLoadingStarted: PropTypes.func.isRequired,
     setWatchListLoadingComplete: PropTypes.func.isRequired,
     setWatchListSortingComplete: PropTypes.func.isRequired,
     watchListDtlID: PropTypes.number,
     watchListItems: PropTypes.array.isRequired,
     watchListSortDirection: PropTypes.string.isRequired,
     watchListSources: PropTypes.array.isRequired,
     watchListTypes: PropTypes.array.isRequired,
});

export default WatchListDetail;