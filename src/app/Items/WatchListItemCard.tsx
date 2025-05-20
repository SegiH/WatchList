import IWatchListItem from "../interfaces/IWatchListItem";
import Image from "next/image";
import { DataContext, DataContextType } from "../data-context";
import { useContext } from "react";

type WatchListCardProps = {
    currentWatchListItem: IWatchListItem
}

export default function WatchListItemCard({ currentWatchListItem }: WatchListCardProps) {
    const {
        BrokenImageIconComponent,
        darkMode,
        filteredWatchListItems,
        openDetailClickHandler,
        setFilteredWatchListItems
    } = useContext(DataContext) as DataContextType;

    const showDefaultSrc = (watchListItemID: number): void => {
        const newFilteredWatchListItems: IWatchListItem[] = Object.assign([], filteredWatchListItems);

        const newWatchListItemsResult: IWatchListItem[] = newFilteredWatchListItems?.filter((currentWatchListItems: IWatchListItem) => {
            return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
        });

        if (newWatchListItemsResult.length === 0) {
            // this shouldn't ever happen!
            return;
        }

        const newWatchListItem = newWatchListItemsResult[0];

        if (newWatchListItem["IMDB_Poster_Error"] == true) {
            return;
        }

        newWatchListItem["IMDB_Poster_Error"] = true;

        setFilteredWatchListItems(newFilteredWatchListItems);
    };

    const IMDB_JSON = currentWatchListItem?.IMDB_JSON !== null && typeof currentWatchListItem?.IMDB_JSON !== "undefined" && currentWatchListItem?.IMDB_JSON !== "" ? JSON.parse(currentWatchListItem?.IMDB_JSON) : null;

    return (
        <li className="show-item">
            <span className="item-id" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID, "Items")}>
                <div>{currentWatchListItem?.WatchListItemID}</div>
            </span>

            <a className="show-link" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID, "Items")}>
                <div className="clickable image-crop">
                    {currentWatchListItem?.IMDB_Poster !== null && currentWatchListItem?.IMDB_Poster_Error !== true &&
                        <Image width="128" height="187" alt={currentWatchListItem?.WatchListItemName} src={currentWatchListItem?.IMDB_Poster} onError={() => showDefaultSrc(currentWatchListItem.WatchListItemID)} />
                    }

                    {(currentWatchListItem?.IMDB_Poster === null || currentWatchListItem?.IMDB_Poster_Error === true) && <>{BrokenImageIconComponent}</>}
                </div>
            </a>

            <div className="show-title">
                {typeof currentWatchListItem?.IMDB_URL !== "undefined" &&
                    <a className={`${!darkMode ? "lightMode" : "darkMode"}`} href={currentWatchListItem?.IMDB_URL} target='_blank'>{currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}</a>
                }

                {typeof currentWatchListItem?.IMDB_URL === "undefined" &&
                    <div className={`${!darkMode ? "lightMode" : "darkMode"} `}>
                        {currentWatchListItem?.WatchListItemName}{IMDB_JSON !== null && IMDB_JSON.Year !== null ? ` (${IMDB_JSON.Year})` : ""}
                    </div>
                }

                {currentWatchListItem?.Archived === 1 ? <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>&nbsp;(A)</span> : <></>}
            </div>

            <span className={`${!darkMode ? "lightMode" : "darkMode"}`}>
                <div>{currentWatchListItem?.WatchListTypeName}</div>
            </span>
        </li>
    )
}