import axios, { AxiosResponse } from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import IWatchListSource from "../interfaces/IWatchListSource";

import { DataContext, DataContextType } from "../data-context";

const ManageWatchListSources = () => {
     const {
          CancelIconComponent,
          darkMode,
          defaultRoute,
          DeleteIconComponent,
          demoMode,
          EditIconComponent,
          isAdding,
          isAdmin,
          isEditing,
          SaveIconComponent,
          setIsAdding,
          setIsEditing,
          setWatchListSourcesLoadingComplete,
          setWatchListSourcesLoadingStarted,
          watchListSources,
          watchListSourcesLoadingComplete
     } = useContext(DataContext) as DataContextType;

     const [addingSource, setAddingSource] = useState<IWatchListSource | null>(null);
     const [editingSource, setEditingSource] = useState<IWatchListSource | null>(null);

     const router = useRouter();

     const cancelAddEditModeClickHandler = () => {
          setIsAdding(false);
          setIsEditing(false);
     }

     const deleteSourceClickHandler = (id: number, name: string) => {
          const confirmLeave = confirm(`Are you sure that you want to delete the WatchList Source ${name} ?`);

          if (!confirmLeave) {
               return;
          }

          axios.put(`/api/DeleteWatchListSource?WatchListSourceID=${id}`, { withCredentials: true })
               .then((response: AxiosResponse<IWatchListSource>) => {
                    if (response.data[0] === "ERROR") {
                         alert(response.data[1])
                    } else {
                         setWatchListSourcesLoadingStarted(false);
                         setWatchListSourcesLoadingComplete(false);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to delete source with the error " + err.message);
               });
     }

     const enterAddModeClickHandler = () => {
          setAddingSource({
               WatchListSourceID: -1,
               WatchListSourceName: "",
               IsModified: false
          })

          setIsAdding(true);
     }

     const enterEditModeClickHandler = (id: number) => {
          const newEditingSourceResult = watchListSources?.filter((watchListSource: IWatchListSource) => {
               return watchListSource.WatchListSourceID === id;
          });

          if (newEditingSourceResult.length !== 1) { // This shouldn't ever happen
               alert("Unable to locate source in Sources");
               return;
          }

          setEditingSource(newEditingSourceResult[0]);

          setIsEditing(true);
     }

     const saveRow = () => {
          if (demoMode) {
               alert("Adding a source is disabled in demo mode");
               return;
          }

          const currentSource = Object.assign({}, isAdding ? addingSource : editingSource);

          // validate rows
          if (typeof currentSource.WatchListSourceName === "undefined" || currentSource.WatchListSourceName === "") {
               alert("Please enter the source name");

               return;
          }

          let columns = ``;

          if (isEditing) {
               if (editingSource !== null) {
                    columns = `?WatchListSourceID=${editingSource.WatchListSourceID}&WatchListSourceName=${encodeURIComponent(editingSource.WatchListSourceName)}`;
               } else { // This shouldn't ever happen
                    alert("Unable to update the source because editingSource is null");
               }
          } else {
               if (addingSource !== null) {
                    columns = `?WatchListSourceName=${encodeURIComponent(addingSource.WatchListSourceName)}`;
               } else { // This shouldn't ever happen
                    alert("Unable to update the source because addingSource is null");
               }
          }

          const endPoint = (isAdding == true ? `/api/AddWatchListSource` : `/api/UpdateWatchListSource`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: AxiosResponse<IWatchListSource>) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setWatchListSourcesLoadingStarted(false);
                         setWatchListSourcesLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update sources with the error " + err.message);
               });
     }

     const sourceChangeHandler = (fieldName: string, fieldValue: string) => {
          const newUser = Object.assign({}, isAdding ? addingSource : editingSource);

          newUser[fieldName] = fieldValue;
          newUser.IsModified = true;

          if (isAdding) {
               setAddingSource(newUser);
          } else {
               setEditingSource(newUser);
          }
     }

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin()) {
               router.push(defaultRoute)
          }
     }, []);

     return (
          <span>
               {watchListSourcesLoadingComplete &&
                    <Button
                         color="primary"
                         variant="contained"
                         className="borderRadius15 bottomMargin20 topMargin"
                         onClick={enterAddModeClickHandler}>
                         Add Source
                    </Button>
               }

               {watchListSources && watchListSources.length > 0 &&
                    <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                         <thead>
                              <tr>
                                   <th>Actions</th>
                                   <th>ID</th>
                                   <th>Source name</th>

                                   {!isAdding && !isEditing &&
                                        <th>Delete</th>
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
                                        </td>

                                        <td>
                                             {addingSource !== null &&
                                                  <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="sourcename" label="source name" value={addingSource.WatchListSourceName} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => sourceChangeHandler("WatchListSourceName", event.target.value)} />
                                             }
                                        </td>
                                   </tr>
                              }

                              {watchListSources
                                   .filter((watchListSource: IWatchListSource) => {
                                        return (
                                             (!isAdding && !isEditing) ||
                                             (isEditing && editingSource && editingSource.WatchListSourceID === watchListSource.WatchListSourceID)
                                        )
                                   })
                                   .map((watchListSource: IWatchListSource) => (
                                        <tr key={watchListSource.WatchListSourceID}>
                                             <td>
                                                  {!isEditing &&
                                                       <span className={`clickable tabIcon`} onClick={() => enterEditModeClickHandler(watchListSource.WatchListSourceID)}>
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
                                                  <span>{watchListSource.WatchListSourceID}</span>
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{watchListSource.WatchListSourceName}</span>
                                                  }

                                                  {isEditing && editingSource &&
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="username" label="username" value={editingSource.WatchListSourceName} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => sourceChangeHandler("WatchListSourceName", event.target.value)} />
                                                  }
                                             </td>

                                             {!isAdding && !isEditing &&
                                                  <td>
                                                       <span className={`clickable iconLarge`} onClick={() => deleteSourceClickHandler(watchListSource.WatchListSourceID, watchListSource.WatchListSourceName)}>
                                                            {DeleteIconComponent}
                                                       </span>
                                                  </td>
                                             }
                                        </tr>
                                   ))}
                         </tbody>
                    </table>
               }
          </span>
     );
};

export default ManageWatchListSources;