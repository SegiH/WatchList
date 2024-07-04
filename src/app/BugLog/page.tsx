"use client"

const axios = require("axios");
const IBugLog = require("../interfaces/IBugLog");
const DataGrid = require("@mui/x-data-grid").DataGrid;
const EditToolbar = require("../Admin/EditToolbar").default;
const GridColDef = require("../Admin/EditToolbar").GridColDef;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridActionsCellItem = require("@mui/x-data-grid").GridActionsCellItem;
const GridRenderEditCellParams = require("@mui/x-data-grid").GridRenderEditCellParams;
const GridRowModes = require("@mui/x-data-grid").GridRowModes;
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

import { useGridApiContext } from '@mui/x-data-grid';
import { DataContext, DataContextType } from "../data-context";

import "../page.css";

// Render custom input with event handler
function CustomEditComponent(props: typeof GridRenderEditCellParams) {
     const { id, value, field, hasFocus } = props;
     const apiRef = useGridApiContext();
     const ref = React.useRef();

     React.useLayoutEffect(() => {
          if (hasFocus) {
               ref.current.focus();
          }
     }, [hasFocus]);

     const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = event.target.value; // The new value entered by the user
          apiRef.current.setEditCellValue({ id, field, value: newValue });
     };

     const cssStyle = {
          width: "100%",
          height: "100% !important"
     };

     return <textarea ref={ref} readOnly={false} style={cssStyle} value={value} rows={value.length / 30} onChange={handleValueChange} />;
}

// Return custom input with custom event handler
const renderEditInputCell: typeof GridColDef['renderCell'] = (params) => {
     return <CustomEditComponent {...params} />;
};

