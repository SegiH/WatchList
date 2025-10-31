import React from "react"

const IMDBCard = (props) => {
    return (
        <>
            <div className="modal">
                <div className={`modal-content scrollable overflowX overflowY imdbCard textLabel ${!props.darkMode ? " lightMode" : " darkMode"}`} style={{ overflowY: "auto" }}>
                    <div>IMDB Card</div>

                    <span className="clickable closeButton closeButtonAdjustment" onClick={props.closeIMDBCard}>
                        X
                    </span>

                    <br /><br />

                    {Object.keys(props.IMDB_JSON).map((key: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                {key}: {JSON.stringify(props.IMDB_JSON[key])}
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