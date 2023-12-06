const Autocomplete = require("@mui/material/Autocomplete").default;
const axios = require("axios");
const exact = require ("prop-types-exact");
const IWatchList = require("../interfaces/IWatchList");
const IWatchListItem = require("../interfaces/IWatchListItem");
const IWatchListSource = require("../interfaces/IWatchListSource");
const PropTypes = require("prop-types");
const React = require("react");
const ReactNode = require("react").ReactNode;
const TextField = require("@mui/material/TextField").default;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

const EmptyIcon = require("@mui/icons-material/StarBorder").default;
const EmptyIconComponent = <EmptyIcon />;

const FullIcon = require("@mui/icons-material/Grade").default;
const FullIconComponent = <FullIcon />;

const HalfIcon = require("@mui/icons-material/StarHalf").default;
const HalfIconComponent = <HalfIcon />;

const WatchListDetail = ({ backendURL, BrokenImageIcon, CancelIcon, isAdding, EditIcon, isEditing, newWatchListItemDtlID, ratingMax, SaveIcon, setIsAdding, setIsEditing, setNewWatchListItemDtlID, setWatchListDtlID, setWatchListLoadingStarted, setWatchListLoadingComplete, setWatchListSortingComplete, watchListDtlID, watchListItems, watchListSortDirection, watchListSources }
  :
  {
  backendURL: string,
  BrokenImageIcon: typeof MuiIcon,
  CancelIcon: typeof MuiIcon,
  isAdding: boolean,
  EditIcon: typeof MuiIcon,
  isEditing: boolean,
  isLoggedIn: boolean,
  newWatchListItemDtlID: number,
  ratingMax: number,
  SaveIcon: typeof MuiIcon,
  searchTerm: string,
  setIsAdding: (arg0: boolean) => void,
  setIsEditing: (arg0: boolean) => void,
  setNewWatchListItemDtlID: (arg0: number) => void,
  setWatchListDtlID: (arg0: number) => void,
  setWatchListLoadingStarted: (arg0: boolean) => void,
  setWatchListLoadingComplete: (arg0: boolean) => void,
  setWatchListSortingComplete: (arg0: boolean) => void,
  watchListDtlID: number
  watchListItems: typeof IWatchListItem,
  watchListSortDirection: string,
  watchListSources: typeof IWatchListSource
  }
  ) => {
  const [addWatchListDtl, setAddWatchListDtl] = useState(null);
  const [autoCompleteNames, setAutoCompleteNames] = useState(null);
  const [originalWatchListDtl, setOriginalWatchListDtl] = useState(null);
  const [editModified, setEditModified] = useState(false);
  const [addModified, setAddModified] = useState(false);
  const [watchListDtl, setWatchListDtl] = useState(null);
  const [watchListDtlLoadingStarted, setWatchListDtlLoadingStarted] = useState(false);
  const [watchListDtlLoadingComplete, setWatchListDtlLoadingComplete] = useState(false);

  const defaultProps = {
    options: autoCompleteNames,
    getOptionLabel: (option: typeof ReactNode) => option.toString(),
  };

  const addWatchListDetailChangeHandler = (fieldName: string, fieldValue: string) => {
    const newAddWatchListDtl = Object.assign({}, addWatchListDtl);

    newAddWatchListDtl[fieldName] = fieldValue;
    newAddWatchListDtl.IsModified = true;

    setAddWatchListDtl(newAddWatchListDtl);
  };

  const cancelClickHandler = async () => {
    setIsEditing(false);
    setWatchListDtl(originalWatchListDtl);
    setOriginalWatchListDtl(null);
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

  const getRatingIcon = (index: number) => {
    if (isAdding) return addWatchListDtl.Rating > index + 0.5 ? FullIconComponent : addWatchListDtl.Rating === index + 0.5 ? HalfIconComponent : EmptyIconComponent;
    else return watchListDtl?.Rating > index + 0.5 ? FullIconComponent : watchListDtl?.Rating === index + 0.5 ? HalfIconComponent : EmptyIconComponent;
  };

  const ratingClickHandler = (index: number) => {
    if (!isAdding && !isEditing) return true;

    if (isAdding) {
      if (String(addWatchListDtl.Rating + ".0") === String(index + ".0")) {
        addWatchListDtl.Rating = index + 0.5;
      } else if (String(addWatchListDtl.Rating) === String(index + ".5")) {
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

  const saveClickHandler = async () => {
    if (watchListDtl.WatchListItemID === "-1") {
      alert("Please select the Movie or TV Show");
      return;
    }

    /*if (watchListDtl.StartDate === "") {
      alert("Please enter the start date");
      return;
    }*/

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
           watchListDtl.StartDate=`${watchListDtl.StartDate.substring(0, 4)}-${watchListDtl.StartDate.substring(4,6)}-${watchListDtl.StartDate.substring(6,8)}`;
      }

      queryURL += `&StartDate=${watchListDtl.StartDate}`;
    }

    if (watchListDtl.EndDateIsModified === true) {
      // Fix end date formatting
      if (watchListDtl.EndDate.toString().indexOf("-") === -1) {
           watchListDtl.EndDate=`${watchListDtl.EndDate.substring(0, 4)}-${watchListDtl.EndDate.substring(4,6)}-${watchListDtl.EndDate.substring(6,8)}`;
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
      queryURL = `${backendURL}/UpdateWatchList?WatchListID=${watchListDtl.WatchListID}${queryURL}`;

      axios
        .put(queryURL)
        .then((res: typeof IWatchListItem) => {
          if (res.data[0] === "ERROR") {
            alert(`The error ${res.data[1]} occurred while  updating the detail`);
          } else {
            setIsEditing(false);

            setEditModified(true);
          }
        })
        .catch((err: Error) => {
          alert(`The error ${err.message} occurred while updating the detail`);
        });
    } else {
      setIsEditing(false);
    }
  };

  const saveNewClickHandler = async () => {
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

    let queryURL = `${backendURL}/AddWatchList?WatchListItemID=${addWatchListDtl.WatchListItemID}&StartDate=${addWatchListDtl.StartDate.substring(0, 10)}&WatchListSourceID=${addWatchListDtl.WatchListSourceID}`;

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

    axios
      .put(queryURL)
      .then((res: typeof IWatchListItem) => {
        if (res.data[0] === "ERROR") {
          alert(`The error ${res.data[1]} occurred while  adding the detail`);
        } else {
          //Update data
          setWatchListDtlID(res.data[1]);

          setIsAdding(false);

          setAddModified(true);

          //closeDetail();
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

  const watchListDetailChangeHandler = (fieldName: string, fieldValue: boolean | string) => {
    const newWatchListDtl = Object.assign({}, watchListDtl);

    newWatchListDtl[fieldName] = fieldValue;
    newWatchListDtl[`${fieldName}IsModified`] = true;

    if (fieldName === "WatchListItemID") {
      const watchListItem = watchListItems.filter((watchListItem: typeof IWatchListItem) => {
        return String(watchListItem.WatchListItemID) === String(fieldValue);
      });

      if (watchListItem.length === 1) {
        newWatchListDtl["WatchListItem"] = watchListItem[0];
      }
    }

    setWatchListDtl(newWatchListDtl);
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
      } else if (isEditing) {
        const newWatchListDtl = Object.assign({}, watchListDtl);
        newWatchListDtl["WatchListItemID"] = watchListItem[0].WatchListItemID;
        newWatchListDtl["WatchListItem"] = watchListItem[0];
        newWatchListDtl[`WatchListItemIDIsModified`] = true;
        setWatchListDtl(newWatchListDtl);
      }
    }
  };

  useEffect(() => {
    if (!watchListDtlLoadingStarted && !watchListDtlLoadingComplete && watchListDtlID !== null && watchListDtlID !== -1 && !isNaN(watchListDtlID)) {
      setWatchListDtlLoadingStarted(true);

      axios
        .get(`${backendURL}/GetWatchListDtl?WatchListID=${watchListDtlID}`)
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
      const newAddWatchListDtl : typeof IWatchList = {};
      newAddWatchListDtl.WatchListItemID = newWatchListItemDtlID !== null ? newWatchListItemDtlID : "-1";
      newAddWatchListDtl.StartDate = new Date().toISOString().slice(0, 10);
      newAddWatchListDtl.EndDate = "";
      newAddWatchListDtl.WatchListSourceID = "";
      newAddWatchListDtl.Season = "";
      newAddWatchListDtl.Rating = "0";
      newAddWatchListDtl.Notes = "";

      setAddWatchListDtl(newAddWatchListDtl);
    }
  }, [backendURL, newWatchListItemDtlID, watchListDtl, watchListDtlID, watchListDtlLoadingStarted, watchListDtlLoadingComplete]);

  useEffect(() => {
    if (watchListItems.length > 0) {
      // Generate names for auto complete
      const namesOnlyItems = watchListItems.map((watchListItem: typeof IWatchListItem) => {
        return watchListItem.WatchListItemName;
      });

      const namesOnly = namesOnlyItems.sort();

      setAutoCompleteNames(namesOnly);
    }
  }, [watchListItems]);

  return (
    <>
      {(isAdding || isEditing || (!isEditing && watchListDtlLoadingComplete)) && (
        <div className="modal">
          <div className={`modal-content ${watchListDtlID != null ? "fade-in" : "fade-out"}`}>
            {!isAdding && !isEditing && (
              <span className="clickable closeButton" onClick={closeDetail}>
                X
              </span>
            )}

            <div className="row">
              {watchListDtl !== null && !isEditing &&
                <>
                     <table className="datagrid">
                        <tbody className="data">
                            <tr>
                              <td>
                                   <span>
                                        <span onClick={startEditing}>
                                             <span className="clickable editsaveCancelButton">{EditIcon}</span>
                                        </span>
                                   </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                   <div className="textLabel">
                                        {typeof watchListDtl.WatchListItem.IMDB_URL !== "undefined" &&
                                             <a href={watchListDtl.WatchListItem.IMDB_URL} target='_blank'>{watchListDtl.WatchListItem.WatchListItemName}</a>
                                        }

                                        {typeof watchListDtl.WatchListItem.IMDB_URL === "undefined" &&
                                             <div>
                                                  {watchListDtl.WatchListItem.WatchListItemName}
                                             </div>
                                        }

                                        {watchListDtl.Archived === true ? " (A)" : ""}
                                   </div>
                              </td>
                            </tr>

                            <tr>
                                 <td>
                                      {watchListDtl.WatchListItem.IMDB_Poster !== null && watchListDtl.IMDB_Poster_Error !== true && <img className="poster-detail" src={watchListDtl.WatchListItem.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                      {(watchListDtl.WatchListItem.IMDB_Poster === null || watchListDtl.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                                 </td>
                            </tr>                            
                        </tbody>
                     </table>
                            
                     <table>
                        <tbody>
                            <tr>
                                 <td>
                                      <span className="textLabel">Start Date:&nbsp;</span>                                      
                                 </td>
                                 
                                 <td>
                                      <span>{watchListDtl.StartDate && watchListDtl.StartDate}</span>
                                 </td>
                            </tr>

                            <tr>
                                 <td>
                                      <span className="textLabel topMargin">End Date:&nbsp;</span>
                                 </td>

                                 <td>
                                      <span>{watchListDtl.EndDate && watchListDtl.EndDate}</span>
                                 </td>
                            </tr>

                            <tr>
                                 <td>
                                      <div className="textLabel">Source:&nbsp;</div>
                                 </td>

                                 <td>
                                      <div className="textLabel">{watchListDtl.WatchListSource.WatchListSourceName}</div>
                                 </td>
                            </tr>

                            {watchListDtl.WatchListItem.WatchListType.WatchListTypeID === 2 &&
                              <tr>
                                  <td>
                                       <div className="textLabel">Season:</div>
                                  </td>

                                  <td>
                                       <div className="textLabel">{watchListDtl.Season}</div>
                                  </td>
                              </tr>
                            }

                            <tr>
                                 <td>
                                      <div className="textLabel">Notes:</div>
                                 </td>
                                 
                                 <td>
                                       <div className="textLabel">{watchListDtl.Notes}</div>
                                 </td>
                            </tr>

                            <tr>
                                 <td>
                                      <span className="textLabel">Rating: </span>
                                 </td>

                                 <td>
                                      <span>
                                        {Array.from(Array(ratingMax), (e: Event, index: number) => {
                                          return (
                                            <span className="favoriteIcon" key={index}>
                                              {getRatingIcon(index)}
                                            </span>
                                          );
                                        })}
                                      </span>

                                      <span className="ratingAlt">
                                        <div>
                                          {watchListDtl.Rating}/{ratingMax}
                                        </div>
                                      </span>
                                 </td>
                            </tr>
                        </tbody>
                     </table>                  
                </>
              }

              {watchListDtl !== null && isEditing && (
                <>
                     <table className="datagrid">
                        <tbody className="data">
                            <tr>
                              <td>
                                   <span className="saveCancelIcons editSaveCancelPanel">
                                        <span className="clickable editsaveCancelButton saveIcon" onClick={saveClickHandler}>
                                             {SaveIcon}
                                        </span>
                                    </span>
                              </td>

                              <td>
                                    <span className="clickable editsaveCancelButton iconCancel" onClick={cancelClickHandler}>
                                          {CancelIcon}
                                    </span>
                              </td>
                            </tr>

                            <tr>
                                 <td>
                                      {watchListDtl.WatchListItem.IMDB_Poster !== null && watchListDtl.IMDB_Poster_Error !== true && <img className="poster-detail" src={watchListDtl.WatchListItem.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                      {(watchListDtl.WatchListItem.IMDB_Poster === null || watchListDtl.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                                 </td>
                            </tr>                            
                        </tbody>
                     </table>

                     <table className="datagrid">
                        <tbody className="data">
                            <tr>
                                 <td>
                                      <Autocomplete id="wl_autocomplete" className="leftMargin" size="small" sx={{ width: 250, height: 50 }} {...defaultProps} onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => autoCompleteChangeHandler(event)} renderInput={(params: typeof ReactNode) => <TextField {...params} label="Search" />} />
                                 </td>
                            </tr>

                            <tr>
                                 <select className="leftMargin selectStyle selectWidth" autoFocus value={watchListDtl.WatchListItemID} onChange={(event) => watchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                    <option value="-1">Please select</option>

                                    {watchListItems
                                      ?.sort((a: typeof IWatchListItem, b: typeof IWatchListItem) => {
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
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Start Date:</span>                                   
                              </td>

                              <td>
                                   <input type="date" className="leftMargin" value={watchListDtl.StartDate !== null ? watchListDtl.StartDate : ""} onChange={(event) => watchListDetailChangeHandler("StartDate", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin  textLabel topMargin">End Date:</span>
                              </td>

                              <td>
                                   <input type="date" className="leftMargin" value={watchListDtl.EndDate !== null ? watchListDtl.EndDate : ""} onChange={(event) => watchListDetailChangeHandler("EndDate", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Source:</span>                                    
                              </td>
                              
                              <td>
                                   <select className="leftMargin selectStyle selectWidth" value={watchListDtl.WatchListSourceID} onChange={(event) => watchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                      <option value="-1">Please select</option>

                                      {watchListSources?.map((watchListSource: typeof IWatchListSource, index: number) => {
                                        return (
                                          <option key={index} value={watchListSource.WatchListSourceID}>
                                            {watchListSource.WatchListSourceName}
                                          </option>
                                        );
                                      })}
                                   </select>
                              </td>
                            </tr>

                            {watchListDtl.WatchListItem.WatchListType.WatchListTypeID === 2 &&
                              <tr>
                                <td>
                                     <span className="leftMargin textLabel topMargin">Season:</span>
                                </td>

                                <td>
                                     <input className="inputStyle leftMargin narrowWidth" type="number" value={watchListDtl.Season !== null ? watchListDtl.Season : ""} onChange={(event) => watchListDetailChangeHandler("Season", event.target.value)} />
                                </td>
                              </tr>
                            }

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Notes:</span>
                              </td>

                              <td>
                                   <input className="inputStyle leftMargin" value={watchListDtl.Notes} onChange={(event) => watchListDetailChangeHandler("Notes", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="customTopMargin leftMargin textLabel topMargin">Rating: </span>
                              </td>

                              <td>
                                   <span className="customTopMargin clickable leftMargin">
                                      {Array.from(Array(ratingMax), (e, index) => {
                                        return (
                                          <span className="favoriteIcon" key={index} onClick={() => ratingClickHandler(index)}>
                                            {getRatingIcon(index)}
                                          </span>
                                        );
                                      })}
                                    </span>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="customTopMargin leftMargin rightMargin textLabel">Archived:</span>
                              </td>

                              <td>
                                   <input className="customTopMargin leftMargin" type="checkbox" checked={watchListDtl.Archived} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListDetailChangeHandler("Archived", event.target.checked)} />
                              </td>
                            </tr>
                        </tbody>
                      </table>
                </>
              )}

              {!isEditing && isAdding && addWatchListDtl !== null && (
                <>
                     <table className="datagrid">
                        <tbody className="data">
                            <tr>
                              <td>
                                  <span className="saveCancelIcons editSaveCancelPanel">
                                      <span className="clickable editsaveCancelButton saveIcon" onClick={saveNewClickHandler}>
                                          {SaveIcon}
                                      </span>
                                  </span>
                              </td>

                              <td>
                                   <span className="clickable editsaveCancelButton iconCancel" onClick={closeDetail}>
                                        {CancelIcon}
                                   </span>
                              </td>
                            </tr>

                            {addWatchListDtl.WatchListItemID !== "-1" &&
                            <tr>
                              <td>
                                   <span className="column">{watchListItems?.filter((currentWatchListItem: typeof IWatchListItem) => String(currentWatchListItem.WatchListItemID) === String(addWatchListDtl.WatchListItemID)).length === 1 && <img className="poster-detail" src={watchListItems?.filter((currentWatchListItem: typeof IWatchListItem) => String(currentWatchListItem.WatchListItemID) === String(addWatchListDtl.WatchListItemID))[0].IMDB_Poster} />}</span>
                              </td>
                            </tr>
                            }
                        </tbody>
                     </table>

                     <table className="datagrid">
                        <tbody className="data">
                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Item:</span>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <Autocomplete id="wl_autocomplete" className="leftMargin" size="small" sx={{ width: 250, height: 50 }} {...defaultProps} onChange={(event: React.ChangeEvent<HTMLInputElement>) => autoCompleteChangeHandler(event)} renderInput={(params: typeof ReactNode) => <TextField {...params} label="WatchList" />} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                  <select className="leftMargin selectStyle" autoFocus value={addWatchListDtl.WatchListItemID} onChange={(event) => addWatchListDetailChangeHandler("WatchListItemID", event.target.value)}>
                                    <option value="-1">Please select</option>

                                    {watchListItems
                                      ?.filter((currentWatchListItem: typeof IWatchListItem) => currentWatchListItem.Archived === false)
                                      ?.sort((a: typeof IWatchListItem , b: typeof IWatchListItem) => {
                                        return String(a.WatchListItemName) > String(b.WatchListItemName) ? 1 : -1;
                                      })
                                      .map((watchListItem: typeof IWatchListItem, index: number) => {
                                        return (
                                          <option key={index} value={watchListItem.WatchListItemID}>
                                            {watchListItem.WatchListItemName}
                                          </option>
                                        )
                                    })}
                                  </select>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Start Date:</span>
                              </td>

                              <td>
                                   <input type="date" className="leftMargin" value={addWatchListDtl.StartDate} onChange={(event) => addWatchListDetailChangeHandler("StartDate", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin  textLabel topMargin">End Date:</span>
                              </td>

                              <td>
                                   <input type="date" className="leftMargin" value={addWatchListDtl.EndDate} onChange={(event) => addWatchListDetailChangeHandler("EndDate", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Source:</span>
                              </td>

                              <td>
                                   <select className="leftMargin selectStyle" value={addWatchListDtl.WatchListSourceID} onChange={(event) => addWatchListDetailChangeHandler("WatchListSourceID", event.target.value)}>
                                        <option value="-1">Please select</option>

                                        {watchListSources?.map((watchListSource: typeof IWatchListSource, index: number) => {
                                          return (
                                            <option key={index} value={watchListSource.WatchListSourceID}>
                                              {watchListSource.WatchListSourceName}
                                            </option>
                                          );
                                        })}
                                   </select>
                              </td>
                            </tr>

                            {addWatchListDtl.WatchListItemID !== "-1" && getWatchListTypeID(addWatchListDtl.WatchListItemID) === 2 &&
                              <tr>
                                <td>
                                     <span className="leftMargin textLabel topMargin">Season:</span>
                                </td>

                                <td>
                                     <input className="inputStyle leftMargin narrowWidth" type="number" value={addWatchListDtl.Season} onChange={(event) => addWatchListDetailChangeHandler("Season", event.target.value)} />
                                </td>
                              </tr>
                            }

                            <tr>
                              <td>
                                   <span className="leftMargin textLabel topMargin">Notes:</span>
                              </td>

                              <td>
                                   <input className="inputStyle leftMargin" value={addWatchListDtl.Notes} onChange={(event) => addWatchListDetailChangeHandler("Notes", event.target.value)} />
                              </td>
                            </tr>

                            <tr>
                              <td>
                                   <span className="customTopMargin leftMargin textLabel topMargin">Rating: </span>
                              </td>

                              <td>
                                    <span className="customTopMargin clickable leftMargin">
                                      {Array.from(Array(ratingMax), (e, index) => {
                                        return (
                                          <span className="favoriteIcon" key={index} onClick={(event) => ratingClickHandler(index)}>
                                            {getRatingIcon(index)}
                                          </span>
                                        );
                                      })}
                                    </span>
                              </td>
                            </tr>
                        </tbody>
                     </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

WatchListDetail.propTypes = exact({
  backendURL: PropTypes.string.isRequired,
  BrokenImageIcon: PropTypes.object.isRequired,
  CancelIcon: PropTypes.object.isRequired,
  isAdding: PropTypes.bool.isRequired,
  EditIcon: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  newWatchListItemDtlID: PropTypes.number,
  ratingMax: PropTypes.number.isRequired,
  SaveIcon: PropTypes.object.isRequired,
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
});

export default WatchListDetail;
