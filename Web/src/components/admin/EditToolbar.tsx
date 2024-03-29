const exact = require ("prop-types-exact");
const PropTypes = require("prop-types");
const React = require("react");
const Button = require("@mui/material/Button").default;
const IWatchListSource = require("../../interfaces/IWatchListSource");
const IWatchListType = require("../../interfaces/IWatchListType");
const IUser = require("../../interfaces/IUser");
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const GridToolbarContainer = require("@mui/x-data-grid-pro").GridToolbarContainer;

const EditToolbar = ({ section, setRowModesModel, setIsAdding, setUsers, setWatchListSources, setWatchListTypes, users, watchListSources, watchListTypes }
     :
     {
          section: string,
          setRowModesModel: (arg0: typeof IUser | typeof IWatchListSource | typeof IWatchListType) => void,
          setIsAdding: (arg0: boolean) => void,
          setUsers: (arg0: typeof IUser) => void,
          setWatchListSources: (arg0: typeof IWatchListSource) => void,
          setWatchListTypes: (arg0: typeof IWatchListType) => void,
          users: typeof IUser, watchListSources: typeof IWatchListSource,
          watchListTypes: typeof IWatchListSource
     }) => {
          const handleClick = () => {
               let focusField = '';
               let nextID=-1;

               switch(section) {
                    case "User":
                         focusField = "Username";
                         nextID = Math.max(...users.map((user: typeof IUser) => user.UserID)) + 1;
                         setUsers((oldRows: typeof IUser) => [...oldRows, { UserID: nextID, Username: "", Password: "", Realname: "", Admin: false, Enabled: true, isNew: true }]);
                         break;
                    case "Source":
                         nextID = Math.max(...watchListSources.map((watchListSource: typeof IWatchListSource) => watchListSource.WatchListSourceID)) + 1;
                         focusField = "WatchListSourceName";
                         setWatchListSources((oldRows: typeof IWatchListSource) => [...oldRows, { WatchListSourceID: nextID, WatchListSourceName: "", isNew: true }]);
                         break;
                    case "Type":
                         nextID = Math.max(...watchListTypes.map((watchListType: typeof IWatchListType) => watchListType.WatchListTypeID)) + 1;
                         focusField = "WatchListTypeName";
                         setWatchListTypes((oldRows: typeof IWatchListType) => [...oldRows, { WatchListTypeID: nextID, WatchListTypeName: "", isNew: true }]);
                         break;
               }

               setIsAdding(true);

               setRowModesModel((oldModel:  typeof IUser | typeof IWatchListSource | typeof IWatchListType) => ({
                    ...oldModel,
                    [nextID]: { mode: GridRowModes.Edit, fieldToFocus: focusField },
               }));
          };

          return (
               <GridToolbarContainer>
                    <Button color="primary" onClick={handleClick}>
                         Add {section}
                    </Button>
               </GridToolbarContainer>
          );
};

EditToolbar.propTypes = exact({
     section: PropTypes.string.isRequired,
     setRowModesModel: PropTypes.func.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setUsers: PropTypes.func,
     setWatchListSources: PropTypes.func,
     setWatchListTypes: PropTypes.func,
     users: PropTypes.array,
     watchListSources: PropTypes.array,
     watchListTypes: PropTypes.array
});

export default EditToolbar;