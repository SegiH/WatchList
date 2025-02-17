export default interface IUserOption {
    OptionID?: number,
    UserID?: number,
    ArchivedVisible: number,
    AutoAdd: number,
    DarkMode: number,
    HideTabs: number,
    SearchCount?: number,
    ShowMissingArtwork: number,
    SourceFilter?: number,
    StillWatching?: number,
    TypeFilter?: number,
    WatchListSortColumn?: string,
    WatchListSortDirection?: string,
    VisibleSections?: string
}