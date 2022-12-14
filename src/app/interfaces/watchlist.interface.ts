interface IWatchList {
    WatchListID: number;
	UserID: number;
	WatchListItemID: number;
	StartDate: Date;
	EndDate: Date;
	WatchListSourceID: number;
	Season: number;
	Rating: number;
	IMDB_Poster : string;
	Notes: string;
}

export default IWatchList;
