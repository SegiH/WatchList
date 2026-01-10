import React from "react"

interface IMDBCardProps {
    closeIMDBCard: () => void;
    darkMode: boolean;
    IMDB_JSON: any;
}

const IMDBCard = ({ darkMode, closeIMDBCard, IMDB_JSON }: IMDBCardProps) => {
    return (
        <>
            <div className="modal">
                <div className={`modal-content scrollable overflowX overflowY imdbCard textLabel ${!darkMode ? " lightMode" : " darkMode"}`} style={{ overflowY: "auto" }}>
                    <div>IMDB Card</div>

                    <span className="clickable closeButton closeButtonAdjustment" onClick={closeIMDBCard}>
                        X
                    </span>

                    <br /><br />

                    {Object.keys(IMDB_JSON).map((key: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                {key}: {JSON.stringify(IMDB_JSON[key])}
                                <br />
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default IMDBCard