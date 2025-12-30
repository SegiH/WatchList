"use client"

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import { APIStatus, BugLogsContext } from "../data-context";
import IBugLog from "../interfaces/IBugLog";

import "../page.css";
import { BugLogsContextType } from "../interfaces/contexts/BugLogsContextType";

export default function BugLogs() {
     const {
          bugLogs, CancelIconComponent, darkMode, defaultRoute, DeleteIconComponent, EditIconComponent, isAdding, isAdmin, isEditing, SaveIconComponent, setBugLogs, setIsError, setErrorMessage, setIsAdding, setIsEditing
     } = useContext(BugLogsContext) as BugLogsContextType;

     const [addingBugLog, setAddingBugLog] = useState<IBugLog>({} as IBugLog);
     const [editingBugLog, setEditingBugLog] = useState<IBugLog>({} as IBugLog);
     const [bugLogsLoadingCheck, setBugLogsLoadingCheck] = useState(APIStatus.Idle);
     const [isMounted, setIsMounted] = useState(false);
     const [showActiveBugLogs, setShowActiveBugLogs] = useState(true);

     const router = useRouter();

     const cssStyle = {
          width: "100%",
          height: "100% !important"
     };

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

     const deleteBugLogHandler = async (id: number) => {
          const confirmDelete = confirm(`Are you sure that you want to delete the Bug Log ?`);

          if (!confirmDelete) {
               return;
          }

          try {
               const deleteBugLogResponse = await fetch(`/api/DeleteBugLog?BugLogId=${id}`, { method: 'PUT', credentials: 'include' });

               const deleteBugLogResult = await deleteBugLogResponse.json();

               if (deleteBugLogResult[0] === "ERROR") {
                    alert(deleteBugLogResult[1])
               } else {
                    alert("The bug log has been deleted");

                    const newBugLogs = bugLogs?.filter((bugLog: IBugLog) => bugLog.BugLogId !== id);

                    setBugLogs(newBugLogs);
               }
          } catch (e) {
               alert(e.errorMessage);
          }
     }

     const enterAddModeClickHandler = () => {
          const dateObj = new Date();

          const newFormattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`

          setAddingBugLog({
               BugLogId: -1,
               BugName: "",
               AddDate: newFormattedDate,
               CompletedDate: "",
               ResolutionNotes: "",
               IsModified: false,
               isNew: true
          })

          setIsAdding(true);
     }

     const enterEditModeClickHandler = (id: number) => {
          const newEditBugLog = bugLogs?.filter((bugLog: IBugLog) => bugLog.BugLogId === id);

          if (newEditBugLog.length !== 1) { // This shouldn't ever happen
               alert("Unable to locate bug log in BugLogs");
               return;
          }

          setEditingBugLog(newEditBugLog[0]);

          setIsEditing(true);
     };

     const getBugLogs = async () => {
          try {
               const getBugLogsResponse = await fetch(`/api/GetBugLogs`, { credentials: 'include' });

               const getBugLogsResult = await getBugLogsResponse.json();

               if (getBugLogsResult[0] === "OK") {
                    getBugLogsResult[1].forEach(async (element: IBugLog) => {
                         element.AddDate = String(element.AddDate).trim();

                         if (element.CompletedDate !== null) {
                              element.CompletedDate = String(element.CompletedDate).trim();
                         }
                    });

                    setBugLogs(getBugLogsResult[1]);
                    setBugLogsLoadingCheck(APIStatus.Success);
               } else {
                    alert(`An error occurred while getting the bug logs`);
               }
          } catch (e) {
               alert(e.errorMessage);
          }
     }

     const saveRow = async () => {
          const currentBugLog = Object.assign({}, isAdding ? addingBugLog : editingBugLog);

          // validate rows
          if (typeof currentBugLog.BugName === "undefined" || currentBugLog.BugName === "") {
               alert("Please enter the bug name");

               return;
          }

          if (typeof currentBugLog.AddDate === "undefined" || currentBugLog.AddDate === "") {
               alert("Please enter the add date");

               return;
          }

          let columns = ``;

          if (isAdding !== true) {
               columns = `?BugLogId=${currentBugLog.BugLogId}`;
          }

          columns += (columns === `` ? `?` : `&`) + `BugName=${encodeURIComponent(currentBugLog.BugName)}`;
          columns += (columns === `` ? `?` : `&`) + `AddDate=${currentBugLog.AddDate}`;

          if (typeof currentBugLog.CompletedDate !== "undefined" && currentBugLog.CompletedDate !== null) {
               columns += (columns === `` ? `?` : `&`) + `CompletedDate=${currentBugLog.CompletedDate !== '' ? currentBugLog.CompletedDate : 'NULL'}`;
          }

          if (typeof currentBugLog.ResolutionNotes !== "undefined") {
               columns += (columns === `` ? `?` : `&`) + `ResolutionNotes=${encodeURIComponent(currentBugLog.ResolutionNotes)}`;
          }

          const endPoint = (currentBugLog.isNew == true ? `/api/AddBugLog` : `/api/UpdateBugLog`) + columns;

          try {
               const saveBugLogResponse = await fetch(endPoint, { method: 'PUT', credentials: 'include' });

               const saveBugLogResult = await saveBugLogResponse.json();

               if (saveBugLogResult !== null && saveBugLogResult[0] === "OK") {
                    alert("Saved");

                    setBugLogsLoadingCheck(APIStatus.Idle);

                    setIsAdding(false);
                    setIsEditing(false);
               } else {
                    alert(saveBugLogResult[1]);
               }
          } catch (e) {
               alert(e.errorMessage);
          }
     }

     useEffect(() => {
          if (bugLogsLoadingCheck === APIStatus.Idle) {
               setBugLogsLoadingCheck(APIStatus.Loading);
               return;
          }

          getBugLogs();
     }, [bugLogsLoadingCheck, setBugLogs, setErrorMessage, setIsError]);

     useEffect(() => {
          // Make sure current user is an admin
          if (!isAdmin()) {
               router.push(defaultRoute)
          }

          setIsMounted(true);
     }, [defaultRoute, isAdmin, router, setIsMounted]);

     return (
          <>
               {isMounted &&
                    <span className="topMarginContent">
                         {bugLogsLoadingCheck === APIStatus.Success &&
                              <span>
                                   {!isAdding && !isEditing &&
                                        <>
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
                                        </>
                                   }
                              </span>
                         }

                         {bugLogsLoadingCheck === APIStatus.Success && bugLogs.length > 0 &&
                              <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`simpleTable fullWidth ${!darkMode ? "lightMode" : "darkMode"}`}>
                                   <thead>
                                        <tr>
                                             <th>Actions</th>

                                             {!isAdding &&
                                                  <th>ID</th>
                                             }

                                             <th>Bug name</th>

                                             {(isAdding || isEditing) &&
                                                  <>
                                                       <th>Resolution Notes</th>
                                                       <th>Added On</th>
                                                       <th>Completed On</th>

                                                       {!isAdding && !isEditing &&
                                                            <th>Delete</th>
                                                       }
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
                                                       <textarea readOnly={false} style={cssStyle} value={addingBugLog.BugName} rows={calculateRowCount(addingBugLog.BugName, addingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("BugName", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <textarea readOnly={false} style={cssStyle} value={addingBugLog.ResolutionNotes} rows={calculateRowCount(addingBugLog.BugName, addingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("ResolutionNotes", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="addedOn" value={addingBugLog.AddDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("AddDate", event.target.value)} />
                                                  </td>

                                                  <td>
                                                       <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="completedOn" value={addingBugLog.CompletedDate} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("CompletedDate", event.target.value)} />
                                                  </td>
                                             </tr>
                                        }

                                        {bugLogs
                                             .filter((bugLog: IBugLog) => {
                                                  return (
                                                       ((showActiveBugLogs == false) || (showActiveBugLogs == true && bugLog.CompletedDate === null)) &&
                                                       ((!isAdding && !isEditing) ||
                                                            (isEditing && editingBugLog.BugLogId === bugLog.BugLogId))
                                                  )
                                             })
                                             .map((bugLog: IBugLog) => {

                                                  return (
                                                       <tr key={bugLog.BugLogId}>
                                                            <td>
                                                                 {!isEditing &&
                                                                      <span className={`clickable tabIcon`} onClick={() => enterEditModeClickHandler(bugLog.BugLogId)}>
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
                                                                 <span>{bugLog.BugLogId}</span>
                                                            </td>

                                                            <td>
                                                                 {!isEditing &&
                                                                      <span className="wordWrapLabel">{bugLog.BugName}</span>
                                                                 }

                                                                 {isEditing &&
                                                                      <textarea readOnly={false} style={cssStyle} value={typeof editingBugLog.BugName !== "undefined" ? editingBugLog.BugName : ""} rows={calculateRowCount(editingBugLog.BugName, editingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("BugName", event.target.value)} />
                                                                 }
                                                            </td>

                                                            {(isAdding || isEditing) &&
                                                                 <>
                                                                      <td>
                                                                           {!isEditing &&
                                                                                <span className="wordWrapLabel">{bugLog.ResolutionNotes}</span>
                                                                           }

                                                                           {isEditing &&
                                                                                <textarea readOnly={false} style={cssStyle} value={typeof editingBugLog.ResolutionNotes !== "undefined" ? editingBugLog.ResolutionNotes : ""} rows={calculateRowCount(editingBugLog.BugName, editingBugLog.ResolutionNotes)} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("ResolutionNotes", event.target.value)} />
                                                                           }
                                                                      </td>

                                                                      <td>
                                                                           {!isEditing &&
                                                                                <span>{bugLog.AddDate}</span>
                                                                           }

                                                                           {isEditing &&
                                                                                <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="addedOn" value={typeof editingBugLog.AddDate !== "undefined" ? editingBugLog.AddDate : ""} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("AddDate", event.target.value)} />
                                                                           }
                                                                      </td>

                                                                      <td>
                                                                           {!isEditing &&
                                                                                <span>{bugLog.CompletedDate}</span>
                                                                           }

                                                                           {isEditing &&
                                                                                <TextField type="date" className={`lightMode borderRadius15 minWidth150`} margin="dense" id="completedOn" value={typeof editingBugLog.CompletedDate !== "undefined" && editingBugLog.CompletedDate !== null ? editingBugLog.CompletedDate : ""} variant="standard" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => bugLogChangeHandler("CompletedDate", event.target.value)} />
                                                                           }
                                                                      </td>

                                                                      {!isAdding && !isEditing &&
                                                                           <td>
                                                                                <span className={`clickable iconLarge`} onClick={() => deleteBugLogHandler(bugLog.BugLogId)}>
                                                                                     {DeleteIconComponent}
                                                                                </span>
                                                                           </td>
                                                                      }
                                                                 </>
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