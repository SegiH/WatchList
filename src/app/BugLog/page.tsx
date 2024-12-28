"use client"

import axios, { AxiosResponse } from "axios";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import IBugLog from "../interfaces/IBugLog";
import { DataContext, DataContextType } from "../data-context";
import TextField from "@mui/material/TextField";

import "../Admin/AdminConsole.css";
import "../page.css";

export default function BugLog() {
     const {
          bugLogs,
          CancelIconComponent,
          darkMode,
          defaultRoute,
          DeleteIconComponent,
          EditIconComponent,
          isAdding,
          isAdmin,
          isEditing,
          SaveIconComponent,
          setBugLogs,
          setIsError,
          setErrorMessage,
          setIsAdding,
          setIsEditing
     } = useContext(DataContext) as DataContextType;

     const [addingBugLog, setAddingBugLog] = useState<IBugLog>({} as IBugLog);
     const [editingBugLog, setEditingBugLog] = useState<IBugLog>({} as IBugLog);
     const [bugLogsLoadingStarted, setBugLogsLoadingStarted] = useState(false);
     const [bugLogsLoadingComplete, setBugLogsLoadingComplete] = useState(false);
     const [isMounted, setIsMounted] = useState(false);
     const [showActiveBugLogs, setShowActiveBugLogs] = useState(true);

     const router = useRouter();

     const cssStyle = {
          width: "100%",
          height: "100% !important"
     };

     const cancelAddEditModeClickHandler = () => {
          setIsAdding(false);
          setIsEditing(false);
     }

     const calculateRowCount = (bugName: string, resolutionNotes) => {
          const bugNameLength = typeof bugName !== "undefined" && bugName !== null ? bugName.length : 0;
          const resolutionNotesLength = typeof resolutionNotes !== "undefined" && resolutionNotes !== null ? resolutionNotes.length : 0;

          let rowCount = (bugNameLength > resolutionNotesLength ? bugNameLength : resolutionNotesLength);

          if (rowCount < 150) {
               rowCount = 150;
          }

          return rowCount / 30;
     }

     const bugLogChangeHandler = (fieldName: string, fieldValue: string) => {
          const newBugLog = Object.assign({}, isAdding ? addingBugLog : editingBugLog);

          newBugLog[fieldName] = fieldValue;
          newBugLog.IsModified = true;

          if (isAdding) {
               setAddingBugLog(newBugLog);
          } else {
               setEditingBugLog(newBugLog);
          }
     }

     const deleteBugLogHandler = (id: number) => {
          const confirmLeave = confirm(`Are you sure that you want to delete the Bug Log ?`);

          if (!confirmLeave) {
               return;
          }

          axios.put(`/api/DeleteBugLog?WLBugID=${id}`, { withCredentials: true })
               .then((response: AxiosResponse<IBugLog>) => {
                    if (response.data[0] === "ERROR") {
                         alert(response.data[1])
                    } else {
                         alert("The bug log has been deleted");
                         setBugLogsLoadingStarted(false);
                         setBugLogsLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to delete bug log with the error " + err.message);
               });
     }

     const enterAddModeClickHandler = () => {
          setAddingBugLog({
               WLBugID: -1,
               WLBugName: "",
               AddDate: "",
               CompletedDate: "",
               ResolutionNotes: "",
               IsModified: false,
               isNew: true
          })

          setIsAdding(true);
     }

     const enterEditModeClickHandler = (id: number) => {
          const newEditBugLog = bugLogs?.filter((bugLog: IBugLog) => bugLog.WLBugID === id);

          if (newEditBugLog.length !== 1) { // This shouldn't ever happen
               alert("Unable to locate bug log in BugLogs");
               return;
          }

          setEditingBugLog(newEditBugLog[0]);

          setIsEditing(true);
     };

     const saveRow = () => {
          const currentBugLog = Object.assign({}, isAdding ? addingBugLog : editingBugLog);

          // validate rows
          if (typeof currentBugLog.WLBugName === "undefined" || currentBugLog.WLBugName === "") {
               alert("Please enter the bug name");

               return;
          }

          if (typeof currentBugLog.AddDate === "undefined" || currentBugLog.AddDate === "") {
               alert("Please enter the add date");

               return;
          }

          let columns = ``;

          if (isAdding !== true) {
               columns = `?WLBugID=${currentBugLog.WLBugID}`;
          }

          columns += (columns === `` ? `?` : `&`) + `WLBugName=${encodeURIComponent(currentBugLog.WLBugName)}`;
          columns += (columns === `` ? `?` : `&`) + `AddDate=${currentBugLog.AddDate}`;

          if (typeof currentBugLog.CompletedDate !== "undefined" && currentBugLog.CompletedDate !== null) {
               columns += (columns === `` ? `?` : `&`) + `CompletedDate=${currentBugLog.CompletedDate}`;
          }

          if (typeof currentBugLog.ResolutionNotes !== "undefined") {
               columns += (columns === `` ? `?` : `&`) + `ResolutionNotes=${encodeURIComponent(currentBugLog.ResolutionNotes)}`;
          }

          const endPoint = (currentBugLog.isNew == true ? `/api/AddBugLog` : `/api/UpdateBugLog`) + columns;

          axios.put(endPoint, { withCredentials: true })
               .then((response: AxiosResponse<IBugLog>) => {
                    if (response !== null && response.data !== null && response.data[0] === "OK") {
                         alert("Saved");

                         setBugLogsLoadingStarted(false);
                         setBugLogsLoadingComplete(false);

                         setIsAdding(false);
                         setIsEditing(false);
                    } else {
                         alert(response.data[1]);
                    }
               })
               .catch((err: Error) => {
                    alert("Failed to update bug log with the error " + err.message);
               });
     }

     useEffect(() => {
          if (bugLogsLoadingStarted) {
               return;
          }

          setBugLogsLoadingStarted(true);

          axios.get(`/api/GetBugLogs`)
               .then((res) => {
                    if (res.data[0] === "OK") {
                         setBugLogs(res.data[1]);
                         setBugLogsLoadingComplete(true);
                    } else {
                         alert(`An error occurred while getting the bug logs`);
                    }
               })
               .catch((err: Error) => {
                    setErrorMessage(`The fatal error ${err.message} occurred while getting the bug logs`);
                    setIsError(true);
               });
     }, [bugLogsLoadingStarted, bugLogsLoadingComplete]);

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin()) {
               router.push(defaultRoute)
          }

          setIsMounted(true);
     }, []);

     return (
          <>
               {isMounted &&
                    <span className="topMarginContent">
                         {bugLogsLoadingComplete &&
                              <span>
                                   <Button
                                        color="primary"
                                        variant="contained"
                                        className="borderRadius15 bottomMargin20"
                                        onClick={() => enterAddModeClickHandler()}>
                                        Add Bug Log
                                   </Button>

                                   <span className="leftMargin40">
                                        Show Active Bug Logs
                                        <input className={`${!darkMode ? "lightMode" : "darkMode"}`} type="checkbox" checked={showActiveBugLogs} onChange={(event) => setShowActiveBugLogs(event.target.checked)} />
                                   </span>
                              </span>
                         }

                         {bugLogsLoadingComplete && bugLogs.length > 0 &&
                              <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`fullWidth ${!darkMode ? "lightMode" : "darkMode"}`}>
                                   <thead>
                                        <tr>
                                             <th>Actions</th>

                                             {!isAdding &&
                                                  <th>ID</th>
                                             }

                                             <th>Bug name</th>
                                             <th>Resolution Notes</th>
                                             <th>Added On</th>
                                             <th>Completed On</th>

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
                                                       <textarea readOnly={false} style={cssStyle} value={addingBugLog.WLBugName} rows={calculateRowCount(addingBugLog.WLBugName, addingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("WLBugName", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <textarea readOnly={false} style={cssStyle} value={addingBugLog.ResolutionNotes} rows={calculateRowCount(addingBugLog.WLBugName, addingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("ResolutionNotes", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="addedOn" value={addingBugLog.AddDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("AddDate", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="completedOn" value={addingBugLog.CompletedDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("Completed", event.target.value)} />
                                                  </td>
                                             </tr>
                                        }

                                        {bugLogs
                                             .filter((bugLog: IBugLog) => {
                                                  return (
                                                       ((showActiveBugLogs == false) || (showActiveBugLogs == true && bugLog.CompletedDate === null)) &&
                                                       ((!isAdding && !isEditing) ||
                                                            (isEditing && editingBugLog.WLBugID === bugLog.WLBugID))
                                                  )
                                             })
                                             .map((bugLog: IBugLog) => {

                                                  return (
                                                       <tr key={bugLog.WLBugID}>
                                                            <td>
                                                                 {!isEditing &&
                                                                      <span className={`clickable tabIcon`} onClick={() => enterEditModeClickHandler(bugLog.WLBugID)}>
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
                                                                 <span>{bugLog.WLBugID}</span>
                                                            </td>

                                                            <td>
                                                                 {!isEditing &&
                                                                      <span className="wordWrapLabel">{bugLog.WLBugName}</span>
                                                                 }

                                                                 {isEditing &&
                                                                      <textarea readOnly={false} style={cssStyle} value={editingBugLog.WLBugName} rows={calculateRowCount(editingBugLog.WLBugName, editingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("WLBugName", event.target.value)} />
                                                                 }
                                                            </td>

                                                            <td>
                                                                 {!isEditing &&
                                                                      <span className="wordWrapLabel">{bugLog.ResolutionNotes}</span>
                                                                 }

                                                                 {isEditing &&
                                                                      <textarea readOnly={false} style={cssStyle} value={editingBugLog.ResolutionNotes} rows={calculateRowCount(editingBugLog.WLBugName, editingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("ResolutionNotes", event.target.value)} />
                                                                 }
                                                            </td>

                                                            <td>
                                                                 {!isEditing &&
                                                                      <span>{bugLog.AddDate}</span>
                                                                 }

                                                                 {isEditing &&
                                                                      <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="addedOn" value={editingBugLog.AddDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("AddDate", event.target.value)} />
                                                                 }
                                                            </td>

                                                            <td>
                                                                 {!isEditing &&
                                                                      <span>{bugLog.CompletedDate}</span>
                                                                 }

                                                                 {isEditing &&
                                                                      <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="completedOn" value={editingBugLog.CompletedDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("Completed", event.target.value)} />
                                                                 }
                                                            </td>

                                                            {!isAdding && !isEditing &&
                                                                 <td>
                                                                      <span className={`clickable iconLarge`} onClick={() => deleteBugLogHandler(bugLog.WLBugID)}>
                                                                           {DeleteIconComponent}
                                                                      </span>
                                                                 </td>
                                                            }
                                                       </tr>
                                                  )
                                             })}
                                   </tbody>
                              </table>
                         }
                    </span>
               }
          </>
     )
}