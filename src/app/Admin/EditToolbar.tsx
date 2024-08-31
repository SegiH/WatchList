const exact = require("prop-types-exact");
const PropTypes = require("prop-types");
const React = require("react");
const Button = require("@mui/material/Button").default;
const IBugLog = require("../interfaces/IBugLog");
const IWatchListSource = require("../interfaces/IWatchListSource");
const IWatchListType = require("../interfaces/IWatchListType");
const IUser = require("../interfaces/IUser");
const GridRowModes = require("@mui/x-data-grid").GridRowModes;
const GridToolbarContainer = require("@mui/x-data-grid").GridToolbarContainer;
const useContext = require("react").useContext;

import { DataContext, DataContextType } from "../data-context";

const EditToolbar = ({ section, setRowModesModel, setShowActiveBugLogs, showActiveBugLogs }
     :
     {
          section: string,
          setRowModesModel: (arg0: typeof IUser | typeof IWatchListSource | typeof IWatchListType) => void,
          setShowActiveBugLogs: (value: boolean) => void;
          showActiveBugLogs: boolean
     }) => {

     const {
          bugLogs,
          darkMode,
          getFormattedDate,
          isAdding,
          isEditing,
          setBugLogs,
          setIsAdding,
          setUsers,
          setWatchListSources,
          setWatchListTypes,
          users,
          watchListSources,
          watchListTypes
     } = useContext(DataContext) as DataContextType;

     const handleClick = () => {
          let focusField = '';
          let nextID = -1;

          switch (section) {
               case "User":
                    nextID = Math.max(...users.map((user: typeof IUser) => user.UserID)) + 1;
                    focusField = "Username";
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
               case "Bug Log":
                    if (bugLogs.length > 0) {
                         nextID = Math.max(...bugLogs.map((bugLog: typeof IBugLog) => bugLog.WLBugID)) + 1;
                    } else {
                         nextID = 1;
                    }

                    focusField = "WLBugName";

                    const formattedDate = getFormattedDate(null, "-");

                    setBugLogs((oldRows: typeof IBugLog) => [...oldRows, { WLBugID: nextID, WLBugName: "", AddDate: formattedDate, isNew: true }]);
                    break;
          }

          setIsAdding(true);

          setRowModesModel((oldModel: typeof IUser | typeof IWatchListSource | typeof IWatchListType | typeof IBugLog) => ({
               ...oldModel,
               [nextID]: { mode: GridRowModes.Edit, fieldToFocus: focusField },
          }));
     };

     return (
          <>
               {!isAdding && !isEditing &&
                    <GridToolbarContainer>
                         <Button color="primary" onClick={handleClick}>
                              Add {section}
                         </Button>

                         {section === "Bug Log" &&
                              <span>
                                   Show Active Bug Logs
                                   <input className={`${!darkMode ? "lightMode" : "darkMode"}`} type="checkbox" checked={showActiveBugLogs} onChange={(event) => setShowActiveBugLogs(event.target.checked)} />
                              </span>
                         }
                    </GridToolbarContainer>
               }
          </>
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