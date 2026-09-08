import IWatchListItem from "../interfaces/IWatchListItem";
import Image from "next/image";
import { ItemsCardContext } from "../context";
import { useContext } from "react";
import { ItemsCardContextType } from "../contexts/ItemsCardContextType";

type WatchListCardProps = {
    currentWatchListItem: IWatchListItem;
    setMediaDetailItem: (value: IWatchListItem) => void;
}

export default function ItemCard({ currentWatchListItem, setMediaDetailItem }: WatchListCardProps) {
    const {
        filteredWatchListItems, getMissingPoster, imageHeight, imageIsValid, imageWidth, openDetailClickHandler, setFilteredWatchListItems
    } = useContext(ItemsCardContext) as ItemsCardContextType;

    const mediaDetailsOpenClickHandler = (currentWatchListItem: IWatchListItem) => {
        setMediaDetailItem(currentWatchListItem);
    }

    const showDefaultSrc = async (watchListItemID: number) => {
        const newFilteredWatchListItems: IWatchListItem[] = filteredWatchListItems.map(item => ({ ...item }));

        const newWatchListItemsResult: IWatchListItem[] = newFilteredWatchListItems?.filter((currentWatchListItems: IWatchListItem) => {
            return String(currentWatchListItems.WatchListItemID) === String(watchListItemID);
        });

        if (newWatchListItemsResult.length === 0) {
            // this shouldn't ever happen!
            return;
        }

        const newWatchListItem = newWatchListItemsResult[0];

        // Retry
        if (typeof newWatchListItem["IMDB_Poster_RetryCount"] === "undefined") {
            newWatchListItem["IMDB_Poster_RetryCount"] = 0;
        }
        if (newWatchListItem["IMDB_Poster_RetryCount"] === 3) {
            newWatchListItem["IMDB_Poster_Error"] = true;
        } else {
            newWatchListItem["IMDB_Poster_RetryCount"]++;
            const result = await getMissingPoster(currentWatchListItem.WatchListItemID);

            if (Array.isArray(result) && result.length > 0 && result[0]["Status"] === "OK") {
                newWatchListItem["IMDB_Poster"] = result[0]["IMDB_Poster"];
                newWatchListItem["IMDB_Poster_Error"] = false;
            } else {
                newWatchListItem["IMDB_Poster_Error"] = true;
            }
        }

        setFilteredWatchListItems(newFilteredWatchListItems);
    };

    return (
        <>
            <li className="show-item">
                <span className="item-id" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID, "Items")}>
                    <div>{currentWatchListItem?.WatchListItemID}</div>
                </span>

                <a className="show-link" onClick={() => openDetailClickHandler(currentWatchListItem?.WatchListItemID, "Items")}>
                    <div className="clickable">
                        {imageIsValid(currentWatchListItem?.IMDB_Poster, currentWatchListItem?.IMDB_Poster_Error) &&
                            <Image width={imageWidth} height={imageHeight} alt={currentWatchListItem?.WatchListItemName ?? "Unknown"} src={currentWatchListItem.IMDB_Poster} onError={() => showDefaultSrc(currentWatchListItem.WatchListItemID)} />
                        }

                        {/* Empty placeholder */}
                        {!imageIsValid(currentWatchListItem?.IMDB_Poster, currentWatchListItem?.IMDB_Poster_Error) &&
                            <div
                                className="madeup"
                                style={{
                                    width: `${imageWidth}px`,
                                    height: `${imageHeight}px`,
                                }}
                            />
                        }

                        {/*{!imageIsValid(currentWatchListItem?.IMDB_Poster, currentWatchListItem?.IMDB_Poster_Error) &&
                            <div className="imagePlaceholder">{BrokenImageIconComponent}</div>
                        }*/}
                    </div>
                </a>

                <div className="show-title">
                    {typeof currentWatchListItem?.IMDB_URL !== "undefined" &&
                        <a href={currentWatchListItem?.IMDB_URL} target='_blank'>{currentWatchListItem?.WatchListItemName}{currentWatchListItem?.Year}</a>
                    }

                    {typeof currentWatchListItem?.IMDB_URL === "undefined" &&
                        <div>
                            {currentWatchListItem?.WatchListItemName}{currentWatchListItem?.Year}
                        </div>
                    }

                    {currentWatchListItem?.Archived === 1 ? <span>&nbsp;(A)</span> : <></>}
                </div>

                <span>
                    <div>{currentWatchListItem?.WatchListTypeName}</div>
                </span>

                    <a className="clickable fontStyle" onClick={() => mediaDetailsOpenClickHandler(currentWatchListItem)}>Media details</a>

                Watched {currentWatchListItem?.WatchListCount} time(s)
            </li>
        </>
    )
}