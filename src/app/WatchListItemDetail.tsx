const axios = require("axios");
const exact = require("prop-types-exact");
const IWatchListItem = require("./interfaces/IWatchListItem");
const IWatchListType = require("./interfaces/IWatchListType");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const Recommendations = require("./Recommendations").default;
const useState = require("react").useState;
const useEffect = require("react").useEffect;

const WatchListItemDetail = ({ BrokenImageIcon, CancelIcon, demoMode, isAdding, EditIcon, isEditing, SaveIcon, setIsAdding, setIsEditing, setNewWatchListItemDtlID, setWatchListItemDtlID, setWatchListItemsLoadingComplete, setWatchListItemsLoadingStarted, watchListItemDtlID, watchListTypes }
     :
     {
          BrokenImageIcon: typeof MuiIcon,
          CancelIcon: typeof MuiIcon,
          demoMode: boolean,
          isAdding: boolean,
          EditIcon: typeof MuiIcon,
          isEditing: boolean,
          SaveIcon: typeof MuiIcon,
          setIsAdding: (arg0: boolean) => void,
          setIsEditing: (arg0: boolean) => void,
          setNewWatchListItemDtlID: (arg0: number) => void,
          setWatchListItemDtlID: (arg0: number | null) => void,
          setWatchListItemsLoadingComplete: (arg0: boolean) => void,
          setWatchListItemsLoadingStarted: (arg0: boolean) => void,
          watchListItemDtlID: number,
          watchListTypes: typeof IWatchListType
     }) => {
     const [addWatchListItemDtl, setAddWatchListItemDtl] = useState(null);
     const [editModified, setEditModified] = useState(false);
     const [addModified, setAddModified] = useState(false);
     const [originalWatchListItemDtl, setOriginalWatchListItemDtl] = useState(null);
     const [recommendationsVisible, setRecommendationsVisible] = useState(false);
     const [recommendationName, setRecommendationName] = useState("");
     const [recommendationType, setRecommendationType] = useState("");
     const [watchListItemDtl, setWatchListItemDtl] = useState(null);
     const [watchListItemDtlLoadingStarted, setWatchListItemDtlLoadingStarted] = useState(false);
     const [watchListItemDtlLoadingComplete, setWatchListItemDtlLoadingComplete] = useState(false);

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
          setNewWatchListItemDtlID(-1);
          setWatchListItemDtlID(null);
          setIsAdding(false);
          setIsEditing(false);
          setAddWatchListItemDtl(null);
          setWatchListItemDtl(null);
          setOriginalWatchListItemDtl(null);

          if (addModified || editModified) {
               setWatchListItemsLoadingStarted(false);
               setWatchListItemsLoadingComplete(false);
          }
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

          const typeID = watchListItemDtl?.WatchListTypeID;

          const typeNameResult = watchListTypes.filter((currentType: typeof IWatchListType) => currentType.WatchListTypeID === typeID);

          if (typeNameResult.length === 0) { // This should never happen!
               console.log("typeNameResult is null in useEffect() in WatchListItemDetailComponent");
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

          if (!editModified) {
               setIsEditing(false);
               return;
          }

          if (watchListItemDtl.WatchListItemName === "") {
               alert("Please enter the name of the Movie or TV Show");
               return;
          }

          let queryURL = ``;

          if (watchListItemDtl.WatchListItemNameIsModified === true) {
               queryURL += `&WatchListItemName=${watchListItemDtl.WatchListItemName}`;
          }

          if (watchListItemDtl.WatchListTypeIDIsModified === true) {
               queryURL += `&WatchListTypeID=${watchListItemDtl.WatchListTypeID}`;
          }

          if (watchListItemDtl.IMDB_URLIsModified === true) {
               queryURL += `&IMDB_URL=${watchListItemDtl.IMDB_URL}`;
          }

          if (watchListItemDtl.IMDB_PosterIsModified === true) {
               queryURL += `&IMDB_Poster=${watchListItemDtl.IMDB_Poster}`;
          }

          if (watchListItemDtl.ItemNotesIsModified === true) {
               queryURL += `&ItemNotes=${watchListItemDtl.ItemNotes}`;
          }

          if (watchListItemDtl.ArchivedIsModified === true) {
               queryURL += `&Archived=${watchListItemDtl.Archived}`;
          }

          if (queryURL != "") {
               queryURL = `/api/UpdateWatchListItem?WatchListItemID=${watchListItemDtl.WatchListItemID}${queryURL}`;

               axios.put(queryURL)
                    .then((res: typeof IWatchListItem) => {
                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while  updating the item detail`);
                         } else {
                              setIsEditing(false);

                              setEditModified(true);
                         }
                    })
                    .catch((err: Error) => {
                         alert(`The error ${err.message} occurred while updating the item detail`);
                    });
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

          if (addWatchListItemDtl.WatchListItemName === "") {
               alert("Please enter the item name");
               return;
          }

          if (addWatchListItemDtl.WatchListTypeID === "-1") {
               alert("Please select the type");
               return;
          }

          if (addWatchListItemDtl.IMDB_URL === "") {
               alert("Please enter the IMDB URL");
               return;
          }

          let queryURL = `/api/AddWatchListItem?WatchListItemName=${addWatchListItemDtl.WatchListItemName}&WatchListTypeID=${addWatchListItemDtl.WatchListTypeID}&IMDB_URL=${addWatchListItemDtl.IMDB_URL}`;

          if (addWatchListItemDtl.IMDB_Poster !== "") {
               queryURL += `&IMDB_Poster=${addWatchListItemDtl.IMDB_Poster}`;
          }

          if (addWatchListItemDtl.ItemNotes !== "") {
               queryURL += `&ItemNotes=${addWatchListItemDtl.ItemNotes}`;
          }

          axios.put(queryURL).then((res: typeof IWatchListItem) => {
               if (res.data[0] === "ERROR") {
                    alert(`The error ${res.data[1]} occurred while  adding the detail`);
               } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
                    alert(res.data[1]);
               } else {
                    setAddModified(true);

                    setIsAdding(false);

                    const addNewWatchListPrompt = confirm("Do you want to add a new WatchList record now ?");

                    if (addNewWatchListPrompt) {
                         setNewWatchListItemDtlID(res.data[1]);
                         setWatchListItemsLoadingStarted(false);
                         setWatchListItemsLoadingComplete(false);
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
          const newWatchListItemDtl = Object.assign({}, watchListItemDtl);

          newWatchListItemDtl[fieldName] = fieldValue;
          newWatchListItemDtl[`${fieldName}IsModified`] = true;

          if (!editModified) {
               setEditModified(true);
          }

          setWatchListItemDtl(newWatchListItemDtl);
     };

     useEffect(() => {
          if (!watchListItemDtlLoadingStarted && !watchListItemDtlLoadingComplete && watchListItemDtlID !== null && watchListItemDtlID !== -1 && watchListItemDtl == null) {
               setWatchListItemDtlLoadingStarted(true);

               if (demoMode) {
                    const demoWatchListItemPayload = require("./demo/index").demoWatchListItemsPayload;

                    const detailWatchListItem = demoWatchListItemPayload.filter((currentWatchList: typeof IWatchListItem) => {
                         return String(currentWatchList.WatchListItemID) === String(watchListItemDtlID);
                    });

                    // This should never happen
                    if (detailWatchListItem.length !== 1) {
                         alert("Unable to get the detail");
                         return;
                    }

                    setWatchListItemDtl(detailWatchListItem[0]);
                    setWatchListItemDtlLoadingStarted(true);
                    setWatchListItemDtlLoadingComplete(true);
               }

               axios.get(`/api/GetWatchListItemDtl?WatchListItemID=${watchListItemDtlID}`)
                    .then((res: typeof IWatchListItem) => {
                         setWatchListItemDtlLoadingComplete(true);

                         if (res.data[0] === "ERROR") {
                              alert(`The error ${res.data[1]} occurred while  getting the item detail`);
                         } else {
                              // Sanitize object by replacing all null fields with "". There are issues with binding to input fields when the value is null
                              Object.keys(res.data[0]).map((keyName) => {
                                   if (res.data[0][keyName] === null) {
                                        res.data[0][keyName] = "";
                                   }
                              });

                              setWatchListItemDtl(res.data[0]);
                         }
                    })
                    .catch((err: Error) => {
                         alert(`The fatal error ${err.message} occurred while getting the item detail`);
                    });
          } else if (isAdding && watchListItemDtlID === -1) {
               const newAddWatchListItemDtl: typeof IWatchListItem = {};
               newAddWatchListItemDtl.WatchListItemName = "";
               newAddWatchListItemDtl.WatchListTypeID = "-1";
               newAddWatchListItemDtl.IMDB_URL = "";
               newAddWatchListItemDtl.IMDB_Poster = "";
               newAddWatchListItemDtl.ItemNotes = "";

               setAddWatchListItemDtl(newAddWatchListItemDtl);
          }
     }, [isAdding, watchListItemDtlLoadingStarted, watchListItemDtlLoadingComplete, watchListItemDtl, watchListItemDtlID]);

     useEffect(() => {
          if (recommendationName !== "" && recommendationType !== "") {
               setRecommendationsVisible(true);
          }
     }, [recommendationName, recommendationType]);

     return (
          <div className="modal">
               <div className={`modal-content ${watchListItemDtlID != null ? "fade-in" : "fade-out"}`}>
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

                                   <div className="narrow card"></div>

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
                                                  {watchListItemDtl?.IMDB_Poster !== null && watchListItemDtl?.IMDB_Poster_Error !== true && <img alt={addWatchListItemDtl?.WatchListItemName} className="poster-detail" src={watchListItemDtl?.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                                  {(watchListItemDtl?.IMDB_Poster === null || watchListItemDtl?.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                                             </>
                                        }

                                        {isAdding && addWatchListItemDtl !== null &&
                                             <span className="column">{addWatchListItemDtl?.IMDB_Poster !== null && addWatchListItemDtl?.IMDB_Poster_Error !== true && <img className="poster-detail" alt="Image Not Available" src={addWatchListItemDtl?.IMDB_Poster} />}</span>
                                        }
                                   </div>

                                   <div className="narrow card">
                                        <span className="textLabel">Name:&nbsp;</span>
                                   </div>

                                   <div className="labelWidth card">
                                        {!isAdding && !isEditing &&
                                             <>
                                                  {typeof watchListItemDtl?.IMDB_URL !== "undefined" &&
                                                       <a className="text-label" href={watchListItemDtl?.IMDB_URL} target='_blank'>{watchListItemDtl?.WatchListItemName}</a>
                                                  }

                                                  {typeof watchListItemDtl?.IMDB_URL === "undefined" &&
                                                       <div>
                                                            {watchListItemDtl?.WatchListItemName}
                                                       </div>
                                                  }

                                                  {watchListItemDtl?.Archived === true ? <span>&nbsp;(A)</span> : <></>}
                                             </>
                                        }

                                        {isEditing &&
                                             <div className="narrow card">
                                                  <input className="inputStyle" autoFocus value={watchListItemDtl?.WatchListItemName} onChange={(event) => watchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                             </div>
                                        }

                                        {isAdding &&
                                             <input className="inputStyle" autoFocus value={addWatchListItemDtl?.WatchListItemName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                        }
                                   </div>

                                   <div className="narrow card"></div>

                                   <div className="narrow card">
                                        <span className="textLabel">Type:&nbsp;</span>
                                   </div>

                                   <div className="narrow card">
                                        {!isAdding && !isEditing &&
                                             <span>{watchListItemDtl?.WatchListType.WatchListTypeName}</span>
                                        }

                                        {isEditing &&
                                             <select className="selectStyle selectWidth" value={watchListItemDtl.WatchListTypeID} onChange={(event) => watchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                  <option value="-1">Please select</option>

                                                  {watchListTypes?.map((watchListType: typeof IWatchListType, index: number) => {
                                                       return (
                                                            <option key={index} value={watchListType.WatchListTypeID}>
                                                                 {watchListType.WatchListTypeName}
                                                            </option>
                                                       );
                                                  })}
                                             </select>
                                        }

                                        {isAdding &&
                                             <select className="selectStyle selectWidth" value={addWatchListItemDtl?.WatchListTypeID} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => addWatchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                  <option value="-1">Please select</option>

                                                  {watchListTypes?.map((watchListType: typeof IWatchListType, index: number) => {
                                                       return (
                                                            <option key={index} value={watchListType.WatchListTypeID}>
                                                                 {watchListType.WatchListTypeName}
                                                            </option>
                                                       );
                                                  })}
                                             </select>
                                        }
                                   </div>

                                   <div className="narrow card"></div>

                                   <div className="narrow card">
                                        <span className="textLabel">URL:&nbsp;</span>
                                   </div>

                                   <div className="narrow card">
                                        {!isAdding && !isEditing &&
                                             <a href={watchListItemDtl?.IMDB_URL} target="_blank">
                                                  Open in IMDB
                                             </a>
                                        }

                                        {isEditing &&
                                             <input className="inputStyle" value={watchListItemDtl.IMDB_URL} onChange={(event) => watchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                        }

                                        {isAdding &&
                                             <input className="inputStyle" value={addWatchListItemDtl?.IMDB_URL} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                        }
                                   </div>

                                   {(isAdding || isEditing) &&
                                        <>
                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className="textLabel">Image:&nbsp;</div>
                                             </div>

                                             <div className="narrow card">
                                                  {isEditing &&
                                                       <input className="inputStyle" value={watchListItemDtl.IMDB_Poster} onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onIMDBPosterChangeHandler(event.target.value)} onChange={(event) => watchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                                  }

                                                  {isAdding &&
                                                       <input className="inputStyle" value={addWatchListItemDtl?.IMDB_Poster} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                                  }
                                             </div>
                                        </>
                                   }

                                   <div className="narrow card"></div>

                                   <div className="narrow card">
                                        <div className="textLabel">Notes:&nbsp;</div>
                                   </div>

                                   <div className="narrow card no-width">
                                        {!isAdding && !isEditing &&
                                             <div className="textLabel">{watchListItemDtl?.ItemNotes}</div>
                                        }

                                        {isEditing &&
                                             <input className="inputStyle" value={watchListItemDtl.ItemNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                        }

                                        {isAdding &&
                                             <input className="inputStyle" value={addWatchListItemDtl?.ItemNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                        }
                                   </div>

                                   {!isAdding && !isEditing &&
                                        <>
                                             <div className="narrow card"></div>
                                             <div className="narrow card"></div>
                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className="clickable hyperlink text-label rightAligned" onClick={recommendationsClickHandler}>Recommendations</div>
                                             </div>
                                        </>
                                   }

                                   {isEditing &&
                                        <>
                                             <div className="narrow card"></div>

                                             <div className="narrow card">
                                                  <div className="textLabel">Archived:&nbsp;</div>
                                             </div>

                                             <div className="narrow card">
                                                  <input type="checkbox" checked={watchListItemDtl.Archived} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("Archived", event.target.checked)} />
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
     );
};

WatchListItemDetail.propTypes = exact({
     BrokenImageIcon: PropTypes.object.isRequired,
     CancelIcon: PropTypes.object.isRequired,
     demoMode: PropTypes.bool.isRequired,
     isAdding: PropTypes.bool.isRequired,
     EditIcon: PropTypes.object.isRequired,
     isEditing: PropTypes.bool.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setIsEditing: PropTypes.func.isRequired,
     setNewWatchListItemDtlID: PropTypes.func.isRequired,
     setWatchListItemDtlID: PropTypes.func.isRequired,
     setWatchListItemsLoadingStarted: PropTypes.func.isRequired,
     setWatchListItemsLoadingComplete: PropTypes.func.isRequired,
     watchListItemDtlID: PropTypes.number.isRequired,
     watchListTypes: PropTypes.array.isRequired,
});

export default WatchListItemDetail;
