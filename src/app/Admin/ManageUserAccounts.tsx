"use client"

const axios = require("axios");
const Button = require("@mui/material/Button").default;
const Dialog = require("@mui/material/Dialog").default;
const DialogActions = require("@mui/material/DialogActions").default;
const DialogContent = require("@mui/material/DialogContent").default;
const DialogContentText = require("@mui/material/DialogContentText").default;
const DialogTitle = require("@mui/material/DialogTitle").default;
const IUser = require("../interfaces/IUser");
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;

import TextField from "@mui/material/TextField";

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
          setErrorMessage,
          setUsers,
          users,
          validatePassword
     } = useContext(DataContext) as DataContextType;

     const [addingUser, setAddingUser] = useState(null);
     const [dialogVisible, setDialogVisible] = useState(false);
     const [dialogVisibleParamID, setDialogVisibleParamID] = useState(-1);
     const [editingUser, setEditingUser] = useState(null);
     const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
     const [newPassword, setNewPassword] = useState("");
     const [newConfirmPassword, setNewConfirmPassword] = useState("");
     const [usersLoadingStarted, setUsersLoadingStarted] = useState(false);
     const [usersLoadingComplete, setUsersLoadingComplete] = useState(false);

     const router = useRouter();

     const cancelAddEditModeClickHandler = () => {
          setIsAdding(false);
          setIsEditing(false);
     }

     const closeDialogClickHandler = () => {
          setNewPassword("");
          setNewConfirmPassword("");
          setDialogVisibleParamID(-1);

          setDialogVisible(false);
     };

     const enterAddModeClickHandler = (id: number) => {
          setAddingUser({
               UserID: null,
               Username: "",
               Realname: "",
               Password: "",
               Admin: 0,
               Enabled: 1
          })
          setIsAdding(true);
     }

     const enterEditModeClickHandler = (id: number) => {
          const newEditingUserResult = users?.filter((user: typeof IUser) => {
               return user.UserID === id;
          });

          if (newEditingUserResult.length !== 1) { // This shouldn't ever happen
               alert("Unable to locate user in Users");
               return;
          }

          setEditingUser(newEditingUserResult[0]);

          setIsEditing(true);
     }

     const generateNewPassword = () => {
          const newRandomPassword = generateRandomPassword();

          setNewPassword(newRandomPassword);
          setNewConfirmPassword(newRandomPassword);

          setIsPasswordGenerated(true);
     };

     const saveRow = () => {
          if (demoMode) {
               alert("Adding a user is disabled in demo mode");
               return;
          }

          const currentUser = Object.assign({}, isAdding ? addingUser : editingUser);

          // validate rows
          if (typeof currentUser.Username === "undefined" || currentUser.Username === "") {
               alert("Please enter the username");

               return;
          }

          const validateUser = users?.filter((validateCurrentUser: typeof IUser) => {
               return String(validateCurrentUser.Username) === String(currentUser.Username) && String(validateCurrentUser.UserID) !== String(currentUser.UserID);
          });

          if (validateUser.length !== 0) {
               alert(`The username ${currentUser.Username} is already in use with the User with ID ${validateUser[0].UserID}`);

               return;
          }

          if (typeof currentUser.Realname === "undefined" || currentUser.Realname === "") {
               alert("Please enter the name");

               return;
          }

          if (isAdding && (typeof currentUser.Password === "undefined" || currentUser.Password === "")) {
               alert("Please set a password");

               return;
          }

          let columns = ``;

          if (isAdding !== true) {
               columns = `?wl_userid=${currentUser.UserID}`;
          } else {
               columns = `?wl_password=${encodeURIComponent(currentUser.Password)}`;
          }

          columns += `&wl_username=${encodeURIComponent(currentUser.Username)}`;
          columns += `&wl_realname=${encodeURIComponent(currentUser.Realname)}`;
          columns += `&wl_admin=${currentUser.Admin === true || currentUser.Admin === 1 ? true : false}`;
          columns += `&wl_enabled=${currentUser.Enabled === true || currentUser.Enabled === 1 ? true : false}`;

          const endPoint = (isAdding ? `/api/AddUser` : `/api/UpdateUser`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: typeof IUser) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setUsersLoadingStarted(false);
                         setUsersLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update users with the error " + err.message);
               });
     }

     const saveNewPassword = () => {
          if (demoMode) {
               alert("Saving the password is disabled in demo mode");
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

          if (isEditing) {
               axios.put(`/api/UpdateUser?wl_userid=${dialogVisibleParamID}&wl_password=${encodeURIComponent(newPassword)}`, { withCredentials: true })
                    .then((res: typeof IUser) => {
                         setNewPassword("");
                         setNewConfirmPassword("");

                         if (res.data[0] === "OK") {
                              alert("The new password was saved");

                              setNewPassword("");
                              setNewConfirmPassword("");
                              setDialogVisibleParamID(-1);

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
               userChangeHandler("Password", newPassword);
          }

          setDialogVisible(false);
     };

     const userChangeHandler = (fieldName: string, fieldValue: string) => {
          const newUser = Object.assign({}, isAdding ? addingUser : editingUser);

          newUser[fieldName] = fieldValue;
          newUser.IsModified = true;

          if (isAdding) {
               setAddingUser(newUser);
          } else {
               setEditingUser(newUser);
          }
     }

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
                              setErrorMessage(res.data[1]);
                              setIsError(true);
                         }

                         setUsersLoadingComplete(true);
                    })
                    .catch((err: Error) => {
                         setErrorMessage("Failed to get users with the error " + err.message);
                         setIsError(true);
                    });
          }
     }, [usersLoadingStarted, usersLoadingComplete]);

     return (
          <>
               {usersLoadingComplete &&
                    <Button
                         color="primary"
                         variant="contained"
                         className="borderRadius15 bottomMargin20 topMargin"
                         onClick={enterAddModeClickHandler} >
                         Add User
                    </Button>
               }

               {users && users.length > 0 &&
                    <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                         <thead>
                              <tr>
                                   <th>Actions</th>
                                   <th>ID</th>
                                   <th>User name</th>
                                   <th>Name</th>
                                   <th>Password</th>
                                   <th>Admin</th>
                                   <th>Enabled</th>
                              </tr>
                         </thead>

                         <tbody>
                              {isAdding &&
                                   <tr>
                                        <td>
                                             <span className="inlineFlex">
                                                  <span className={`clickable iconLarge primary`} onClick={saveRow}>
                                                       {SaveIconComponent}
                                                  </span>

                                                  <span className={`clickable iconLarge error`} onClick={() => cancelAddEditModeClickHandler()}>
                                                       {CancelIconComponent}
                                                  </span>
                                             </span>
                                        </td>

                                        {/* User ID column */}
                                        <td>
                                        </td>

                                        <td>
                                             <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" label="username" value={addingUser.Username} fullWidth variant="standard" onChange={(event: any) => userChangeHandler("Username", event.target.value)} />
                                        </td>

                                        <td>
                                             <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="name" label="name" value={addingUser.Realname} fullWidth variant="standard" onChange={(event: any) => userChangeHandler("Realname", event.target.value)} />
                                        </td>

                                        <td>
                                             <Button
                                                  color="secondary"
                                                  variant="contained"
                                                  className="borderRadius15"
                                                  onClick={() => {
                                                       setDialogVisible(true);
                                                  }}>
                                                  Change Password
                                             </Button>
                                        </td>

                                        <td>
                                             <input type="checkbox" checked={addingUser.Admin} onChange={(event: any) => userChangeHandler("Admin", event.target.checked)} />
                                        </td>

                                        <td>
                                             Y
                                        </td>
                                   </tr>
                              }


                              {users
                                   .filter((user: typeof IUser) => {
                                        return (
                                             (!isAdding && !isEditing) ||
                                             (isEditing && editingUser.UserID === user.UserID)
                                        )
                                   })
                                   .map((user: typeof IUser) => (
                                        <tr key={user.UserID}>
                                             <td>
                                                  {!isEditing &&
                                                       <span className={`clickable tabIcon`} onClick={() => enterEditModeClickHandler(user.UserID)}>
                                                            {EditIconComponent}
                                                       </span>
                                                  }

                                                  {isEditing &&
                                                       <span className="inlineFlex">
                                                            <span className={`clickable iconLarge primary`} onClick={saveRow}>
                                                                 {SaveIconComponent}
                                                            </span>

                                                            <span className={`clickable iconLarge error`} onClick={() => cancelAddEditModeClickHandler()}>
                                                                 {CancelIconComponent}
                                                            </span>
                                                       </span>
                                                  }
                                             </td>

                                             <td>
                                                  <span>{user.UserID}</span>
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{user.Username}</span>
                                                  }

                                                  {isEditing &&
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" label="username" value={editingUser.Username} fullWidth variant="standard" onChange={(event: any) => userChangeHandler("Username", event.target.value)} />
                                                  }
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{user.Realname}</span>
                                                  }

                                                  {isEditing &&
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" label="name" value={editingUser.Realname} fullWidth variant="standard" onChange={(event: any) => userChangeHandler("Realname", event.target.value)} />
                                                  }
                                             </td>

                                             <td>
                                                  <Button
                                                       color="secondary"
                                                       variant="contained"
                                                       className="borderRadius15"
                                                       onClick={() => {
                                                            setDialogVisibleParamID(user.UserID);

                                                            setDialogVisible(true);
                                                       }}>
                                                       Change Password
                                                  </Button>
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{user.Admin === 1 ? "Y" : "N"}</span>
                                                  }

                                                  {isEditing &&
                                                       <input type="checkbox" checked={editingUser.Admin} onChange={(event: any) => userChangeHandler("Admin", event.target.checked)} />
                                                  }
                                             </td>

                                             <td>
                                                  {!isAdding && !isEditing &&
                                                       <span>{user.Enabled === 1 ? "Y" : "N"}</span>
                                                  }

                                                  {isEditing &&
                                                       <input type="checkbox" checked={editingUser.Enabled} onChange={(event: any) => userChangeHandler("Enabled", event.target.checked)} />
                                                  }

                                                  {isAdding &&
                                                       <input type="checkbox" checked={addingUser.Enabled} onChange={(event: any) => userChangeHandler("Enabled", event.target.checked)} />
                                                  }
                                             </td>
                                        </tr>
                                   ))}
                         </tbody>
                    </table>
               }

               <Dialog open={dialogVisible} onClose={closeDialogClickHandler}>
                    <DialogTitle>Change Password</DialogTitle>

                    <DialogContent>
                         <DialogContentText>Please enter a new password. it must be at least 8 characters long and contain letters and numbers</DialogContentText>

                         <TextField autoFocus margin="dense" id="password" label="Password" type={!isPasswordGenerated ? "password" : "text"} value={newPassword} onChange={(event: any) => setNewPassword(event.target.value)} fullWidth variant="standard" />

                         {!isPasswordGenerated && <TextField margin="dense" id="confirm" label="Confirm Password" type="password" fullWidth variant="standard" value={newConfirmPassword} onChange={(event: any) => setNewConfirmPassword(event.target.value)} />}
                    </DialogContent>

                    <DialogActions className="dialogActions">
                         <Button className="generatePassword" onClick={() => generateNewPassword()}>
                              Generate Password
                         </Button>

                         <Button className="changePassword" onClick={() => saveNewPassword()}>
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