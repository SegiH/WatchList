interface IWatchList {
    WatchListID: number;
	UserID: number;
	WatchListItemID: number;
	StartDate: Date;
	EndDate: Date;
	WatchListSourceID: number;
	Season: number;
	Notes: string;
}

export default IWatchList;
