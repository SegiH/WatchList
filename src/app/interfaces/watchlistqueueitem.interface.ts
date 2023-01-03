interface IWatchListQueueItem {
    WatchListQueueItemID: number;
	UserID: number;
	WatchListItemID: number;
	WatchListItemName: string;
	WatchListTypeID: number;
	IMDB_Poster: string;
	Notes: string;
	Previous: IWatchListQueueItem;
}

export default IWatchListQueueItem;
