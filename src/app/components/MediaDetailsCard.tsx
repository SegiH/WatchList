import React from "react"
import IWatchListItem from "../interfaces/IWatchListItem";

interface MediaDetailsCardProps {
    closeMediaDetails: () => void;
    watchListItem: IWatchListItem;
}

const MediaDetailsCard = ({ closeMediaDetails, watchListItem }: MediaDetailsCardProps) => {
    const fields = [
        {
            displayName: "Rated",
            fieldName: "Rated"
        },
        {
            displayName: "Year",
            fieldName: "Year"
        },
        {
            displayName: "Rating",
            fieldName: "Rating"
        },
        {
            displayName: "Genre",
            fieldName: "Genre"
        },
        {
            displayName: "Runtime",
            fieldName: "Runtime"
        },
        {
            displayName: "Release Date",
            fieldName: "Released"
        },
        {
            displayName: "Director",
            fieldName: "Director"
        },
        {
            displayName: "Plot",
            fieldName: "Plot"
        },
        {
            displayName: "Actors",
            fieldName: "Actors"
        },
        {
            displayName: "Writer",
            fieldName: "Writer"
        },
        {
            displayName: "Plot",
            fieldName: "Plot"
        },
        {
            displayName: "Language",
            fieldName: "Language"
        },
        {
            displayName: "Country",
            fieldName: "Country"
        },
        {
            displayName: "Box Office",
            fieldName: "Box Office"
        },
        {
            displayName: "Other Ratings",
            fieldName: "Ratings"
        },
    ];

    return (
        <>
            <span className="modal mediaDetailsCardModal">
                <div className={`modal-content scrollable overflowX overflowY textLabel`}>
                    <span>Media Details</span>

                    <span className="clickable TMDBCloseButton" onClick={closeMediaDetails}>
                        X
                    </span>

                    <br /><br />

                    {Object.keys(fields).map((key: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                {fields[key].displayName}: {watchListItem && watchListItem[fields[key].fieldName]}
                                <br />
                            </React.Fragment>
                        )
                    })}
                </div>
            </span>
        </>
    )
}

export default MediaDetailsCard