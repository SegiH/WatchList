const axios = require("axios");
const DataGrid = require("@mui/x-data-grid").DataGrid;
const EditToolbar = require("./EditToolbar").default;
const exact = require("prop-types-exact");
const GridActionsCellItem = require("@mui/x-data-grid-pro").GridActionsCellItem;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const IWatchListSource = require("./interfaces/IWatchListSource");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const useState = require("react").useState;

const ManageWatchListSources = ({ CancelIcon, demoMode, EditIcon, SaveIcon, setIsAdding, setIsEditing, setWatchListSources, setWatchListSourcesLoadingComplete, setWatchListSourcesLoadingStarted, watchListSources }
     :
     {
          CancelIcon: typeof MuiIcon,
          demoMode: boolean,
          EditIcon: typeof MuiIcon,
          SaveIcon: typeof MuiIcon,
          setIsAdding: (arg0: boolean) => void,
          setIsEditing: (arg0: boolean) => void,
          setWatchListSources: (arg0: typeof IWatchListSource) => void,
          setWatchListSourcesLoadingComplete: (arg0: boolean) => void,
          setWatchListSourcesLoadingStarted: (arg0: boolean) => void,
          watchListSources: typeof IWatchListSource
     }) => {
     const [rowModesModel, setRowModesModel] = useState({});
     const section = "Source";

     const cancelRowEditClickHandler = (id: typeof IWatchListSource) => () => {
          setRowModesModel({
               ...rowModesModel,
               [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });

          const editedRow = watchListSources.find((row: typeof IWatchListSource) => row.WatchListSourceID === id);

          if (editedRow.isNew) {
               setWatchListSources(watchListSources.filter((row: typeof IWatchListSource) => row.WatchListSourceID !== id));
          }

          setIsAdding(false);
          setIsEditing(false);
     };

     const enterEditModeClickHandler = (id: number) => () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

          setIsEditing(true);
     };

     const processRowUpdateHandler = (newRow: typeof IWatchListSource) => {
          if (demoMode) {
               alert("Adding a source is disabled in demo mode");
               return;
          }

          // validate rows
          if (typeof newRow.WatchListSourceName === "undefined" || newRow.WatchListSourceName === "") {
               alert("Please enter the source name");

               setRowModesModel({ ...rowModesModel, [newRow.WatchListSourceID]: { mode: GridRowModes.Edit } });

               return;
          }

          let columns = ``;

          if (newRow.isNew !== true) {
               columns = `?WatchListSourceID=${newRow.WatchListSourceID}&WatchListSourceName=${encodeURIComponent(newRow.WatchListSourceName)}`;
          } else {
               columns = `?WatchListSourceName=${encodeURIComponent(newRow.WatchListSourceName)}`;
          }

          const endPoint = (newRow.isNew == true ? `/api/AddWatchListSource` : `$/api/UpdateWatchListSource`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IWatchListSource) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setWatchListSourcesLoadingStarted(false);
                         setWatchListSourcesLoadingComplete(false);

                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update sources with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback((error: Error) => { }, []);

     const startRowEditingClickHandler = (params: typeof IWatchListSource, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IWatchListSource, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const columns = [
          {
               field: "WatchListSourceID",
               headerName: "ID",
               width: 100
          },
          {
               field: "WatchListSourceName",
               headerName: "Source name",
               editable: true,
               width: 225,
          },
          {
               field: "actions",
               type: "actions",
               headerName: "Actions",
               width: 100,
               cellClassName: "actions",
               getActions: ({ id }: { id: number }) => {
                    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                    if (isInEditMode) {
                         return [<GridActionsCellItem key={id} icon={<SaveIcon />} className="icon" label="Save" onClick={saveRowEditClickHandler(id)} />, <GridActionsCellItem key={id} icon={<CancelIcon />} label="Cancel" className="icon textPrimary" onClick={cancelRowEditClickHandler(id)} color="inherit" />];
                    }

                    return [<GridActionsCellItem key={id} icon={<EditIcon />} label="Edit" className="icon textPrimary" onClick={enterEditModeClickHandler(id)} color="inherit" />];
               },
          },
     ];

     return (
          <DataGrid
               rows={watchListSources}
               columns={columns}
               editMode="row"
               getRowId={(row: typeof IWatchListSource) => row.WatchListSourceID}
               rowModesModel={rowModesModel}
               onRowEditStart={startRowEditingClickHandler}
               onRowEditStop={stopRowEditingClickHandler}
               processRowUpdate={processRowUpdateHandler}
               onProcessRowUpdateError={processRowUpdateErrorHandler}
               components={{
                    Toolbar: EditToolbar,
               }}
               componentsProps={{
                    toolbar: { section, setIsAdding, setWatchListSources, setRowModesModel, watchListSources },
               }}
               experimentalFeatures={{ newEditingApi: true }}
          />
     );
};

ManageWatchListSources.propTypes = exact({
     CancelIcon: PropTypes.object.isRequired,
     demoMode: PropTypes.bool.isRequired,
     EditIcon: PropTypes.object.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setIsEditing: PropTypes.func.isRequired,
     setWatchListSources: PropTypes.func.isRequired,
     setWatchListSourcesLoadingComplete: PropTypes.func.isRequired,
     setWatchListSourcesLoadingStarted: PropTypes.func.isRequired,
     watchListSources: PropTypes.array.isRequired,
});

export default ManageWatchListSources;