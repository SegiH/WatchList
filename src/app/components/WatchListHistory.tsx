import IWatchList from "../interfaces/IWatchList";

interface WatchListHistoryProps {
    formatWatchListDates: (startDate: string, endDate: string) => string;
    name?: string;
    setWatchListHistoryVisible: (value: boolean) => void;
    watchListHistory: IWatchList[];
}

export default function WatchListHistory({ formatWatchListDates, name, setWatchListHistoryVisible, watchListHistory }: WatchListHistoryProps) {
    const closeWatchListHistory = async () => {
        setWatchListHistoryVisible(false);
    }

    return (
        <div className={`modal zIndex`}>
            <div className={`modal-content`}>
                <span className="clickable closeButton" onClick={closeWatchListHistory}>
                    X
                </span>

                {name} History
                <br></br>

                {watchListHistory.map((watchList: IWatchList) => {
                    return (
                        <ul key={watchList.WatchListID}>
                            <li>
                                {watchList.WatchListTypeID == 2 &&
                                    <>
                                        Season {watchList.Season}
                                    </>
                                }

                                {" "}watched {formatWatchListDates(watchList.StartDate, watchList.EndDate)}
                            </li>
                        </ul>
                    )
                })}
            </div>
        </div >
    )
}