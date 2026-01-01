import IWatchList from "./IWatchList";

export default interface WatchListItem {
     WatchListItemID: number,
     WatchListItemName: string,
     WatchListTypeID: number,
     IMDB_URL: string,
     IMDB_Poster: string,
     IMDB_Poster_Error?: boolean,
     WatchListTypeName?: string, // Type are joined with WLI when selecing WLI
     IMDB_JSON?: string,
     ItemNotes: string,
     Archived: number,
     IsModified?: number, // Virtual field
     WatchListItemNameIsModified?: number, // Virtual field
     WatchListTypeIDIsModified?: number, // Virtual field
     IMDB_URLIsModified?: number, // Virtual field
     IMDB_PosterIsModified?: number, // Virtual field
     ItemNotesIsModified?: number, // Virtual field
     ArchivedIsModified?: number, // Virtual field
     Tooltip?: string, // Virtual field
     WatchListCount?: number // Virtual field
     WatchListHistory: IWatchList[];
}