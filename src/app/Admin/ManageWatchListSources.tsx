const axios = require("axios");
const DataGrid = require("@mui/x-data-grid").DataGrid;
const EditToolbar = require("./EditToolbar").default;
const GridActionsCellItem = require("@mui/x-data-grid-pro").GridActionsCellItem;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const IWatchListSource = require("../interfaces/IWatchListSource");
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

const ManageWatchListSources = () => {
     const {
          CancelIconComponent,
          defaultRoute,
          demoMode,
          EditIconComponent,
          isAdding,
          isAdmin,
          isEditing,
          SaveIconComponent,
          setIsAdding,
          setIsEditing,
          setWatchListSources,
          setWatchListSourcesLoadingComplete,
          setWatchListSourcesLoadingStarted,
          watchListSources
     } = useContext(DataContext) as DataContextType;

     const [editingId, setEditingId] = useState(null);
     const [rowModesModel, setRowModesModel] = useState({});
     const section = "Source";

     const router = useRouter();

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

          setEditingId(null);
     };

     const enterEditModeClickHandler = (id: number) => () => {
          setEditingId(id);

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

          const endPoint = (newRow.isNew == true ? `/api/AddWatchListSource` : `/api/UpdateWatchListSource`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IWatchListSource) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setWatchListSourcesLoadingStarted(false);
                         setWatchListSourcesLoadingComplete(false);

                         setIsEditing(false);

                         setRowModesModel(null);

                         setEditingId(null);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update sources with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback(() => { }, []);

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const startRowEditingClickHandler = (params: typeof IWatchListSource, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IWatchListSource, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;

          setRowModesModel(null);
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
                    const newestSource = watchListSources?.filter((watchListSource: typeof IWatchListSource) => watchListSource.WatchListSourceID === id && watchListSource.isNew === true);

                    if (editingId === null && !isAdding && !isEditing) {
                         return [<GridActionsCellItem key={id} icon={EditIconComponent} label="Edit" className="icon textPrimary" onClick={enterEditModeClickHandler(id)} color="inherit" />];
                    } else if ((isEditing && editingId === id) || (isAdding && newestSource.length === 1)) {
                         return [<GridActionsCellItem key={id} icon={SaveIconComponent} className="icon" label="Save" onClick={saveRowEditClickHandler(id)} color="primary" />, <GridActionsCellItem key={id} icon={CancelIconComponent} label="Cancel" className="icon textPrimary" onClick={cancelRowEditClickHandler(id)} color="error" />];
                    } else {
                         return [<></>]
                    }
               },
          },
     ];

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin()) {
               router.push(defaultRoute)
          }
     }, []);

     return (
          <DataGrid
               rows={watchListSources}
               columns={columns}
               sx={{
                    color: "white",
               }}
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
                    toolbar: { section, setRowModesModel },
               }}
               experimentalFeatures={{ newEditingApi: true }}
          />
     );
};

export default ManageWatchListSources;