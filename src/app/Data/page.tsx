"use client"

import React, { useContext, useEffect, useState } from "react";
import { APIStatus, DataContext, DataContextType } from "../data-context";
import { useRouter } from 'next/navigation';

import "../page.css";
import axios, { AxiosResponse } from "axios";
import IBugLog from "../interfaces/IBugLog";
import IUser from "../interfaces/IUser";

export default function BugLog() {
    const {
        bugLogs,
        darkMode,
        defaultRoute,
        setIsError,
        setErrorMessage,
        userData,
        visibleSections,
        watchList,
        watchListItems,
        watchListSources,
        watchListTypes,
        isAdmin
    } = useContext(DataContext) as DataContextType;

    const [activeSection, setActiveSection] = useState("");
    const [dataSource, setDataSource] = useState<any>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [usersLoadingCheck, setUsersLoadingCheck] = useState(APIStatus.Idle);

    const router = useRouter();

    // COntinue here. Add users (need to fetch data), Options 
    const dataSchema = {
        WatchList: [{
            "WatchListID": "ID",
            "UserID": "User ID",
            "WatchListItemName": "Item name",
            "WatchListTypeName": "Type",
            "IMDB_URL": "URL",
            "IMDB_Poster": "Image",
            "Notes": "Notes",
            "Archived": "Archived",
            "Enabled": "Enabled",
            "IMDB_JSON": "JSON", // Always put this last since its big
        }],
        Items: [{
            "WatchListItemID": "ID",
            "WatchListItemName": "Name",
            "WatchListTypeName": "Type",
            "IMDB_URL": "URL",
            "IMDB_Poster": "Image",
            "ItemNotes": "Notes",
            "Archived": "Archived",
            "Enabled": "Enabled",
            "IMDB_JSON": "JSON" // Always put this last since its big
        }],
        BugLogs: [{
            "BugLogId": "ID",
            "BugName": "Name",
            "AddDate": "Added On",
            "CompletedDate": "Completed On",
            "ResolutionNotes": "Resolution Notes"
        }],
        /*Options: [{
            "OptionID": "ID",
            "UserID": "User ID",
            "ArchivedVisible": "Archived Visible",
            "AutoAdd": "Auto Add",
            "DarkMode": "Dark Mode",
            "HideTabs": "Hide Tabs",
            "SearchCount": "Search Count",
            "StillWatching": "Still Watching",
            "ShowMissingArtwork": "Show Missing Artwork",
            "SourceFilter": "Source Filter",
            "TypeFilter": "Type Filter",
            "WatchListSortColumn": "Sort Column",
            "WatchListSortDirection": "Sort Direction",
            "VisibleSections": "Visible Sections",
            "SortColumn": "Sort Column",
            "SortDirection": "Sort Direction"
        }],*/
        Users: [{
            "UserID": "ID",
            "Username": "Username",
            "Realname": "Realname",
            "Admin": "Admin",
            "Enabled": "Enabled",
        }],
        VisibleSections: [{
            "value": "value",
            "label": "label",
        }],
        WatchListSources: [{
            "WatchListSourceID": "ID",
            "WatchListSourceName": "Name",
        }],
        WatchListTypes: [{
            "WatchListTypeID": "ID",
            "WatchListTypeName": "Name",
        }]
    };

    const activeSectionCHangeHandler = async (newActiveSection: string) => {
        setActiveSection(newActiveSection);

        switch (newActiveSection) {
            case "WatchList":
                setDataSource(watchList);
                break;
            case "Items":
                setDataSource(watchListItems);
                break;
            case "BugLogs":
                if (bugLogs.length === 0) {
                    await getBugLogs();
                    break;
                } else {
                    setDataSource(bugLogs);
                    break;
                }
            //case "Options": // TODO: Fix me
                //setDataSource(userData.)
                //break;
            case "VisibleSections":
                setDataSource(visibleSections);
                break;
            case "WatchListSources":
                setDataSource(watchListSources);
                break;
            case "WatchListTypes":
                setDataSource(watchListTypes);
                break;
            case "Users":
                if (users.length > 0) {
                    setDataSource(users);
                    return;
                }

                await axios.get(`/api/GetUsers`, { withCredentials: true })
                    .then((res: AxiosResponse<IUser>) => {
                        if (res.data[0] === "OK") {
                            setDataSource(res.data[1]);
                            setUsers(res.data[1]); // Save copy to avoid multiple calls to API
                        } else {
                            alert(res.data[1])
                            setErrorMessage(res.data[1]);
                            setIsError(true);
                        }

                        setUsersLoadingCheck(APIStatus.Success);
                    })
                    .catch((err: Error) => {
                        setErrorMessage("Failed to get users with the error " + err.message);
                        setIsError(true);
                    });
                break;
            default:
                setDataSource([]);
                break;
        }
    }

    const getBugLogs = async () => {
        axios.get(`/api/GetBugLogs`)
            .then((res) => {
                if (res.data[0] === "OK") {
                    res.data[1].forEach(async (element: IBugLog) => {
                        element.AddDate = String(element.AddDate).trim();

                        if (element.CompletedDate !== null) {
                            element.CompletedDate = String(element.CompletedDate).trim();
                        }
                    });

                    setDataSource(res.data[1]);
                } else {
                    alert(`An error occurred while getting the bug logs`);
                }
            })
            .catch((err: Error) => {
                setErrorMessage(`The fatal error ${err.message} occurred while getting the bug logs`);
                setIsError(true);
            });
    }

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
                <div className="topMargin100">
                    <span className="firstItem">
                        <span>Select section</span>
                    </span>

                    <select className="selectStyle editing" value={activeSection} onChange={(event) => activeSectionCHangeHandler(event.target.value)}>
                        <option value="">Please select</option>

                        {Object.keys(dataSchema).map((sectionName: any, index: number) => {
                            return (
                                <option key={index} value={sectionName}>
                                    {sectionName}
                                </option>
                            );
                        })}
                    </select>

                    {activeSection !== "" && dataSource && dataSource.length > 0 &&
                        <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`simpleTable fullWidth ${!darkMode ? "lightMode" : "darkMode"}`}>
                            <thead>
                                <tr>
                                    {dataSchema[activeSection].map((columns: any, index: number) => {
                                        return (
                                            <React.Fragment key={index}>
                                                {Object.values(columns).map((columnName: any, index: number) => {
                                                    return (<th key={index}>{columnName}</th>);
                                                })}
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {dataSource.map((row: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            {dataSchema[activeSection].map((columns: any, columnIndex: number) => {
                                                return (
                                                    <React.Fragment key={columnIndex}>
                                                        {Object.keys(columns).map((cell: any, cellIndex: number) => {
                                                            return (
                                                                <td key={cellIndex}>
                                                                    {typeof row[cell] != "undefined" && row[cell] !== null ?
                                                                        String(row[cell]) : ""
                                                                    }
                                                                </td>
                                                            )
                                                        })}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }


                    {/*<span className="firstItem">
                        <span>Show WatchList {activeSection ? "Items" : ""}</span>
                    </span>

                    <span className="leftMargin" title="Show WatchList Items">
                        <label className="switch">
                            <input type="checkbox" checked={activeSection} onChange={(event) => setActiveSection(event.target.checked)} />
                            <span className="slider round"></span>
                        </label>
                    </span>
                    

                    {/*{!activeSection &&
                        <table style={{ borderWidth: "1px", borderStyle: "solid" }} className={`simpleTable fullWidth ${!darkMode ? "lightMode" : "darkMode"}`}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>WatchListItemID</th>

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
                        </table>
                    }*/}
                </div>
            }
        </>
    );
}

{/*Object.values(columns).map((columnName: any, index: number) => {
                                                        return (<td key={index}>{columnName}</td>);
                                                    })*/}

{/*{row.map((cell: any, cellIndex: number) => {
                                                <td key={cellIndex}>{JSON.stringify(cell)}</td>
                                            })}*/}
{/*{JSON.stringify(Object.values(dataSchema[activeSection]))}*/ }