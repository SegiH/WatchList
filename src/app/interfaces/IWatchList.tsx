export default interface WatchList {
     WatchListID: number,
     UserID: number,
     WatchListItemID: number,
     StartDate: string,
     EndDate: string,
     WatchListSourceID: number,
     Season: number,
     Archived: number,
     Notes: string,
     Rating: number,
     WatchListItemName: string, // WLI is joined with WL in the SQL when getting WL
     WatchListTypeID?: number, // WL Types is joined with WL in the SQL when getting WL
     WatchListTypeName: string, // WL Types is joined with WL in the SQL when getting WL
     WatchListSourceName?: string, // WL sources is joined with WL in the SQL when getting WL
     IMDB_JSON?: string // WLI is joined with WL in the SQL when getting WL,
     IMDB_Poster: string // WLI is joined with WL in the SQL when getting WL,
     IMDB_Poster_Error?: boolean, // WLI is joined with WL in the SQL when getting WL,
     IMDB_URL?: string, // WLI is joined with WL in the SQL when getting WL,
     IsModified?: number, // Virtual field
     WatchListItemIDIsModified?: number, // Virtual field
     WatchListSourceIDIsModified?: number, // Virtual field
     StartDateIsModified?: number, // Virtual field
     EndDateIsModified?: number, // Virtual field
     SeasonIsModified?: number, // Virtual field
     ArchivedIsModified?: number, // Virtual field
     RatingIsModified?: number, // Virtual field
     NotesIsModified?: number, // Virtual field
     Tooltip?: string, // Virtual field
}