const axios = require("axios");
const Button = require("@mui/material/Button").default;
const DataGrid = require("@mui/x-data-grid").DataGrid;
const Dialog = require("@mui/material/Dialog").default;
const DialogActions = require("@mui/material/DialogActions").default;
const DialogContent = require("@mui/material/DialogContent").default;
const DialogContentText = require("@mui/material/DialogContentText").default;
const DialogTitle = require("@mui/material/DialogTitle").default;
const EditToolbar = require("./EditToolbar").default;
const exact = require ("prop-types-exact");
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const GridParams = require("@mui/x-data-grid-pro").GridParams;
const GridActionsCellItem = require("@mui/x-data-grid-pro").GridActionsCellItem;
const GridRowModes = require("@mui/x-data-grid-pro").GridRowModes;
const IUser = require("../../interfaces/IUser");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const TextField = require("@mui/material/TextField").default;
const useEffect = require("react").useEffect;
const useState = require("react").useState;

const ManageUserAccounts = ({backendURL, CancelIcon, EditIcon, generateRandomPassword, SaveIcon, setIsAdding, setIsEditing, validatePassword}
     :
     {
          backendURL: string,
          CancelIcon: typeof MuiIcon,
          EditIcon: typeof MuiIcon,
          generateRandomPassword: () => string,
          SaveIcon: typeof MuiIcon,
          setIsAdding: (arg0: boolean) => void,
          setIsEditing: (arg0: boolean) => void,
          validatePassword: (arg0: string) => boolean
     }) => {
          const [dialogVisible, setDialogVisible] = useState(false);
          const [dialogVisibleParamID, setDialogVisibleParamID] = useState(-1);
          const [dialogVisibleParamIsNew, setDialogVisibleParamIsNew] = useState(false);
          const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
          const [newPassword, setNewPassword] = useState("");
          const [newConfirmPassword, setNewConfirmPassword] = useState("");
          const [usersLoadingStarted, setUsersLoadingStarted] = useState(false);
          const [usersLoadingComplete, setUsersLoadingComplete] = useState(false);
          const [users, setUsers] = React.useState([]);
          const [rowModesModel, setRowModesModel] = useState({});

          const section = "User";

          const cancelRowEditClickHandler = (id: number) => () => {
               setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
               });

               const editedRow = users.find((row: typeof IUser) => row.UserID === id);

               if (editedRow.isNew) {
                    setUsers(users.filter((row: typeof IUser) => row.UserID !== id));
               }

               setIsAdding(false);
               setIsEditing(false);
          };

          const closeDialogClickHandler = () => {
               setNewPassword("");
               setNewConfirmPassword("");
               setDialogVisibleParamID(-1);
               setDialogVisibleParamIsNew(false);

               setDialogVisible(false);
          };

          const enterEditModeClickHandler = (id: number) => () => {
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

               const endPoint = (newRow.isNew == true ? `${backendURL}/AddUser` : `${backendURL}/UpdateUser`) + columns;

               axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IUser) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setUsersLoadingStarted(false);
                         setUsersLoadingComplete(false);

                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update users with the error " + err.message);
               });

               return newRow;
          };

          const processRowUpdateErrorHandler = React.useCallback((error: Error) => {}, []);

          const startRowEditingClickHandler = (params: typeof IUser, event: typeof GridEventListener) => {
               event.defaultMuiPrevented = true;
          };

          const stopRowEditingClickHandler = (params: typeof IUser, event: typeof GridEventListener) => {
               event.defaultMuiPrevented = true;
          };

          const saveRowEditClickHandler = (id: number) => async () => {
               setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
          };

          const saveNewPassword = () => {
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
                    axios.put(`${backendURL}/UpdateUser?wl_userid=${dialogVisibleParamID}&wl_password=${encodeURIComponent(newPassword)}`, { withCredentials: true })
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

                    if (newRowResult.length !== 1) {
                         alert("Failed to update the password. Unable to find user ID");
                         return;
                    }

                    const newRow = newRowResult[0];
                    newRow.Password = newPassword;

                    setUsers(newRows);
               }

               setDialogVisible(false);
          };

          const columns = [
               {
                    field: "UserID",
                    headerName: "ID",
                    width: 100
               },
               {
                    field: "Username",
                    headerName: "User name",
                    editable: true,
                    width: 150,
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
               },
               {
                    field: "Enabled",
                    headerName: "Enabled",
                    editable: true,
                    width: 130,
                    type: "boolean",
               },
               {
                    field: "actions",
                    type: "actions",
                    headerName: "Actions",
                    width: 100,
                    cellClassName: "actions",
                    getActions: ({ id } : { id: number }) => {
                         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                    
                         if (isInEditMode) {
                              return [<GridActionsCellItem icon={<SaveIcon />} className="icon" label="Save" onClick={saveRowEditClickHandler(id)} />, <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="icon textPrimary" onClick={cancelRowEditClickHandler(id)} color="inherit" />];
                         }

                         return [<GridActionsCellItem icon={<EditIcon />} label="Edit" className="icon textPrimary" onClick={enterEditModeClickHandler(id)} color="inherit" />];
                    },
               },
          ];

          useEffect(() => {
               if (!usersLoadingStarted && !usersLoadingComplete) {
                    setUsersLoadingStarted(true);

                    axios.get(`${backendURL}/GetUsers`, { withCredentials: true })
                    .then((res: typeof IUser) => {
                         if (res.data.length > 0) {
                              setUsers(res.data);
                         }

                         setUsersLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         alert("Failed to get users with the error " + err.message);
                    });
               }
          }, [usersLoadingStarted, usersLoadingComplete]);

          return (
               <>
                    <DataGrid
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
                              toolbar: { section, setIsAdding, setUsers, setRowModesModel, users },
                         }}
                         experimentalFeatures={{ newEditingApi: true }}
                    />

                    <Dialog open={dialogVisible} onClose={closeDialogClickHandler}>
                         <DialogTitle>Change Password</DialogTitle>
                         
                         <DialogContent>
                              <DialogContentText>Please enter a new password. it must be at least 8 characters long and contain letters and numbers</DialogContentText>

                              <TextField autoFocus margin="dense" id="password" label="Password" type={!isPasswordGenerated ? "password" : "text"} value={newPassword} onChange={(event: typeof GridEventListener) => setNewPassword(event.target.value)} fullWidth variant="standard" />
 
                              {!isPasswordGenerated && <TextField margin="dense" id="confirm" label="Confirm Password" type="password" fullWidth variant="standard" value={newConfirmPassword} onChange={(event: typeof GridEventListener) => setNewConfirmPassword(event.target.value)} />}
                         </DialogContent>

                         <DialogActions className="dialogActions">
                              <Button className="generatePassword" onClick={(event: typeof GridEventListener) => generateNewPassword()}>
                                   Generate Password
                              </Button>

                              <Button className="changePassword" onClick={(event: typeof GridEventListener) => saveNewPassword()} disabled={dialogVisibleParamID === -1}>
                                   Change
                              </Button>

                              <Button className="cancelPassword" onClick={(event: typeof GridEventListener) => closeDialogClickHandler()}>
                                   Cancel
                              </Button>
                         </DialogActions>
                    </Dialog>
               </>
          );
};

ManageUserAccounts.propTypes = exact({
     backendURL: PropTypes.string.isRequired,
     CancelIcon: PropTypes.object.isRequired,
     EditIcon: PropTypes.object.isRequired,
     generateRandomPassword: PropTypes.func.isRequired,
     SaveIcon: PropTypes.object.isRequired,
     setIsAdding: PropTypes.func.isRequired,
     setIsEditing: PropTypes.func.isRequired,
     validatePassword: PropTypes.func.isRequired,
});

export default ManageUserAccounts;