import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";

import { APIStatus, DataContext, DataContextType } from "../data-context";
import IWatchListType from "../interfaces/IWatchListType";

const ManageWatchListTypes = () => {
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
          setWatchListTypesLoadingCheck,
          watchListTypes,
          watchListTypesLoadingCheck
     } = useContext(DataContext) as DataContextType;

     const [addingType, setAddingType] = useState<IWatchListType | null>(null);
     const [editingType, setEditingType] = useState<IWatchListType | null>(null);

     const router = useRouter();

     const addTypeClickHandler = () => {
          setAddingType({
               WatchListTypeID: -1,
               WatchListTypeName: "",
               IsModified: false
          })

          setIsAdding(true);
     }

     const cancelAddEditTypeClickHandler = () => {
          setIsAdding(false);
          setIsEditing(false);
     }

     const deleteTypeClickHandler = (id: number, name: string) => {
          const confirmDelete = confirm(`Are you sure that you want to delete the WatchList Type ${name} ?`);

          if (!confirmDelete) {
               return;
          }

          axios.put(`/api/DeleteWatchListType?WatchListTypeID=${id}`, { withCredentials: true })
               .then((response: AxiosResponse<IWatchListType>) => {
                    if (response.data[0] === "ERROR") {
                         alert(response.data[1])
                    } else {
                         setWatchListTypesLoadingCheck(APIStatus.Idle);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to delete type with the error " + err.message);
               });
     }

     const editTypeClickHandler = (id: number) => {
          const newEditingTypeResult = watchListTypes?.filter((watchListType: IWatchListType) => {
               return watchListType.WatchListTypeID === id;
          });

          if (newEditingTypeResult.length !== 1) { // This shouldn't ever happen
               alert("Unable to locatetype in Types");
               return;
          }

          setEditingType(newEditingTypeResult[0]);

          setIsEditing(true);
     }

     const saveRow = () => {
          if (demoMode) {
               alert("Adding a type is disabled in demo mode");
               return;
          }

          const currentType = Object.assign({}, isAdding ? addingType : editingType);

          // validate row
          if (typeof currentType.WatchListTypeName === "undefined" || currentType.WatchListTypeName === "") {
               alert("Please enter the type name");

               return;
          }

          let columns = ``;

          if (isEditing) {
               if (editingType !== null) {
                    columns = `?WatchListTypeID=${editingType.WatchListTypeID}&WatchListTypeName=${encodeURIComponent(editingType.WatchListTypeName)}`;
               }
          } else {
               if (addingType !== null) {
                    columns = `?WatchListTypeName=${encodeURIComponent(addingType.WatchListTypeName)}`;
               }
          }

          const endPoint = (isAdding == true ? `/api/AddWatchListType` : `/api/UpdateWatchListType`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: AxiosResponse<IWatchListType>) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setWatchListTypesLoadingCheck(APIStatus.Idle);
                         setIsAdding(false);
                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update types with the error " + err.message);
               });
     }

     const typeChangeHandler = (fieldName: string, fieldValue: string) => {
          const newType = Object.assign({}, isAdding ? addingType : editingType);

          newType[fieldName] = fieldValue;
          newType.IsModified = true;

          if (isAdding) {
               setAddingType(newType);
          } else {
               setEditingType(newType);
          }
     }

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin() && !demoMode) {
               router.push(defaultRoute)
          }
     }, [defaultRoute, demoMode, isAdmin, router]);

     return (
          <span>
               {watchListTypesLoadingCheck === APIStatus.Success &&
                    <Button
                         color="primary"
                         variant="contained"
                         className="borderRadius15 bottomMargin20 topMargin"
                         onClick={addTypeClickHandler} >
                         Add Type
                    </Button>
               }

               {watchListTypes && watchListTypes.length > 0 &&
                    <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`simpleTable ${!darkMode ? "lightMode" : "darkMode"}`}>
                         <thead>
                              <tr>
                                   <th>Actions</th>

                                   {!isAdding &&
                                        <th>ID</th>
                                   }

                                   <th>Type name</th>

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

                                                  <span className={`clickable iconLarge error`} onClick={() => cancelAddEditTypeClickHandler()}>
                                                       {CancelIconComponent}
                                                  </span>
                                             </span>
                                        </td>

                                        <td>
                                             {addingType !== null &&
                                                  <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="typename" value={addingType.WatchListTypeName} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => typeChangeHandler("WatchListTypeName", event.target.value)} />
                                             }
                                        </td>
                                   </tr>
                              }

                              {watchListTypes
                                   .filter((watchListType: IWatchListType) => {
                                        return (
                                             (!isAdding && !isEditing) ||
                                             (isEditing && editingType && editingType.WatchListTypeID === watchListType.WatchListTypeID)
                                        )
                                   })
                                   .map((watchListType: IWatchListType) => (
                                        <tr key={watchListType.WatchListTypeID}>
                                             <td>
                                                  {!isEditing &&
                                                       <span className={`clickable tabIcon`} onClick={() => editTypeClickHandler(watchListType.WatchListTypeID)}>
                                                            {EditIconComponent}
                                                       </span>
                                                  }

                                                  {isEditing &&
                                                       <span className="inlineFlex">
                                                            <span className={`clickable iconLarge primary`} onClick={saveRow}>
                                                                 {SaveIconComponent}
                                                            </span>

                                                            <span className={`clickable iconLarge error`} onClick={() => cancelAddEditTypeClickHandler()}>
                                                                 {CancelIconComponent}
                                                            </span>
                                                       </span>
                                                  }
                                             </td>

                                             <td>
                                                  <span>{watchListType.WatchListTypeID}</span>
                                             </td>

                                             <td>
                                                  {!isEditing &&
                                                       <span>{watchListType.WatchListTypeName}</span>
                                                  }

                                                  {isEditing && editingType !== null &&
                                                       <TextField className={`lightMode borderRadius15 minWidth150`} margin="dense" id="typename" value={editingType.WatchListTypeName} variant="standard" onChange={(event: React.ChangeEvent<HTMLInputElement>) => typeChangeHandler("WatchListTypeName", event.target.value)} />
                                                  }
                                             </td>

                                             {!isAdding && !isEditing &&
                                                  <td>
                                                       <span className={`clickable iconLarge`} onClick={() => deleteTypeClickHandler(watchListType.WatchListTypeID, watchListType.WatchListTypeName)}>
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

export default ManageWatchListTypes;
