export default interface WatchList {
     WatchListID: number,
     UserID: number,
     WatchListItemID: number,
     StartDate: string,
     EndDate: string,
     WatchListSourceID: number,
     Season: number
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
     IsModified?: boolean, // Virtual field
     WatchListItemIDIsModified?: boolean, // Virtual field
     WatchListSourceIDIsModified?: boolean, // Virtual field
     StartDateIsModified?: boolean, // Virtual field
     EndDateIsModified?: boolean, // Virtual field
     SeasonIsModified?: boolean, // Virtual field
     ArchivedIsModified?: boolean, // Virtual field
     RatingIsModified?: boolean, // Virtual field
     NotesIsModified?: boolean, // Virtual field
     Tooltip?: string, // Virtual field
}