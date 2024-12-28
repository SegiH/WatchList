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
     IsModified?: boolean, // Virtual field
     WatchListItemNameIsModified?: boolean, // Virtual field
     WatchListTypeIDIsModified?: boolean, // Virtual field
     IMDB_URLIsModified?: boolean, // Virtual field
     IMDB_PosterIsModified?: boolean, // Virtual field
     ItemNotesIsModified?: boolean, // Virtual field
     ArchivedIsModified?: boolean, // Virtual field
     Tooltip?: string, // Virtual field
}