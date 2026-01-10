"use client"

import React, { useContext, useEffect, useRef, useState } from "react";
import { APIStatus, DataContext } from "../context";
import { useRouter } from 'next/navigation';

import "../page.css";
import IBugLog from "../interfaces/IBugLog";
import IUser from "../interfaces/IUser";
import { DataContextType } from "../contexts/DataContextType";

export default function Data() {
    const {
        bugLogs, darkMode, defaultRoute, demoMode, isAdmin, lastPage, setErrorMessage, setIsError, visibleSections, watchList, watchListSortingCheck, watchListItems, watchListItemsSortingCheck, watchListSources, watchListTypes,
    } = useContext(DataContext) as DataContextType;

    const [activeSection, setActiveSection] = useState("");
    const [currentDataPage, setCurrentDataPage] = useState(1);
    const [dataSource, setDataSource] = useState<any>([]);
    const [filteredDataSource, setFilteredDataSource] = useState<any>([]);
    const [isReady, setIsReady] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);

    const router = useRouter();
    const topRef = useRef<HTMLDivElement | null>(null);

    const dataSchema = {
        WatchList: {
            Columns: {
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
            },
            PageSize: 10
        },
        Items: {
            Columns: {
                "WatchListItemID": "ID",
                "WatchListItemName": "Name",
                "WatchListTypeName": "Type",
                "IMDB_URL": "URL",
                "IMDB_Poster": "Image",
                "ItemNotes": "Notes",
                "Archived": "Archived",
                "Enabled": "Enabled",
                "IMDB_JSON": "JSON" // Always put this last since its big
            },
            PageSize: 8
        },
        BugLogs: {
            Columns: {
                "BugLogId": "ID",
                "BugName": "Name",
                "AddDate": "Added On",
                "CompletedDate": "Completed On",
                "ResolutionNotes": "Resolution Notes"
            },
            PageSize: 8
        },
        Logs: {
            Columns: {
                "Date": "Date",
                "Message": "Message"
            },
            PageSize: 8
        },
        Users: {
            Columns: {
                "UserID": "ID",
                "Username": "Username",
                "Realname": "Realname",
                "Admin": "Admin",
                "Enabled": "Enabled"
            },
            PageSize: 8
        },
        VisibleSections: {
            Columns: {
                "value": "value",
                "label": "label"
            },
            PageSize: 8
        },
        WatchListSources: {
            Columns: {
                "WatchListSourceID": "ID",
                "WatchListSourceName": "Name",
                "Enabled": "Enabled"
            },
            PageSize: 8
        },
        WatchListTypes: {
            Columns: {
                "WatchListTypeID": "ID",
                "WatchListTypeName": "Name",
            },
            PageSize: 8
        }
    }

    const activeSectionChangeHandler = async (newActiveSection: string) => {
        setActiveSection(newActiveSection);
        setIsReady(false);

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
        } catch (e: any) {
            alert(e.message);
        }
    }

    const pageClickHandler = (adjustValue: number) => {
        setIsReady(false);

        if (typeof topRef !== "undefined" && topRef !== null && topRef.current !== null && topRef.current.scrollIntoView !== null) {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        setCurrentDataPage(currentDataPage + adjustValue);
    }

    const updateDataSourceFilteredResults = () => {
        const startIndex = (currentDataPage - 1) * dataSchema[activeSection].PageSize;
        const endIndex = startIndex + dataSchema[activeSection].PageSize;

        const newFilteredDataSource = dataSource.slice(startIndex, endIndex);

        setFilteredDataSource(newFilteredDataSource);
    }

    useEffect(() => {
        if (dataSource.length > 0) {
            updateDataSourceFilteredResults();
            setIsReady(true);
        }
    }, [currentDataPage, dataSource]);

    useEffect(() => {
        // Make sure current user is an admin
        if (!isAdmin() && !demoMode) {
            router.push(defaultRoute);
        }
    }, []);

    return (
        <span className="topMarginContent">
            <div ref={topRef} ></div>

            <div>
                <span style={{ display: "flex" }}>
                    <span className="firstItem">
                        <span>Select section</span>
                    </span>

                    <select className="leftMargin selectStyle editing" value={activeSection} onChange={(event) => activeSectionChangeHandler(event.target.value)}>
                        <option value="">Please select</option>

                        {Object.keys(dataSchema).map((sectionName: any, index: number) => {
                            return (
                                <option key={index} value={sectionName}>
                                    {sectionName}
                                </option>
                            );
                        })}
                    </select>

                    {activeSection !== "" && isReady &&
                        <span style={{ display: "flex", marginLeft: "10px" }}>
                            {currentDataPage > 1 &&
                                <div style={{ fontSize: "30px" }} className={`arrow left`} onClick={() => pageClickHandler(-1)}>&#8592;</div>
                            }

                            {!lastPage &&
                                <div style={{ fontSize: "30px", marginLeft: "25px" }} className={`arrow right`} onClick={() => pageClickHandler(1)}>&#8594;</div>
                            }
                        </span>
                    }
                </span>

                {activeSection !== "" && isReady &&
                    <div className="simpleTableContainer">
                        <table className={`simpleTable fullWidth ${!darkMode ? "lightMode" : "darkMode"}`}>
                            <thead>
                                <tr>
                                    {Object.entries(dataSchema[activeSection]["Columns"]).map((columns: any, index: number) => {
                                        return (
                                            <th key={index}>{columns[1]}</th>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDataSource.map((row: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            {Object.entries(dataSchema[activeSection]["Columns"]).map((columns: any, columnIndex: number) => {
                                                return (
                                                    <td key={columnIndex}>
                                                        {typeof row[columns[0]] != "undefined" && row[columns[0]] !== null ?
                                                            String(row[columns[0]]) : "FUBAR"
                                                        }
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </span>
    );
}