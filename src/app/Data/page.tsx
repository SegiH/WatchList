"use client"

import React, { useContext, useEffect, useRef, useState } from "react";
import { APIStatus, DataContext } from "../context";
import { useRouter } from 'next/navigation';

import "../page.css";
import IBugLog from "../interfaces/IBugLog";
import IUser from "../interfaces/IUser";
import { DataContextType } from "../contexts/DataContextType";
import { FieldTypes, FieldValueTypes } from "../components/SegiTable/ISegiTable";
import SegiTable from "../components/SegiTable/SegiTable";
import IWatchListSource from "../interfaces/IWatchListSource";
import IWatchListType from "../interfaces/IWatchListType";

export default function Data() {
    const {
        bugLogs, darkMode, defaultRoute, demoMode, isAdmin, lastPage, setErrorMessage, setIsError, visibleSections, watchList, watchListSortingCheck, watchListItems, watchListItemsSortingCheck, watchListSources, watchListTypes,
    } = useContext(DataContext) as DataContextType;

    const [activeSection, setActiveSection] = useState("");
    const [currentDataPage, setCurrentDataPage] = useState(1);
    //const [dataSource, setDataSource] = useState<any>([]);
    const [filteredDataSource, setFilteredDataSource] = useState<any>([]);
    const [isReady, setIsReady] = useState(false);
    const [segiTableTemplate, setSegiTableTemplate] = useState<any>([]);
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

    const createSegiTableTemplate = (section: string) => {
        const fields: any = [];

        const dataSection = dataSchema[section];

        Object.keys(dataSection.Columns).forEach((column) => {
            const newFieldDef = {
                DisplayName: dataSection.Columns[column],
                DatabaseColumn: column,
                FieldType: FieldTypes.TEXTFIELD,
                FieldValueType: FieldValueTypes.TEXT,
                ColumnWidth: (100 / Object.keys(dataSection.Columns).length) + "%"
            };

            fields.push(newFieldDef);
        });

        const newTemplate = {
            Fields: fields,
        }

        return newTemplate;
    }


    const setTemplateDataSource = (template: {}, data: any[]) => {
        template["Data"] = data;

        setSegiTableTemplate(template)
    }

    const activeSectionChangeHandler = async (newActiveSection: string) => {
        setActiveSection(newActiveSection);
        setIsReady(false);

        const template = createSegiTableTemplate(newActiveSection);

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
                            setTemplateDataSource(template, getAllWatchListResult[1]);
                        }
                    } else {
                        setTemplateDataSource(template, watchList);
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
                            setTemplateDataSource(template, getAllWatchListItemsResult[1]);
                        }
                    } else {
                        setTemplateDataSource(template, watchListItems);
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

                            setTemplateDataSource(template, getBugLogsResult[1]);
                        } else {
                            alert(`An error occurred while getting the bug logs`);
                        }

                        break;
                    } else {
                        setTemplateDataSource(template, bugLogs);
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
                        setTemplateDataSource(template, getLogsResult[1]);
                    }
                    break;
                case "VisibleSections":
                    visibleSections.sort((a: any, b: any) => {
                        return b.value < a.value ? -1 : 1;
                    });

                    setTemplateDataSource(template, visibleSections);
                    break;
                case "WatchListSources":
                    watchListSources.sort((a: IWatchListSource, b: IWatchListSource) => {
                        return b.WatchListSourceID < a.WatchListSourceID ? -1 : 1;
                    });

                    setTemplateDataSource(template, watchListSources);
                    break;
                case "WatchListTypes":
                    watchListTypes.sort((a: IWatchListType, b: IWatchListType) => {
                        return b.WatchListTypeID < a.WatchListTypeID ? -1 : 1;
                    });

                    setTemplateDataSource(template, watchListTypes);
                    break;
                case "Users":
                    if (users.length > 0) {
                        setTemplateDataSource(template, users);
                        return;
                    }

                    const getUsersResponse = await fetch(`/api/GetUsers`, { credentials: 'include' });

                    const getUsersResult = await getUsersResponse.json();

                    if (getUsersResult[0] === "OK") {
                        setTemplateDataSource(template, getUsersResult[1]);
                        setUsers(getUsersResult[1]); // Save copy to avoid multiple calls to API
                    } else {
                        alert(getUsersResult[1])
                        setErrorMessage(getUsersResult[1]);
                        setIsError(true);
                    }
                    break;
                default:
                    setTemplateDataSource(template, []);
                    break;
            }
        } catch (e: any) {
            alert(e.message);
        }
    }

    /*const pageClickHandler = (adjustValue: number) => {
        setIsReady(false);

        if (typeof topRef !== "undefined" && topRef !== null && topRef.current !== null && topRef.current.scrollIntoView !== null) {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        setCurrentDataPage(currentDataPage + adjustValue);
    }*/

    const updateDataSourceFilteredResults = () => {
        const startIndex = (currentDataPage - 1) * dataSchema[activeSection].PageSize;
        const endIndex = startIndex + dataSchema[activeSection].PageSize;

        const newFilteredDataSource = segiTableTemplate.Data.slice(startIndex, endIndex);

        setFilteredDataSource(newFilteredDataSource);
    }

    useEffect(() => {
        if (typeof segiTableTemplate !== "undefined" && typeof segiTableTemplate.Data !== "undefined" && segiTableTemplate.Data.length > 0) {
            updateDataSourceFilteredResults();
        }
    }, [currentDataPage, segiTableTemplate.Data]);

    useEffect(() => {
        if (typeof filteredDataSource !== "undefined" && filteredDataSource.length > 0) {
            setIsReady(true);
        }
    }, [filteredDataSource])

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
                <span>
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
                        <span>
                            <br /><br /><br />
                            <SegiTable
                                darkMode={true}
                                defaultPageSize={5}
                                editable={false}
                                exportable={false}
                                //filterable={true}
                                pageSizeOverride={{ 0: "All", 5: "5", 10: "10", 25: "25", 50: "50" }}
                                paginationEnabled={true}
                                searchable={true}
                                sortable={true}
                                tableTemplate={segiTableTemplate}
                            />
                        </span>
                    }
                </span>
            </div>
        </span>
    );
}