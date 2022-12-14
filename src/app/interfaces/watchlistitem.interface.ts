interface IWatchListItem {
    WatchListItemID: number;
    WatchListItemName: string;
	WatchListTypeID: number;
    IMDB_URL: string;
    IMDB_Poster: string;
	ItemNotes: string;
    Previous: IWatchListItem;
}

export default IWatchListItem;
