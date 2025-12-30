"use client"

import React, { useContext, useEffect, useState } from "react";
import { APIStatus, DataContext } from "../data-context";
import { useRouter } from 'next/navigation';

import "../page.css";
import IBugLog from "../interfaces/IBugLog";
import IUser from "../interfaces/IUser";
import { DataContextType } from "../interfaces/contexts/DataContextType";

export default function Data() {
    const {
        bugLogs, darkMode, defaultRoute, demoMode, isAdmin, setIsError, setErrorMessage, visibleSections, watchList, watchListSortingCheck, watchListItems, watchListItemsSortingCheck, watchListSources, watchListTypes,
    } = useContext(DataContext) as DataContextType;

    const [activeSection, setActiveSection] = useState("");
    const [dataSource, setDataSource] = useState<any>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);

    const router = useRouter();

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
        Logs: [{
            "Date": "Date",
            "Message": "Message"
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

        try {
            switch (newActiveSection) {
                case "WatchList":
                    if (watchList.length === 0 || watchListSortingCheck !== APIStatus.Success) {
                        const getAllWatchListResponse = await fetch(`/api/GetWatchList?AllData=true`, { credentials: 'include' });

                        const getAllWatchListResult = await getAllWatchListResponse.json();

                        if (getAllWatchListResult[0] !== "OK") {
                            setErrorMessage("Failed to get WatchList with the error " + getAllWatchListResult[1]);
                            setIsError(true);
                            return;
                        } else {
                            setDataSource(getAllWatchListResult[1]);
                        }
                    } else {
                        setDataSource(watchList);
                    }

                    break;
                case "Items":
                    if (watchListItems.length == 0 || watchListItemsSortingCheck !== APIStatus.Success) {
                        const getAllWatchListItemsResponse = await fetch(`/api/GetWatchListItems?AllData=true`, { credentials: 'include' });

                        const getAllWatchListItemsResult = await getAllWatchListItemsResponse.json();

                        if (getAllWatchListItemsResult[0] !== "OK") {
                            setErrorMessage("Failed to get WatchList Items with the error " + getAllWatchListItemsResult[1]);
                            setIsError(true);
                            return;
                        } else {
                            setDataSource(getAllWatchListItemsResult[1]);
                        }
                    } else {
                        setDataSource(watchListItems);
                    }
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
                case "Logs":
                    const getLogsResponse = await fetch(`/api/GetLogs`, { credentials: 'include' });

                    const getLogsResult = await getLogsResponse.json();

                    if (getLogsResult[0] !== "OK") {
                        setErrorMessage("Failed to get logs with the error " + getLogsResult[1]);
                        setIsError(true);
                        return;
                    } else {
                        setDataSource(getLogsResult[1]);
                    }
                    break;
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

                    const getUsersResponse = await fetch(`/api/GetUsers`, { credentials: 'include' });

                    const getUsersResult = await getUsersResponse.json();

                    if (getUsersResult[0] === "OK") {
                        setDataSource(getUsersResult[1]);
                        setUsers(getUsersResult[1]); // Save copy to avoid multiple calls to API
                    } else {
                        alert(getUsersResult[1])
                        setErrorMessage(getUsersResult[1]);
                        setIsError(true);
                    }
                    break;
                default:
                    setDataSource([]);
                    break;
            }
        } catch (e) {
            alert(e.message);
        }
    }

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

                setDataSource(getBugLogsResult[1]);
            } else {
                alert(`An error occurred while getting the bug logs`);
            }
        } catch (e) {
            alert(e.message);
        }
    }

    useEffect(() => {
        // Make sure current user is an admin
        if (!isAdmin() && !demoMode) {
            router.push(defaultRoute)
        }

        setIsMounted(true);
    }, [defaultRoute, isAdmin, router, setIsMounted]);

    return (
        <span className="topMarginContent">
            {isMounted &&
                <div className="topMargin100">
                    <span className="firstItem">
                        <span>Select section</span>
                    </span>

                    <select className="leftMargin selectStyle editing" value={activeSection} onChange={(event) => activeSectionCHangeHandler(event.target.value)}>
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
        </span>
    );
}

{/*Object.values(columns).map((columnName: any, index: number) => {
                                                        return (<td key={index}>{columnName}</td>);
                                                    })*/}

{/*{row.map((cell: any, cellIndex: number) => {
                                                <td key={cellIndex}>{JSON.stringify(cell)}</td>
                                            })}*/}
{/*{JSON.stringify(Object.values(dataSchema[activeSection]))}*/ }