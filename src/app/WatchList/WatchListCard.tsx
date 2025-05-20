import { Rating } from "@mui/material";
import IWatchList from "../interfaces/IWatchList";
import Image from "next/image";
import { DataContext, DataContextType } from "../data-context";
import { useContext } from "react";

type WatchListCardProps = {
    currentWatchList: IWatchList
}

export default function WatchListCard({ currentWatchList }: WatchListCardProps) {
    const {
        BrokenImageIconComponent,
        darkMode,
        filteredWatchList,
        openDetailClickHandler,
        setFilteredWatchList
    } = useContext(DataContext) as DataContextType;

    const IMDB_JSON = currentWatchList?.IMDB_JSON !== null && typeof currentWatchList?.IMDB_JSON !== "undefined" && currentWatchList?.IMDB_JSON !== "" ? JSON.parse(currentWatchList?.IMDB_JSON) : null;

    const showDefaultSrc = (watchListID: number): void => {
        const newFilteredWatchList: IWatchList[] = Object.assign([], filteredWatchList);

        const newWatchListResult: IWatchList[] = newFilteredWatchList?.filter((currentWatchList: IWatchList) => {
            return String(currentWatchList.WatchListID) === String(watchListID);
        });

        if (newWatchListResult.length === 0) {
            // this shouldn't ever happen!
            return;
        }

        const newWatchList = newWatchListResult[0];

        if (newWatchList["IMDB_Poster_Error"] == true) {
            return;
        }

        newWatchList["IMDB_Poster_Error"] = true;

        setFilteredWatchList(newFilteredWatchList);
    };

    return (
        <li className="show-item">
            <span className="item-id">
                <div>{currentWatchList?.WatchListID}</div>
            </span>

            <a className="clickable image-crop show-link" onClick={() => openDetailClickHandler(currentWatchList?.WatchListID, "WatchList")}>
                <div>
                    {typeof currentWatchList?.IMDB_Poster !== "undefined" && currentWatchList?.IMDB_Poster !== null && currentWatchList?.IMDB_Poster !== "" && currentWatchList?.IMDB_Poster_Error !== true && <Image width="128" height="187" alt={currentWatchList?.WatchListItemName ?? ""} src={currentWatchList?.IMDB_Poster ?? ""} onError={() => showDefaultSrc(currentWatchList.WatchListID)} />}

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

            <div className={`${!darkMode ? "lightMode" : "darkMode"} show-date`}>
                {currentWatchList?.EndDate !== null && currentWatchList?.EndDate !== currentWatchList?.StartDate
                    ? <>{currentWatchList?.StartDate} <br />-<br /> {currentWatchList?.EndDate}</>
                    : currentWatchList?.StartDate}
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
        </li>
    )
}