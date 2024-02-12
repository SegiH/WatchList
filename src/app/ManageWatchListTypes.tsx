const axios = require("axios");
const DataGrid = require("@mui/x-data-grid").DataGrid;
const EditToolbar = require("./EditToolbar").default;
const exact = require("prop-types-exact");
const GridActionsCellItem = require("@mui/x-data-grid-pro").GridActionsCellItem;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const IWatchListType = require("./interfaces/IWatchListType");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const useState = require("react").useState;

const ManageWatchListTypes = ({ CancelIcon, demoMode, EditIcon, SaveIcon, setIsAdding, setIsEditing, setWatchListTypes, setWatchListTypesLoadingComplete, setWatchListTypesLoadingStarted, watchListTypes }
     :
     {
          CancelIcon: typeof MuiIcon,
          demoMode: boolean,
          EditIcon: typeof MuiIcon,
          SaveIcon: typeof MuiIcon,
          setIsAdding: (arg0: boolean) => void,
          setIsEditing: (arg0: boolean) => void,
          setWatchListTypes: (arg0: typeof IWatchListType) => void,
          setWatchListTypesLoadingComplete: (arg0: boolean) => void,
          setWatchListTypesLoadingStarted: (arg0: boolean) => void,
          watchListSources: typeof IWatchListType,
          watchListTypes: typeof IWatchListType
     }) => {
     const [rowModesModel, setRowModesModel] = useState({});
     const section = "Type";

     const cancelRowEditClickHandler = (id: number) => () => {
          setRowModesModel({
               ...rowModesModel,
               [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });

          const editedRow = watchListTypes.find((row: typeof IWatchListType) => row.WatchListTypeID === id);

          if (editedRow.isNew) {
               setWatchListTypes(watchListTypes.filter((row: typeof IWatchListType) => row.WatchListTypeID !== id));
          }

          setIsAdding(false);
          setIsEditing(false);
     };

     const enterEditModeClickHandler = (id: number) => () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

          setIsEditing(true);
     };

     const processRowUpdateHandler = (newRow: typeof IWatchListType) => {
          if (demoMode) {
               alert("Adding a type is disabled in demo mode");
               return;
          }

          // validate rows
          if (typeof newRow.WatchListTypeName === "undefined" || newRow.WatchListTypeName === "") {
               alert("Please enter the type name");

               setRowModesModel({ ...rowModesModel, [newRow.WatchListTypeID]: { mode: GridRowModes.Edit } });

               return;
          }

          let columns = ``;

          if (newRow.isNew !== true) {
               columns = `?WatchListTypeID=${newRow.WatchListTypeID}&WatchListTypeName=${encodeURIComponent(newRow.WatchListTypeName)}`;
          } else {
               columns = `?WatchListTypeName=${encodeURIComponent(newRow.WatchListTypeName)}`;
          }

          const endPoint = (newRow.isNew == true ? `/api/AddWatchListType` : `/api/UpdateWatchListType`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IWatchListType) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setWatchListTypesLoadingStarted(false);
                         setWatchListTypesLoadingComplete(false);

                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update types with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback((error: Error) => { }, []);

     const startRowEditingClickHandler = (params: typeof IWatchListType, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IWatchListType, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const columns = [
          {
               field: "WatchListTypeID",
               headerName: "ID",
               width: 100
          },
          {
               field: "WatchListTypeName",
               headerName: "Type name",
               editable: true,
               width: 150,
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
               rows={watchListTypes}
               columns={columns}
               editMode="row"
               getRowId={(row: typeof IWatchListType) => row.WatchListTypeID}
               rowModesModel={rowModesModel}
               onRowEditStart={startRowEditingClickHandler}
               onRowEditStop={stopRowEditingClickHandler}
               processRowUpdate={processRowUpdateHandler}
               onProcessRowUpdateError={processRowUpdateErrorHandler}
               components={{
                    Toolbar: EditToolbar,
               }}
               componentsProps={{
                    toolbar: { section, setIsAdding, setWatchListTypes, setRowModesModel, watchListTypes },
               }}
               experimentalFeatures={{ newEditingApi: true }}
          />
     );
};

ManageWatchListTypes.propTypes = exact({
     CancelIcon: PropTypes.object.isRequired,
     demoMode: PropTypes.bool.isRequired,
     EditIcon: PropTypes.object.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setIsEditing: PropTypes.func.isRequired,
     setWatchListTypes: PropTypes.func.isRequired,
     setWatchListTypesLoadingComplete: PropTypes.func.isRequired,
     setWatchListTypesLoadingStarted: PropTypes.func.isRequired,
     watchListTypes: PropTypes.array.isRequired,
});


export default ManageWatchListTypes;