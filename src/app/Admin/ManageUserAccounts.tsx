"use client"

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import { DataContext, DataContextType } from "../data-context";
import IUser from "../interfaces/IUser";

import "../page.css";

const ManageUserAccounts = () => {
     const {
          CancelIconComponent,
          darkMode,
          defaultRoute,
          demoMode,
          EditIconComponent,
          //generateRandomPassword,
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

     const [addingUser, setAddingUser] = useState<IUser>({} as IUser);
     const [editingUser, setEditingUser] = useState<IUser>({} as IUser);
     const [isPasswordModified, setIsPasswordModified] = useState(false);
     const [usersLoadingStarted, setUsersLoadingStarted] = useState(false);
     const [usersLoadingComplete, setUsersLoadingComplete] = useState(false);

     const router = useRouter();

     const cancelAddEditModeClickHandler = () => {
          setIsAdding(false);
          setIsEditing(false);
     }

     const enterAddModeClickHandler = () => {
          setAddingUser({
               UserID: 0,
               Username: "",
               Realname: "",
               Password: "",
               Admin: 0,
               Enabled: 1,
               Options: []
          });

          setIsAdding(true);
     }

     const enterEditModeClickHandler = (id: number) => {
          const newEditingUserResult = users?.filter((user: IUser) => {
               return user.UserID === id;
          });

          if (newEditingUserResult.length !== 1) { // This shouldn't ever happen
               alert("Unable to locate user in Users");
               return;
          }

          setEditingUser(newEditingUserResult[0]);

          setIsEditing(true);
     }

     const saveRow = () => {
          if (demoMode) {
               alert("Adding a user is disabled in demo mode");
               return;
          }

          const currentUser = Object.assign({}, isAdding ? addingUser : editingUser) as IUser;

          // validate rows
          if (typeof currentUser.Username === "undefined" || currentUser.Username === "") {
               alert("Please enter the username");

               return;
          }

          const validateUser = users?.filter((validateCurrentUser: IUser) => {
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

          if (isPasswordModified) {
               if (typeof currentUser.Password === "undefined" || typeof currentUser.ConfirmPassword === "undefined") {
                    // TODO: Fix me. what do you do here?!
               }

               // In case I modify the password field but then decide not to add, just clear both fields to ignore validation
               if (currentUser.Password !== "" && currentUser.ConfirmPassword !== "") {
                    if (currentUser.Password !== currentUser.ConfirmPassword) {
                         alert("The 2 passwords do not match");

                         return;
                    }

                    const validationResult = validatePassword(currentUser.Password);

                    if (!validationResult) {
                         alert("The password must be at least 8 characters long, contain 2 lower case letters, 1 uppercase letter, 2 numbers and 2 symbols");
                         return;
                    }
               }
          }


          let columns = ``;

          if (isAdding !== true) {
               columns = `?wl_userid=${currentUser.UserID}`;
          }

          if (isPasswordModified === true && currentUser.Password !== "" && currentUser.ConfirmPassword !== "") {
               columns = (columns === "" ? "?" : "&") + `wl_password=${encodeURIComponent(currentUser.Password)}`;
          }

          columns += (columns === "" ? "?" : "&") + `wl_username=${encodeURIComponent(currentUser.Username)}`;
          columns += (columns === "" ? "?" : "&") + `wl_realname=${encodeURIComponent(currentUser.Realname)}`;
          columns += (columns === "" ? "?" : "&") + `wl_admin=${currentUser.Admin === 1 ? true : false}`;
          columns += (columns === "" ? "?" : "&") + `wl_enabled=${currentUser.Enabled === 1 ? true : false}`;

          const endPoint = (isAdding ? `/api/AddUser` : `/api/UpdateUser`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: AxiosResponse<IUser>) => {
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

     const userChangeHandler = (fieldName: string, fieldValue: string) => {
          const newUser: IUser = Object.assign({}, isAdding ? addingUser : editingUser) as IUser;

          if (fieldName === "Admin") {
               newUser[fieldName] = fieldValue === "true" ? 1 : 0;
          } else {
               newUser[fieldName] = fieldValue;
          }

          if (fieldName === "Password" || fieldName === "ConfirmPassword") {
               setIsPasswordModified(true);
          }

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
               const newUserData: IUser[] = require("../demo/index").demoUsers;

               setUsers(newUserData);
               setUsersLoadingStarted(true);
               setUsersLoadingComplete(true);
               return;
          }

          if (!usersLoadingStarted && !usersLoadingComplete) {
               setUsersLoadingStarted(true);

               axios.get(`/api/GetUsers`, { withCredentials: true })
                    .then((res: AxiosResponse<IUser>) => {
                         if (res.data[0] === "OK") {
                              setUsers(res.data[1]);
                         } else {
                              alert(res.data[1])
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
                         onClick={() => enterAddModeClickHandler()}>
                         Add User
                    </Button>
               }

               {users && users.length > 0 &&
                    <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`simpleTable ${!darkMode ? "lightMode" : "darkMode"}`}>
                         <thead>
                              <tr>
                                   <th>Actions</th>

                                   {!isAdding &&
                                        <th>ID</th>
                                   }

                                   <th>User name</th>
                                   <th>Name</th>
                                   {(isAdding || isEditing) &&
                                        <>
                                             <th>New Password</th>
                                             <th>Confirm Password</th>
                                             <th>Admin</th>
                                             <th>Enabled</th>
                                        </>
                                   }
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

                                        <td>
                                             <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" value={addingUser.Username} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Username", event.target.value)} />
                                        </td>

                                        <td>
                                             <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="name" value={addingUser.Realname} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Realname", event.target.value)} />
                                        </td>

                                        <td>
                                             <TextField type="password" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="password" value={addingUser.Password} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Password", event.target.value)} />
                                        </td>

                                        <td>
                                             <TextField type="password" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="password" value={addingUser.ConfirmPassword} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("ConfirmPassword", event.target.value)} />
                                        </td>

                                        <td>
                                             <input type="checkbox" checked={addingUser.Admin === 1 ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Admin", event.target.checked.toString())} />
                                        </td>

                                        <td>
                                             Y
                                        </td>
                                   </tr>
                              }


                              {users
                                   .filter((user: IUser) => {
                                        return (
                                             (!isAdding && !isEditing) ||
                                             (isEditing && editingUser.UserID === user.UserID)
                                        )
                                   })
                                   .map((user: IUser) => (
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
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" value={editingUser.Username} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Username", event.target.value)} />
                                                  }
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{user.Realname}</span>
                                                  }

                                                  {isEditing &&
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="realname" value={editingUser.Realname} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Realname", event.target.value)} />
                                                  }
                                             </td>

                                             {isEditing &&
                                                  <>
                                                       <td>
                                                            <TextField type="password" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="password" value={editingUser.Password} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Password", event.target.value)} />
                                                       </td>

                                                       <td>
                                                            <TextField type="password" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="password" value={editingUser.ConfirmPassword} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("ConfirmPassword", event.target.value)} />
                                                       </td>

                                                       <td>
                                                            {!isEditing &&
                                                                 <span>{user.Admin === 1 ? "Y" : "N"}</span>
                                                            }

                                                            {isEditing &&
                                                                 <input type="checkbox" checked={editingUser.Admin === 1 ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Admin", event.target.checked.toString())} />
                                                            }
                                                       </td>

                                                       <td>
                                                            {!isEditing &&
                                                                 <span>{user.Enabled === 1 ? "Y" : "N"}</span>
                                                            }

                                                            {isEditing &&
                                                                 <input type="checkbox" checked={editingUser.Enabled === 1 ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => userChangeHandler("Enabled", event.target.checked.toString())} />
                                                            }
                                                       </td>
                                                  </>
                                             }
                                        </tr>
                                   ))}
                         </tbody>
                    </table>
               }
          </>
     );
};

export default ManageUserAccounts;