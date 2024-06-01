const axios = require("axios");
const DataGrid = require("@mui/x-data-grid").DataGrid;
const EditToolbar = require("./EditToolbar").default;
const GridActionsCellItem = require("@mui/x-data-grid-pro").GridActionsCellItem;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const IWatchListType = require("../interfaces/IWatchListType");
const React = require("react");
const useContext = require("react").useContext;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

const ManageWatchListTypes = () => {
     const {
          CancelIconComponent,
          demoMode,
          EditIconComponent,
          isAdding,
          isEditing,
          SaveIconComponent,
          setIsAdding,
          setIsEditing,
          setWatchListTypes,
          setWatchListTypesLoadingComplete,
          setWatchListTypesLoadingStarted,
          watchListTypes
     } = useContext(DataContext) as DataContextType;

     const [editingId, setEditingId] = useState(null);
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

          setEditingId(null);
     };

     const enterEditModeClickHandler = (id: number) => () => {
          setEditingId(id);

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

                         setRowModesModel(null);

                         setEditingId(null);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update types with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback(() => { }, []);

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const startRowEditingClickHandler = (params: typeof IWatchListType, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IWatchListType, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;

          setRowModesModel(null);
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
                    const newestType = watchListTypes?.filter((watchListType: typeof IWatchListType) => watchListType.WatchListTypeID === id && watchListType.isNew === true);

                    if (editingId === null && !isAdding && !isEditing) {
                         return [<GridActionsCellItem key={id} icon={EditIconComponent} label="Edit" className="icon textPrimary" onClick={enterEditModeClickHandler(id)} color="inherit" />];
                    } else if ((isEditing && editingId === id) || (isAdding && newestType.length === 1)) {
                         return [<GridActionsCellItem key={id} icon={SaveIconComponent} className="icon" label="Save" onClick={saveRowEditClickHandler(id)} color="primary" />, <GridActionsCellItem key={id} icon={CancelIconComponent} label="Cancel" className="icon textPrimary" onClick={cancelRowEditClickHandler(id)} color="error" />];
                    } else {
                         return [<></>]
                    }
               },
          },
     ];

     return (
          <DataGrid
               rows={watchListTypes}
               columns={columns}
               sx={{
                    color: "white",
               }}
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
                    toolbar: { section, setRowModesModel },
               }}
               experimentalFeatures={{ newEditingApi: true }}
          />
     );
};

export default ManageWatchListTypes;