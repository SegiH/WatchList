"use client"

const axios = require("axios");
const Button = require("@mui/material/Button").default;
const DataGrid = require("@mui/x-data-grid").DataGrid;
const Dialog = require("@mui/material/Dialog").default;
const DialogActions = require("@mui/material/DialogActions").default;
const DialogContent = require("@mui/material/DialogContent").default;
const DialogContentText = require("@mui/material/DialogContentText").default;
const DialogTitle = require("@mui/material/DialogTitle").default;
const EditToolbar = require("./EditToolbar").default;
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridParams = require("@mui/x-data-grid").GridParams;
const GridActionsCellItem = require("@mui/x-data-grid").GridActionsCellItem;
const GridColumnHeaderParams = require("@mui/x-data-grid").GridColumnHeaderParams;
const GridRenderEditCellParams = require("@mui/x-data-grid").GridRenderEditCellParams;
const GridRowModes = require("@mui/x-data-grid").GridRowModes;
const IUser = require("../interfaces/IUser");
const React = require("react");
const TextField = require("@mui/material/TextField").default;
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import { DataContext, DataContextType } from "../data-context";

import "../page.css";

const ManageUserAccounts = () => {
     const {
          CancelIconComponent,
          darkMode,
          defaultRoute,
          demoMode,
          EditIconComponent,
          generateRandomPassword,
          isAdding,
          isAdmin,
          isEditing,
          SaveIconComponent,
          setIsAdding,
          setIsEditing,
          setIsError,
          setIsErrorMessage,
          setUsers,
          users,
          validatePassword
     } = useContext(DataContext) as DataContextType;

     const [dialogVisible, setDialogVisible] = useState(false);
     const [dialogVisibleParamID, setDialogVisibleParamID] = useState(-1);
     const [dialogVisibleParamIsNew, setDialogVisibleParamIsNew] = useState(false);
     const [editingId, setEditingId] = useState(null);
     const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
     const [newPassword, setNewPassword] = useState("");
     const [newConfirmPassword, setNewConfirmPassword] = useState("");
     const [usersLoadingStarted, setUsersLoadingStarted] = useState(false);
     const [usersLoadingComplete, setUsersLoadingComplete] = useState(false);
     const [rowModesModel, setRowModesModel] = useState({});

     const section = "User";

     const router = useRouter();

     const cancelRowEditClickHandler = (id: number) => () => {
          setRowModesModel({
               ...rowModesModel,
               [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });

          const editedRow = users.find((row: typeof IUser) => row.UserID === id);

          if (editedRow.isNew) {
               const editedRowToRemove = users.filter((row: typeof IUser) => row.UserID !== id);

               setUsers(editedRowToRemove);
          }

          setIsAdding(false);
          setIsEditing(false);

          setEditingId(null);
     };

     const closeDialogClickHandler = () => {
          setNewPassword("");
          setNewConfirmPassword("");
          setDialogVisibleParamID(-1);
          setDialogVisibleParamIsNew(false);

          setDialogVisible(false);
     };

     const enterEditModeClickHandler = (id: number) => () => {
          setEditingId(id);
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

          setIsEditing(true);
     };

     const generateNewPassword = () => {
          const newRandomPassword = generateRandomPassword();

          setNewPassword(newRandomPassword);
          setNewConfirmPassword(newRandomPassword);

          setIsPasswordGenerated(true);
     };

     const processRowUpdateHandler = (newRow: typeof IUser) => {
          if (demoMode) {
               alert("Adding a user is disabled in demo mode");
               return;
          }

          // validate rows
          if (typeof newRow.Username === "undefined" || newRow.Username === "") {
               alert("Please enter the username");

               setRowModesModel({ ...rowModesModel, [newRow.UserID]: { mode: GridRowModes.Edit } });

               return;
          }

          const validateUser = users?.filter((validateCurrentUser: typeof IUser) => {
               return String(validateCurrentUser.Username) === String(newRow.Username) && String(validateCurrentUser.UserID) !== String(newRow.UserID);
          });

          if (validateUser.length !== 0) {
               alert(`The username ${newRow.Username} is already in use with the User with ID ${validateUser[0].UserID}`);

               setRowModesModel({ ...rowModesModel, [newRow.UserID]: { mode: GridRowModes.Edit } });

               return;
          }

          if (typeof newRow.Realname === "undefined" || newRow.Realname === "") {
               alert("Please enter the name");

               setRowModesModel({ ...rowModesModel, [newRow.UserID]: { mode: GridRowModes.Edit } });

               return;
          }

          if (newRow.isNew === true && (typeof newRow.Password === "undefined" || newRow.Password === "")) {
               alert("Please set a password");

               setRowModesModel({ ...rowModesModel, [newRow.UserID]: { mode: GridRowModes.Edit } });

               return;
          }

          let columns = ``;

          if (newRow.isNew !== true) {
               columns = `?wl_userid=${newRow.UserID}`;
          } else {
               columns = `?wl_password=${encodeURIComponent(newRow.Password)}`;
          }

          columns += `&wl_username=${encodeURIComponent(newRow.Username)}`;
          columns += `&wl_realname=${encodeURIComponent(newRow.Realname)}`;
          columns += `&wl_admin=${newRow.Admin}`;
          columns += `&wl_enabled=${newRow.Enabled}`;

          const endPoint = (newRow.isNew == true ? `/api/AddUser` : `/api/UpdateUser`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IUser) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setUsersLoadingStarted(false);
                         setUsersLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);

                         setRowModesModel(null);

                         setEditingId(null);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update users with the error " + err.message);
               });

          return newRow;
     };

     const processRowUpdateErrorHandler = React.useCallback(() => { }, []);

     const saveNewPassword = () => {
          if (demoMode) {
               alert("Saving the password is disabled in demo mode");
               return;
          }

          const currentRowResult = users.filter((row: typeof IUser) => row.UserID === dialogVisibleParamID);

          if (currentRowResult.length !== 1) {
               alert("An error occured getting the password");
               return;
          }

          if (newPassword !== newConfirmPassword) {
               alert("The 2 passwords do not match");
               return;
          }

          const validationResult = validatePassword(newPassword);

          if (!validationResult) {
               alert("The password must be at least 8 characters long, contain 2 lower case letters, 1 uppercase letter, 2 numbers and 2 symbols");
               return;
          }

          if (!dialogVisibleParamIsNew) {
               axios.put(`/api/UpdateUser?wl_userid=${dialogVisibleParamID}&wl_password=${encodeURIComponent(newPassword)}`, { withCredentials: true })
                    .then((res: typeof IUser) => {
                         setNewPassword("");
                         setNewConfirmPassword("");

                         if (res.data[0] === "OK") {
                              alert("The new password was saved");

                              setNewPassword("");
                              setNewConfirmPassword("");
                              setDialogVisibleParamID(-1);
                              setDialogVisibleParamIsNew(false);

                              setUsersLoadingStarted(false);
                              setUsersLoadingComplete(false);
                         } else {
                              alert("Failed to update the password with the error " + res.data[1]);
                         }
                    })
                    .catch((err: Error) => {
                         alert("Failed to update the password with the error " + err.message);
                    });
          } else {
               const newRows = Object.assign([], users);

               const newRowResult = newRows.filter((row: typeof IUser) => row.UserID === dialogVisibleParamID);

               if (newRowResult.length !== 1) { // This shouldn't ever happen
                    alert("Failed to update the password. Unable to find user ID");
                    return;
               }

               const newRow = newRowResult[0];
               newRow.Password = newPassword;

               setUsers(newRows);
          }

          setDialogVisible(false);
     };

     const saveRowEditClickHandler = (id: number) => async () => {
          setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
     };

     const startRowEditingClickHandler = (params: typeof IUser, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;
     };

     const stopRowEditingClickHandler = (params: typeof IUser, event: typeof GridEventListener) => {
          event.defaultMuiPrevented = true;

          setRowModesModel(null);
     };

     const columns = [
          {
               field: "UserID",
               headerName: "ID",
               width: 100,
               editable: false,
               type: "number",
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               renderCell: (params: typeof GridRenderEditCellParams) => {
                    return (
                    <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>{params.value}</div>
               )},
          },
          {
               field: "Username",
               headerName: "User name",
               editable: true,
               width: 150,
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               renderCell: (params: typeof GridRenderEditCellParams) => {
                    return (
                    <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>{params.value}</div>
               )},
          },
          {
               field: "Realname",
               headerName: "Name",
               editable: true,
               width: 130,
          },
          {
               field: "Password",
               headerName: "Password",
               editable: false,
               width: 230,
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               renderCell: (params: typeof GridParams) => {
                    return (
                         <Button
                              color="secondary"
                              variant="contained"
                              onClick={() => {
                                   setDialogVisibleParamID(params.id);

                                   if (params.row.isNew) {
                                        setDialogVisibleParamIsNew(true);
                                   }

                                   setDialogVisible(true);
                              }}>
                              Change Password
                         </Button>
                    );
               },
          },
          {
               field: "Admin",
               headerName: "Admin",
               editable: true,
               enabled: false,
               width: 130,
               type: "boolean",
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               renderCell: (params: typeof GridRenderEditCellParams) => (
                    <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>{params.value == true ? "Y" : "N"}</div>
               ),
          },
          {
               field: "Enabled",
               headerName: "Enabled",
               editable: true,
               width: 130,
               type: "boolean",
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               renderCell: (params: typeof GridRenderEditCellParams) => (
                    <div className={`${!darkMode ? "lightMode" : "darkMode"}`}>{params.value == true ? "Y" : "N"}</div>
               ),
          },
          {
               field: "actions",
               type: "actions",
               headerName: "Actions",
               width: 100,
               cellClassName: "actions",
               headerClassName: !darkMode ? "lightMode" : "darkMode",
               getActions: ({ id }: { id: number }) => {
                    const newestUser = users?.filter((user: typeof IUser) => user.UserID === id && user.isNew === true);

                    if (editingId === null && !isAdding && !isEditing) {
                         return [<GridActionsCellItem key={id} icon={EditIconComponent} label="Edit" className={`icon`} onClick={enterEditModeClickHandler(id)} color="inherit" />];
                    } else if ((isEditing && editingId === id) || (isAdding && newestUser.length === 1)) {
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

          if (demoMode) {
               const newUserData: typeof IUser = require("../demo/index").demoUsers;

               setUsers(newUserData);
               setUsersLoadingStarted(true);
               setUsersLoadingComplete(true);
               return;
          }

          if (!usersLoadingStarted && !usersLoadingComplete) {
               setUsersLoadingStarted(true);

               axios.get(`/api/GetUsers`, { withCredentials: true })
                    .then((res: typeof IUser) => {
                         if (res.data[0] === "OK") {
                              setUsers(res.data[1]);
                         } else {
                              setIsErrorMessage(res.data[1]);
                              setIsError(true);
                         }

                         setUsersLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         setIsErrorMessage("Failed to get users with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [usersLoadingStarted, usersLoadingComplete]);

     return (
          <>
               {users && users.length > 0 &&
                    <DataGrid
                         className={`${!darkMode ? "lightMode" : "darkMode"}`}
                         rows={users}
                         columns={columns}
                         editMode="row"
                         getRowId={(row: typeof IUser) => row.UserID}
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
               }

               <Dialog open={dialogVisible} onClose={closeDialogClickHandler}>
                    <DialogTitle>Change Password</DialogTitle>

                    <DialogContent>
                         <DialogContentText>Please enter a new password. it must be at least 8 characters long and contain letters and numbers</DialogContentText>

                         <TextField autoFocus margin="dense" id="password" label="Password" type={!isPasswordGenerated ? "password" : "text"} value={newPassword} onChange={(event: typeof GridEventListener) => setNewPassword(event.target.value)} fullWidth variant="standard" />

                         {!isPasswordGenerated && <TextField margin="dense" id="confirm" label="Confirm Password" type="password" fullWidth variant="standard" value={newConfirmPassword} onChange={(event: typeof GridEventListener) => setNewConfirmPassword(event.target.value)} />}
                    </DialogContent>

                    <DialogActions className="dialogActions">
                         <Button className="generatePassword" onClick={() => generateNewPassword()}>
                              Generate Password
                         </Button>

                         <Button className="changePassword" onClick={() => saveNewPassword()} disabled={dialogVisibleParamID === -1}>
                              Change
                         </Button>

                         <Button className="cancelPassword" onClick={() => closeDialogClickHandler()}>
                              Cancel
                         </Button>
                    </DialogActions>
               </Dialog>
          </>
     );
};

export default ManageUserAccounts;