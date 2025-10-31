import { Rating } from "@mui/material";
import IWatchList from "../interfaces/IWatchList";
import Image from "next/image";
import { WatchListCardContext } from "../data-context";
import { useContext, useState } from "react";
import { WatchListCardContextType } from "../interfaces/contexts/WatchListCardContextType";

type WatchListCardProps = {
    currentWatchList: IWatchList;
    setImdbJSON: (value: []) => void;
}

export default function WatchListCard({ currentWatchList, setImdbJSON }: WatchListCardProps) {
    const {
        BrokenImageIconComponent, darkMode, filteredWatchList, getMissingPoster, openDetailClickHandler, setFilteredWatchList
    } = useContext(WatchListCardContext) as WatchListCardContextType;

    const IMDB_JSON = currentWatchList?.IMDB_JSON !== null && typeof currentWatchList?.IMDB_JSON !== "undefined" && currentWatchList?.IMDB_JSON !== "" ? JSON.parse(currentWatchList?.IMDB_JSON) : null;

    const formatWatchListDates = (startDate: string, endDate: string) => {
        // Helper function to format a date string from "yyyy-mm-dd" to "mm/dd/yy"
        const formatDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split("-");
            const shortYear = year.slice(-2); // Get last 2 digits of the year
            return `${month}/${day}/${shortYear}`;
        }

        if (!startDate) return ""; // Optional: handle missing startDate gracefully

        const formattedStart = formatDate(startDate);

        if (!endDate) {
            return `${formattedStart}-`;
        }

        const formattedEnd = formatDate(endDate);
        return `${formattedStart}-${formattedEnd}`;
    }

    const IMDBCardOpenClickHandler = (IMDB_JSON) => {
        setImdbJSON(IMDB_JSON);
    }

    const showDefaultSrc = async (watchListID: number) => {
        const newFilteredWatchList: IWatchList[] = Object.assign([], filteredWatchList);

        const newWatchListResult: IWatchList[] = newFilteredWatchList?.filter((currentWatchList: IWatchList) => {
            return String(currentWatchList.WatchListID) === String(watchListID);
        });

        if (newWatchListResult.length === 0) {
            // this shouldn't ever happen!
            return;
        }

        const newWatchList = newWatchListResult[0];

        const result = await getMissingPoster(currentWatchList.WatchListItemID);

        if (typeof result !== "undefined" && result !== null && result[0]["Status"] === "OK") {
            newWatchList["IMDB_Poster"] = result[0]["IMDB_Poster"];
            newWatchList["IMDB_Poster_Error"] = false;
        } else {
            newWatchList["IMDB_Poster_Error"] = true;
        }

        setFilteredWatchList(newFilteredWatchList);
    };

    return (
        <>
            <li className="show-item">
                <span className="item-id">
                    <div>{currentWatchList?.WatchListID}</div>
                </span>

                <a className="clickable show-link" onClick={() => openDetailClickHandler(currentWatchList?.WatchListID, "WatchList")}>
                    <div>
                        {typeof currentWatchList?.IMDB_Poster !== "undefined" && currentWatchList?.IMDB_Poster !== null && currentWatchList?.IMDB_Poster !== "" && currentWatchList?.IMDB_Poster_Error !== true &&
                            <Image width="128" height="187" alt={currentWatchList?.WatchListItemName ?? ""} src={currentWatchList?.IMDB_Poster ?? currentWatchList?.IMDB_Poster ?? BrokenImageIconComponent} onError={() => showDefaultSrc(currentWatchList.WatchListID)} />
                        }

                        {currentWatchList?.IMDB_Poster_Error === true && <>{BrokenImageIconComponent}</>}
                    </div>
                </a>

                <div className="show-title">
                    {typeof currentWatchList?.IMDB_URL !== "undefined" &&
                        <a href={currentWatchList?.IMDB_URL} target='_blank'>{currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                    }

                    {typeof currentWatchList?.IMDB_URL === "undefined" &&
                        <span>
                            {currentWatchList?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                        </span>
                    }

                    {currentWatchList?.Archived === 1 ? <span>&nbsp;(A)</span> : <></>}
                </div>

                {currentWatchList?.WatchListTypeID === 2 ? (
                    <div className={`${!darkMode ? "lightMode" : "darkMode"} show-season`}>
                        <div>Season {currentWatchList?.Season}</div>
                    </div>
                ) : (
                    <div className="show-season">{/* Placeholder to align */}</div>
                )}

                {/*<div className={`${!darkMode ? "lightMode" : "darkMode"} show-date`}>
                {currentWatchList?.EndDate !== null && currentWatchList?.EndDate !== currentWatchList?.StartDate
                    ? <>{currentWatchList?.StartDate} <br />-<br /> {currentWatchList?.EndDate}</>
                    : currentWatchList?.StartDate}
            </div>*/}

                <div className={`${!darkMode ? "lightMode" : "darkMode"} show-date`}>
                    {formatWatchListDates(currentWatchList?.StartDate, currentWatchList?.EndDate)}
                </div>

                <div className={`${!darkMode ? "lightMode" : "darkMode"} show-type`}>
                    {currentWatchList?.WatchListTypeName}
                </div>

                <div className={`${!darkMode ? "lightMode" : "darkMode"} show-source`}>
                    {currentWatchList.WatchListSourceName}
                </div>

                <div>
                    <Rating
                        sx={{
                            padding: 1,
                            '& .MuiRating-iconEmpty': {
                                color: darkMode ? 'white' : 'black', // Change the empty star color. Important when dark mode is enabled
                            }
                        }}
                        disabled
                        value={typeof currentWatchList?.Rating !== "undefined" ? currentWatchList?.Rating : null}
                        precision={0.5}
                        defaultValue={0}
                        style={{ opacity: 1 }}
                    />
                </div>

                {IMDB_JSON !== null &&
                    <a className="clickable" onClick={() => IMDBCardOpenClickHandler(IMDB_JSON)}>IMDB Info</a>
                }
            </li>
        </>
    )
}