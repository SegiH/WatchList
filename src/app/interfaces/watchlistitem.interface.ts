interface IWatchListItem {
    WatchListItemID: number;
    WatchListItemName: string;
	WatchListTypeID: number;
    IMDB_URL: string;
	ItemNotes: string;
    Previous: IWatchListItem;
}

export default IWatchListItem;
