import IWatchList from "../interfaces/IWatchList";

export default function WatchListHistory(props) {
    const closeWatchListHistory = async () => {
        props.setWatchListHistoryVisible(false);
    }

    return (
        <div className={`modal zIndex ${!props.darkMode ? " lightMode" : " darkMode"}`}>
            <div className={`modal-content`}>
                <span className="clickable closeButton" onClick={closeWatchListHistory}>
                    X
                </span>

                {props.name} History
                <br></br>

                {props.watchListHistory.map((watchList: IWatchList) => {
                    return (
                        <ul key={watchList.WatchListID} className={`${!props.darkMode ? " lightMode" : " darkMode"}`}>
                            <li>
                                {watchList.WatchListTypeID == 2 &&
                                    <>
                                        Season {watchList.Season}
                                    </>
                                }

                                {" "}watched {props.formatWatchListDates(watchList.StartDate, watchList.EndDate)}
                            </li>
                        </ul>
                    )
                })}
            </div>
        </div >
    )
}