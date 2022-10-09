interface IWatchListQueueItem {
    WatchListQueueItemID: number;
	UserID: number;
	WatchListItemID: number;
	Notes: string;
	Previous: IWatchListQueueItem;
}

export default IWatchListQueueItem;
