import { Rating } from "@mui/material";
import IWatchList from "../interfaces/IWatchList";
import Image from "next/image";
import { WatchListCardContext } from "../context";
import { useContext } from "react";
import { WatchListCardContextType } from "../contexts/WatchListCardContextType";

type WatchListCardProps = {
    currentWatchList: IWatchList;
    setImdbJSON: (value: []) => void;
}

export default function WatchListCard({ currentWatchList, setImdbJSON }: WatchListCardProps) {
    const {
        BrokenImageIconComponent, darkMode, filteredWatchList, formatWatchListDates, getMissingPoster, openDetailClickHandler, setFilteredWatchList, writeLog
    } = useContext(WatchListCardContext) as WatchListCardContextType;

    let IMDB_JSON :any = null;

    if (currentWatchList?.IMDB_JSON) {
        try {
            IMDB_JSON = JSON.parse(currentWatchList.IMDB_JSON);
        } catch (e: any) {
            writeLog(`An error occurred parsing the IMDB_JSON for ${currentWatchList.WatchListID}`);
        }
    }

    const IMDBCardOpenClickHandler = (IMDB_JSON) => {
        setImdbJSON(IMDB_JSON);
    }

    const showDefaultSrc = async (watchListID: number) => {
        const newFilteredWatchList: IWatchList[] = filteredWatchList.map(item => ({ ...item}));

        const newWatchListResult: IWatchList[] = newFilteredWatchList?.filter((currentWatchList: IWatchList) => {
            return String(currentWatchList.WatchListID) === String(watchListID);
        });

        if (newWatchListResult.length === 0) {
            // this shouldn't ever happen!
            return;
        }

        const newWatchList = newWatchListResult[0];

        // Retry
        if (typeof newWatchList["IMDB_Poster_RetryCount"] === "undefined") {
            newWatchList["IMDB_Poster_RetryCount"] = 0;
        } else {
            newWatchList["IMDB_Poster_RetryCount"]++;
        }

        if (newWatchList["IMDB_Poster_RetryCount"] === 5) {
            return;
        }

        /*const result = await getMissingPoster(currentWatchList.WatchListItemID);

        if (Array.isArray(result) && result.length > 0 && result[0]["Status"] === "OK") {
            newWatchList["IMDB_Poster"] = result[0]["IMDB_Poster"];
            newWatchList["IMDB_Poster_Error"] = false;
        } else {
            newWatchList["IMDB_Poster_Error"] = true;
        }

        setFilteredWatchList(newFilteredWatchList);*/
    };

    const imageIsValid = (currentWatchList: IWatchList) => {
        if (typeof currentWatchList?.IMDB_Poster !== "undefined" && currentWatchList?.IMDB_Poster !== null && currentWatchList?.IMDB_Poster !== "" && currentWatchList?.IMDB_Poster !== "N/A" && currentWatchList?.IMDB_Poster_Error !== true) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            <li className="show-item">
                <span className="item-id">
                    <div>{currentWatchList.WatchListID}</div>
                </span>

                <a className="clickable show-link" onClick={() => openDetailClickHandler(currentWatchList.WatchListID, "WatchList")}>
                    <div>
                        {imageIsValid(currentWatchList) &&
                            <Image width="128" height="187" alt={currentWatchList.WatchListItemName ?? ""} src={currentWatchList?.IMDB_Poster} onError={() => showDefaultSrc(currentWatchList.WatchListID)} />
                        }

                        {!imageIsValid(currentWatchList) && <>{BrokenImageIconComponent}</>}
                    </div>
                </a>

                <div className="show-title">
                    {typeof currentWatchList?.IMDB_URL !== "undefined" &&
                        <a href={currentWatchList?.IMDB_URL} target='_blank'>{currentWatchList.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                    }

                    {typeof currentWatchList?.IMDB_URL === "undefined" &&
                        <span>
                            {currentWatchList.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                        </span>
                    }

                    {currentWatchList?.Archived === 1 ? <span>&nbsp;(A)</span> : <></>}
                </div>

                {currentWatchList.WatchListTypeID === 2 ? (
                    <div className={`show-season`}>
                        <div>Season {currentWatchList?.Season}</div>
                    </div>
                ) : (
                    <div className="show-season"></div>
                )}

                <div className={`show-date`}>
                    {formatWatchListDates(currentWatchList?.StartDate, currentWatchList?.EndDate)}
                </div>

                <div className={`show-type`}>
                    {currentWatchList.WatchListTypeName}
                </div>

                <div className={`show-source`}>
                    {currentWatchList.WatchListSourceName}
                </div>

                <div>
                    <Rating
                        sx={{
                            padding: 1,
                            '& .MuiRating-iconEmpty': {
                                color: darkMode ? 'black' : 'white', // Change the empty star color. Important when dark mode is enabled
                            }
                        }}
                        disabled
                        value={typeof currentWatchList?.Rating !== "undefined" ? currentWatchList?.Rating : null}
                        precision={0.5}
                        defaultValue={0}
                        className="opacity-full"
                    />
                </div>

                {IMDB_JSON !== null &&
                    <a className="clickable" onClick={() => IMDBCardOpenClickHandler(IMDB_JSON)}>IMDB Info</a>
                }
            </li>
        </>
    )
}