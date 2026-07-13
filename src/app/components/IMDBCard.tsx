import React from "react"

interface IMDBCardProps {
    closeIMDBCard: () => void;
    IMDB_JSON: any;
}

const IMDBCard = ({ closeIMDBCard, IMDB_JSON }: IMDBCardProps) => {
    return (
        <>
            <span className="modal IMDBCardModal">
                <div className={`modal-content scrollable overflowX overflowY imdbCard textLabel`}>
                    <span>IMDB Card</span>

                    <span className="clickable IMDBCloseButton" onClick={closeIMDBCard}>
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
            </span>
        </>
    )
}

export default IMDBCard