const exact = require ("prop-types-exact");
const IWatchList = require("../interfaces/IWatchList");
const IWatchListItem = require("../interfaces/IWatchListItem");
const IWatchListSource = require("../interfaces/IWatchListSource");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;
const useState = require("react").useState;
const WatchListDetail = require("./WatchListDetail").default;

const WatchList = ({
  AddIcon,
  archivedVisible,
  autoAdd,
  backendURL,
  BrokenImageIcon,
  CancelIcon,
  isAdding,
  EditIcon,
  isIMDBSearchEnabled,
  isEditing,
  isLoggedIn,
  newWatchListItemDtlID,
  ratingMax,
  SaveIcon,
  searchTerm,
  setActiveRoute,
  setIsAdding,
  setIsEditing,
  setNewWatchListItemDtlID,
  setWatchList,
  setWatchListLoadingComplete,
  setWatchListLoadingStarted,
  setWatchListSortingComplete,
  stillWatching,
  sourceFilter,
  typeFilter,
  watchList,
  watchListItems,
  watchListLoadingComplete,
  watchListSortColumn,
  watchListSortDirection,
  watchListSortingComplete,
  watchListSources,
}
:
{
  AddIcon: typeof MuiIcon,
  archivedVisible: boolean,
  autoAdd: boolean,
  backendURL: string,
  BrokenImageIcon: typeof MuiIcon,
  CancelIcon: typeof MuiIcon,
  isAdding: boolean,
  EditIcon: typeof MuiIcon,
  isIMDBSearchEnabled: boolean,
  isEditing: boolean,
  isLoggedIn: boolean,
  newWatchListItemDtlID: number,
  ratingMax: number,
  SaveIcon: typeof MuiIcon,
  searchTerm: string,
  setActiveRoute: (arg0: string) => void,
  setIsAdding: (arg0: boolean) => void,
  setIsEditing: (arg0: boolean) => void,
  setNewWatchListItemDtlID: (arg0: number) => void,
  setWatchList: (arg0: typeof IWatchList) => void,
  setWatchListLoadingComplete: (arg0: boolean) => void,
  setWatchListLoadingStarted: (arg0: boolean) => void,
  setWatchListSortingComplete: (arg0: boolean) => void,
  stillWatching: boolean,
  sourceFilter: string,
  typeFilter: string,
  watchList: typeof IWatchList,
  watchListItems: typeof IWatchListItem,
  watchListLoadingComplete: boolean,
  watchListSortColumn: string,
  watchListSortDirection: string,
  watchListSortingComplete: boolean,
  watchListSources: typeof IWatchListSource,
}
) => {
  const [watchListDtlID, setWatchListDtlID] = useState(null);

  const openDetailClickHandler = (watchListID: number) => {
    if (watchListID !== null) {
      if (watchListID === -1) {
        setIsAdding(true);
      }

      setWatchListDtlID(watchListID);
    }
  };

  const showDefaultSrc = (watchListID: number) => () : void => {
    const newWatchList = Object.assign([], watchList);

    const currentWatchListResult = newWatchList?.filter((currentWatchList: typeof IWatchList) => {
      return String(currentWatchList.WatchListID) === String(watchListID);
    });

    if (currentWatchListResult === 0) {
      // this shouldn't ever happen!
      return null;
    }

    const currentWatchList = currentWatchListResult[0];

    currentWatchList["IMDB_Poster_Error"] = true;

    setWatchList(newWatchList);
  };

  useEffect(() => {
    if (watchListDtlID === null && newWatchListItemDtlID !== null && autoAdd) {
      openDetailClickHandler(-1);
    }
  }, [newWatchListItemDtlID]);

  useEffect(() => {
    if (!watchListSortingComplete && watchListLoadingComplete) {
      const newWatchList = Object.assign([], watchList);

      newWatchList.sort((a: typeof IWatchList, b: typeof IWatchList) => {
        switch (watchListSortColumn) {
          case "ID":
            return parseInt(a.WatchListID) > parseInt(b.WatchListID) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
          case "Name":
            const aName = a.WatchListItem.WatchListItemName;
            const bName = b.WatchListItem.WatchListItemName;

            return String(aName) > String(bName) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
          case "StartDate":
            return parseFloat(new Date(a.StartDate).valueOf().toString()) > parseFloat(new Date(b.StartDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
          case "EndDate":
            return parseFloat(new Date(a.EndDate).valueOf().toString()) > parseFloat(new Date(b.EndDate).valueOf().toString()) ? (watchListSortDirection === "ASC" ? 1 : -1) : watchListSortDirection === "ASC" ? -1 : 1;
        }
      });

      setWatchList(newWatchList);
      setWatchListSortingComplete(true);
    }
  }, [watchListLoadingComplete, watchListSortingComplete]);

  return (
    <>
      {isLoggedIn && (
        <span className="clickable customTopMargin" onClick={() => openDetailClickHandler(-1)}>
          {AddIcon}
        </span>
      )}

      <ul className="clickable show-list">
        {watchList
          ?.filter(
            (currentWatchList: typeof IWatchList) =>
              currentWatchList.Archived === archivedVisible &&
              (searchTerm === "" || (searchTerm !== "" && currentWatchList.WatchListItem.WatchListItemName.toLowerCase().includes(searchTerm))) &&
              ((stillWatching === false && (currentWatchList.EndDate !== null || (currentWatchList.EndDate === null && currentWatchList.Archived === true))) || (stillWatching == true && currentWatchList.EndDate === null && currentWatchList.Archived === archivedVisible)) &&
              (sourceFilter === "-1" || sourceFilter === null || (sourceFilter !== "-1" && sourceFilter !== null && String(currentWatchList.WatchListSourceID) === String(sourceFilter))) &&
              (typeFilter === "-1" || (typeFilter !== "-1" && String(currentWatchList.WatchListTypeID) === String(typeFilter))),
          )
          .map((currentWatchList: typeof IWatchList, index: number) => {
            return (
              <React.Fragment key={index}>
                {watchListSortingComplete && (
                  <li className="show-item" key={index}>
                    <span className="item-id">
                      <div>{currentWatchList.WatchListID}</div>
                    </span>

                    <a className="show-link" onClick={() => openDetailClickHandler(currentWatchList.WatchListID)}>
                      <div className="image-crop">
                        {currentWatchList.WatchListItem.IMDB_Poster !== null && currentWatchList.IMDB_Poster_Error !== true && <img src={currentWatchList.WatchListItem.IMDB_Poster} onError={() => showDefaultSrc(currentWatchList.WatchListID)} />}

                        {(currentWatchList.WatchListItem.IMDB_Poster === null || currentWatchList.IMDB_Poster_Error === true) && <>{BrokenImageIcon}</>}
                      </div>
                    </a>

                    <div className="show-title">
                      {typeof currentWatchList.WatchListItem.IMDB_URL !== "undefined" &&
                           <a href={currentWatchList.WatchListItem.IMDB_URL} target='_blank'>{currentWatchList.WatchListItem.WatchListItemName}</a>
                      }

                      {typeof currentWatchList.WatchListItem.IMDB_URL === "undefined" &&
                           <div>
                                {currentWatchList.WatchListItem.WatchListItemName}
                           </div>
                      }

                      {currentWatchList.Archived === true ? " (A)" : ""}
                    </div>

                    {currentWatchList.WatchListItem.WatchListType.WatchListTypeID === 2 && <div>Season {currentWatchList.Season}</div>}

                    <div>
                      {currentWatchList.StartDate}
                      {currentWatchList.EndDate !== null && currentWatchList.EndDate !== currentWatchList.StartDate ? ` - ${currentWatchList.EndDate}` : ""}
                    </div>

                    <div>
                      {currentWatchList.WatchListItem.WatchListType.WatchListTypeName}
                    </div>

                    <div>
                      {currentWatchList.WatchListSource.WatchListSourceName}
                    </div>

                    {currentWatchList.Rating !== null && (
                      <div>
                        {currentWatchList.Rating}/{ratingMax}
                      </div>
                    )}
                  </li>
                )}
              </React.Fragment>
            );
          })}
      </ul>

      {watchListDtlID !== null && (
        <WatchListDetail
          backendURL={backendURL}
          BrokenImageIcon={BrokenImageIcon}
          CancelIcon={CancelIcon}
          EditIcon={EditIcon}
          isAdding={isAdding}
          isEditing={isEditing}
          isIMDBSearchEnabled={isIMDBSearchEnabled}
          newWatchListItemDtlID={newWatchListItemDtlID}
          ratingMax={ratingMax}
          SaveIcon={SaveIcon}
          setActiveRoute={setActiveRoute}
          setIsAdding={setIsAdding}
          setIsEditing={setIsEditing}
          setNewWatchListItemDtlID={setNewWatchListItemDtlID}
          setWatchListDtlID={setWatchListDtlID}
          setWatchListLoadingStarted={setWatchListLoadingStarted}
          setWatchListLoadingComplete={setWatchListLoadingComplete}
          setWatchListSortingComplete={setWatchListSortingComplete}
          watchListDtlID={watchListDtlID}
          watchListItems={watchListItems}
          watchListSortDirection={watchListSortDirection}
          watchListSources={watchListSources}
        />
      )}
    </>
  );
};

WatchList.propTypes = exact({
  AddIcon: PropTypes.object.isRequired,
  archivedVisible: PropTypes.bool.isRequired,
  autoAdd: PropTypes.bool.isRequired,
  backendURL: PropTypes.string.isRequired,
  BrokenImageIcon: PropTypes.object.isRequired,
  CancelIcon: PropTypes.object.isRequired,
  isAdding: PropTypes.bool.isRequired,
  EditIcon: PropTypes.object.isRequired,
  isIMDBSearchEnabled: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  newWatchListItemDtlID: PropTypes.number,
  ratingMax: PropTypes.number.isRequired,
  SaveIcon: PropTypes.object.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setActiveRoute: PropTypes.func.isRequired,
  setIsAdding: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  setNewWatchListItemDtlID: PropTypes.func.isRequired,
  setWatchList: PropTypes.func.isRequired,
  setWatchListLoadingComplete: PropTypes.func.isRequired,
  setWatchListLoadingStarted: PropTypes.func.isRequired,
  setWatchListSortingComplete: PropTypes.func.isRequired,
  stillWatching: PropTypes.bool.isRequired,
  sourceFilter: PropTypes.string.isRequired,
  typeFilter: PropTypes.string.isRequired,
  watchList: PropTypes.array.isRequired,
  watchListItems: PropTypes.array.isRequired,
  watchListLoadingComplete: PropTypes.bool.isRequired,
  watchListSortColumn: PropTypes.string.isRequired,
  watchListSortDirection: PropTypes.string.isRequired,
  watchListSortingComplete: PropTypes.bool.isRequired,
  watchListSources: PropTypes.array.isRequired,
});

export default WatchList;