export default function BugLog() {
     const {
          bugLogs,
          CancelIconComponent,
          EditIconComponent,
          isAdding,
          isEditing,
          SaveIconComponent,
          setBugLogs,
          setIsError,
          setIsErrorMessage,
          setIsAdding,
          setIsEditing
     } = useContext(DataContext) as DataContextType;

     const [bugLogsLoadingStarted, setBugLogsLoadingStarted] = useState(false);
     const [bugLogsLoadingComplete, setBugLogsLoadingComplete] = useState(false);
     const [editingId, setEditingId] = useState(null);
     const [rowModesModel, setRowModesModel] = useState({});
     const [showActiveBugLogs, setShowActiveBugLogs] = useState(true);

     const section = "Bug Log";

     const cancelRowEditClickHandler = (id: number) => () => {
          setRowModesModel({
               ...rowModesModel,
               [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });

          const editedRow = bugLogs.find((row: typeof IBugLog) => row.WLBugID === id);

          if (editedRow.isNew) {
               setBugLogs(bugLogs.filter((row: typeof IBugLog) => row.WLBugID !== id));
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

     const processRowUpdateHandler = (newRow: typeof IBugLog) => {
          // validate rows
          if (typeof newRow.WLBugName === "undefined" || newRow.WLBugName === "") {
               alert("Please enter the bug name");

               setRowModesModel({ ...rowModesModel, [newRow.WLBugID]: { mode: GridRowModes.Edit } });

               return;
          }

          if (typeof newRow.AddDate === "undefined" || newRow.AddDate === "") {
               alert("Please enter the add date");

               setRowModesModel({ ...rowModesModel, [newRow.WLBugID]: { mode: GridRowModes.Edit } });

               return;
          }

          let columns = ``;

          if (newRow.isNew !== true) {
               columns = `?WLBugID=${newRow.WLBugID}`;
          }

          columns += (columns === `` ? `?` : `&`) + `WLBugName=${encodeURIComponent(newRow.WLBugName)}`;
          columns += (columns === `` ? `?` : `&`) + `AddDate=${newRow.AddDate}`;

          if (typeof newRow.CompletedDate !== "undefined") {
               columns += (columns === `` ? `?` : `&`) + `CompletedDate=${newRow.CompletedDate}`;
          }

          if (typeof newRow.ResolutionNotes !== "undefined") {
               columns += (columns === `` ? `?` : `&`) + `ResolutionNotes=${encodeURIComponent(newRow.ResolutionNotes)}`;
          }

          const endPoint = (newRow.isNew == true ? `/api/AddBugLog` : `/api/UpdateBugLog`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IBugLog) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setBugLogsLoadingStarted(false);
                         setBugLogsLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);

                         setRowModesModel(null);

                         setEditingId(null);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update bug log with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback(() => { }, []);

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const startRowEditingClickHandler = (params: typeof IBugLog, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IBugLog, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;

          setRowModesModel(null);
     };

     const columns = [
          {
               field: "WLBugID",
               headerName: "ID",
               width: 100,
               editable: false,
               type: "number",
               renderCell: (params: typeof GridRenderEditCellParams) => {
                    return (
                         <div style={{ color: editingId === null ? "white" : "black" }}>{typeof params.value !== "undefined" ? params.value : ""}</div>
                    )
               },
          },
          {
               field: "WLBugName",
               headerName: "Bug name",
               editable: true,
               width: 350,
               renderEditCell: renderEditInputCell
          },
          {
               field: "ResolutionNotes",
               headerName: "Resolution Notes",
               editable: true,
               wrap: true,
               width: 350,
               renderEditCell: renderEditInputCell
          },
          {
               field: "AddDate",
               headerName: "Added On",
               editable: true,
               width: 130,
          },
          {
               field: "CompletedDate",
               headerName: "Completed On",
               editable: true,
               width: 130,
          },
          {
               field: "actions",
               type: "actions",
               headerName: "Actions",
               width: 100,
               cellClassName: "actions",
               getActions: ({ id }: { id: number }) => {
                    const newestBugLog = bugLogs?.filter((bugLog: typeof IBugLog) => bugLog.WLBugID === id && bugLog.isNew === true);

                    if (editingId === null && !isAdding && !isEditing) {
                         return [<GridActionsCellItem key={id} icon={EditIconComponent} label="Edit" className="icon textPrimary" onClick={enterEditModeClickHandler(id)} color="inherit" />];
                    } else if ((isEditing && editingId === id) || (isAdding && newestBugLog.length === 1)) {
                         return [<GridActionsCellItem key={id} icon={SaveIconComponent} className="icon textPrimary" label="Save" onClick={saveRowEditClickHandler(id)} color="primary" />, <GridActionsCellItem key={id} icon={CancelIconComponent} label="Cancel" className="icon textPrimary" onClick={cancelRowEditClickHandler(id)} color="error" />];
                    } else {
                         return [<></>]
                    }
               },
          },
     ];

     useEffect(() => {
          if (bugLogsLoadingStarted) {
               return;
          }

          setBugLogsLoadingStarted(true);

          axios.get(`/api/GetBugLogs?GetActiveBugLogs=${showActiveBugLogs}`)
               .then((res) => {
                    if (res.data[0] === "OK") {
                         setBugLogs(res.data[1]);
                         setBugLogsLoadingComplete(true);
                    } else {
                         alert(`An error occurred while getting the bug logs`);
                    }
               })
               .catch((err: Error) => {
                    setIsErrorMessage(`The fatal error ${err.message} occurred while getting the bug logs`);
                    setIsError(true);
               });
     }, [bugLogsLoadingStarted, bugLogsLoadingComplete]);

     useEffect(() => {
          setBugLogsLoadingStarted(false);
          setBugLogsLoadingComplete(false);
     }, [showActiveBugLogs]);

     return (
          <>
               Bug Log
               <DataGrid
                    //apiRef={apiRef}
                    rows={bugLogs}
                    columns={columns}
                    sx={{
                         color: "white",
                    }}
                    editMode="row"
                    getRowId={(row: typeof IBugLog) => row.WLBugID}
                    getRowHeight={(params) => "auto"}
                    rowModesModel={rowModesModel}
                    onRowEditStart={startRowEditingClickHandler}
                    onRowEditStop={stopRowEditingClickHandler}
                    processRowUpdate={processRowUpdateHandler}
                    onProcessRowUpdateError={processRowUpdateErrorHandler}
                    components={{
                         Toolbar: EditToolbar,
                    }}
                    componentsProps={{
                         toolbar: { section, setRowModesModel, setShowActiveBugLogs, showActiveBugLogs },
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
               />
          </>
     )
}