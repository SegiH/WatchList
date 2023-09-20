const axios = require("axios");
const exact = require ("prop-types-exact");
const IWatchListItem = require("../interfaces/IWatchListItem");
const IWatchListType = require("../interfaces/IWatchListType");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const useState = require("react").useState;
const useEffect = require("react").useEffect;

const WatchListItemDetail = ({ backendURL, BrokenImageIcon, CancelIcon, isAdding, EditIcon, isEditing, SaveIcon, setIsAdding, setIsEditing, setNewWatchListItemDtlID, setWatchListItemDtlID, setWatchListItemsLoadingComplete, setWatchListItemsLoadingStarted, watchListItemDtlID, watchListTypes }
  :
    {
      backendURL: string,
      BrokenImageIcon: typeof MuiIcon,
      CancelIcon: typeof MuiIcon,
      isAdding: boolean,
      EditIcon: typeof MuiIcon,
      isEditing: boolean,
      SaveIcon: typeof MuiIcon,
      setIsAdding: (arg0: boolean) => void,
      setIsEditing: (arg0: boolean) => void,
      setNewWatchListItemDtlID: (arg0: number) => void,
      setWatchListItemDtlID: (arg0: number) => void,
      setWatchListItemsLoadingComplete: (arg0: boolean) => void,
      setWatchListItemsLoadingStarted: (arg0: boolean) => void,
      watchListItemDtlID: number,
      watchListTypes: typeof IWatchListType
    }
  ) => {
  const [addWatchListItemDtl, setAddWatchListItemDtl] = useState(null);
  const [editModified, setEditModified] = useState(false);
  const [addModified, setAddModified] = useState(false);
  const [originalWatchListItemDtl, setOriginalWatchListItemDtl] = useState(null);
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

  const saveClickHandler = async () => {
    if (!editModified) {
      setIsEditing(false);
      return;
    }

    if (watchListItemDtl.WatchListItemName === "") {
      alert("Please enter the name of the Movie or TV Show");
      return;
    }

    //let queryURL = `${backendURL}/UpdateWatchListItem?WatchListItemID=${watchListItemDtl.WatchListItemID}`;
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
      queryURL = `${backendURL}/UpdateWatchListItem?WatchListItemID=${watchListItemDtl.WatchListItemID}${queryURL}`;

      axios
        .put(queryURL)
        .then((res: typeof WatchListItem) => {
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

    let queryURL = `${backendURL}/AddWatchListItem?WatchListItemName=${addWatchListItemDtl.WatchListItemName}&WatchListTypeID=${addWatchListItemDtl.WatchListTypeID}&IMDB_URL=${addWatchListItemDtl.IMDB_URL}`;

    if (addWatchListItemDtl.IMDB_Poster !== "") {
      queryURL += `&IMDB_Poster=${addWatchListItemDtl.IMDB_Poster}`;
    }

    if (addWatchListItemDtl.ItemNotes !== "") {
      queryURL += `&ItemNotes=${addWatchListItemDtl.ItemNotes}`;
    }

    axios
      .put(queryURL)
      .then((res: typeof IWatchListItem) => {
        if (res.data[0] === "ERROR") {
          alert(`The error ${res.data[1]} occurred while  adding the detail`);
        } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
          alert(res.data[1]);
        } else {
          setAddModified(true);

          setIsAdding(false);

          //closeDetail();

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
      
      axios
        .get(`${backendURL}/GetWatchListItemDtl?WatchListItemID=${watchListItemDtlID}`)
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
      const newAddWatchListItemDtl : typeof IWatchListItem = {};
      newAddWatchListItemDtl.WatchListItemName = "";
      newAddWatchListItemDtl.WatchListTypeID = "-1";
      newAddWatchListItemDtl.IMDB_URL = "";
      newAddWatchListItemDtl.IMDB_Poster = "";
      newAddWatchListItemDtl.ItemNotes = "";

      setAddWatchListItemDtl(newAddWatchListItemDtl);
    }
  }, [backendURL, watchListItemDtl, watchListItemDtlID]);

  const checkURL = async (URL: string) => {
    const result = await axios
      .get(URL)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    return result;
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

  return (
    <>
      {(isAdding || isEditing || (!isEditing && watchListItemDtlLoadingComplete)) && (
        <div className="modal">
          <div className={`modal-content ${watchListItemDtlID != null ? "fade-in" : "fade-out"}`}>
            {!isAdding && !isEditing && (
              <span className="clickable closeButton" onClick={closeDetail}>
                X
              </span>
            )}

            <div className="row">
                 {watchListItemDtl !== null && !isEditing &&
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
                                               {watchListItemDtl.IMDB_Poster !== null && watchListItemDtl.IMDB_Poster_Error !== true && <img className="poster-detail" src={watchListItemDtl.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                               {(watchListItemDtl.IMDB_Poster === null || watchListItemDtl.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                                           </td>
                                     </tr>
                                </tbody>
                           </table>

                           <table>
                                <tbody>
                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Name:&nbsp;</span>
                                          </td>

                                          <td>
                                            <div className="textLabel">
                                                 {watchListItemDtl.WatchListItemName}
                                                 {watchListItemDtl.Archived === true ? " (A)" : ""}
                                            </div>
                                          </td>
                                     </tr>
                                     
                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Type:&nbsp;</span>
                                          </td>

                                          <td>
                                               <span>{watchListItemDtl.WatchListType.WatchListTypeName}</span>
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">URL:&nbsp;</span>
                                          </td>

                                          <td>
                                               <a href={watchListItemDtl.IMDB_URL} target="_blank">
                                                    {watchListItemDtl.IMDB_URL}
                                               </a>
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <div className="leftMargin textLabel">Notes:&nbsp;</div>
                                          </td>

                                          <td>
                                               <div className="leftMargin textLabel">{watchListItemDtl.ItemNotes}</div>
                                          </td>
                                     </tr>
                                </tbody>
                           </table>
                      </>
                 }

                 {watchListItemDtl !== null && isEditing &&
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
                                              {watchListItemDtl.IMDB_Poster !== null && watchListItemDtl.IMDB_Poster_Error !== true && <img className="poster-detail" src={watchListItemDtl.IMDB_Poster} onError={() => showDefaultSrc()} />}

                                              {(watchListItemDtl.IMDB_Poster === null || watchListItemDtl.IMDB_Poster_Error === true) && <span className="brokenImage">{BrokenImageIcon}</span>}
                                         </td>
                                    </tr>
                                </tbody>
                           </table>

                           <table>
                                <tbody>
                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">Name:</span>
                                         </td>

                                         <td>
                                              <input className="inputStyle leftMargin" autoFocus value={watchListItemDtl.WatchListItemName} onChange={(event) => watchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                         </td>
                                    </tr>

                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">Type:</span>
                                         </td>

                                         <td>
                                              <select className="leftMargin selectStyle selectWidth" value={watchListItemDtl.WatchListTypeID} onChange={(event) => watchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                <option value="-1">Please select</option>

                                                {watchListTypes?.map((watchListType: typeof IWatchListType, index: number) => {
                                                  return (
                                                    <option key={index} value={watchListType.WatchListTypeID}>
                                                      {watchListType.WatchListTypeName}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                         </td>
                                    </tr>

                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">URL:</span>
                                         </td>

                                         <td>
                                              <input className="inputStyle leftMargin" value={watchListItemDtl.IMDB_URL} onChange={(event) => watchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                         </td>
                                    </tr>

                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">Image:</span>
                                         </td>

                                         <td>
                                              <input className="inputStyle leftMargin" value={watchListItemDtl.IMDB_Poster} onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onIMDBPosterChangeHandler(event.target.value)} onChange={(event) => watchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                         </td>
                                    </tr>

                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">Notes:</span>
                                         </td>

                                         <td>
                                              <input className="inputStyle leftMargin" value={watchListItemDtl.ItemNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                         </td>
                                    </tr>

                                    <tr>
                                         <td>
                                              <span className="leftMargin textLabel topMargin">Archived:</span>
                                         </td>

                                         <td>
                                              <input type="checkbox" checked={watchListItemDtl.Archived} onChange={(event: React.ChangeEvent<HTMLInputElement>) => watchListItemDetailChangeHandler("Archived", event.target.checked)} />
                                         </td>
                                    </tr>
                                </tbody>
                           </table>
                      </>
                 }

                 {!isEditing && isAdding && addWatchListItemDtl !== null &&
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
                                      
                                      {addWatchListItemDtl.IMDB_Poster !== "" &&
                                           <tr>
                                               <td>
                                                    <span className="column">{addWatchListItemDtl.IMDB_Poster !== null && addWatchListItemDtl.IMDB_Poster_Error !== true && <img className="poster-detail" src={addWatchListItemDtl.IMDB_Poster} />}</span>
                                               </td>
                                           </tr>
                                      }
                                </tbody>
                            </table>

                            <table className="datagrid">
                                <tbody className="data">
                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Name:</span>
                                          </td>

                                          <td>
                                               <input className="inputStyle leftMargin" autoFocus value={addWatchListItemDtl.WatchListItemName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("WatchListItemName", event.target.value)} />
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Type:</span>
                                          </td>

                                          <td>
                                               <select className="leftMargin selectStyle selectWidth" value={addWatchListItemDtl.WatchListTypeID} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => addWatchListItemDetailChangeHandler("WatchListTypeID", event.target.value)}>
                                                    <option value="-1">Please select</option>

                                                    {watchListTypes?.map((watchListType: typeof IWatchListType, index: number) => {
                                                      return (
                                                        <option key={index} value={watchListType.WatchListTypeID}>
                                                          {watchListType.WatchListTypeName}
                                                        </option>
                                                      );
                                                    })}
                                               </select>
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">URL:</span>
                                          </td>

                                          <td>
                                               <input className="inputStyle leftMargin" value={addWatchListItemDtl.IMDB_URL} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_URL", event.target.value)} />
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Image:</span>
                                          </td>

                                          <td>
                                               <input className="inputStyle leftMargin" value={addWatchListItemDtl.IMDB_Poster} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("IMDB_Poster", event.target.value)} />
                                          </td>
                                     </tr>

                                     <tr>
                                          <td>
                                               <span className="leftMargin textLabel topMargin">Notes:</span>
                                          </td>

                                          <td>
                                               <input className="inputStyle leftMargin" value={addWatchListItemDtl.temNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => addWatchListItemDetailChangeHandler("ItemNotes", event.target.value)} />
                                          </td>
                                     </tr>
                                </tbody>
                            </table>
                      </>
                 }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

WatchListItemDetail.propTypes = exact({
  backendURL: PropTypes.string.isRequired,
  BrokenImageIcon: PropTypes.object.isRequired,
  CancelIcon: PropTypes.object.isRequired,
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
