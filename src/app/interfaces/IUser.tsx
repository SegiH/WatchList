export interface IUserOption {
     OptionID: number,
     UserID: number,
     ArchivedVisible: number,
     AutoAdd: number,
     DarkMode: number,
     HideTabs: number,
     SearchCount: number,
     StillWatching: number,
     ShowMissingArtwork: number,
     SourceFilter: number,
     TypeFilter: number,
     WatchListSortColumn: string,
     WatchListSortDirection: string,
     VisibleSections: string
}

export default interface IUser {
     UserID: number,
     Username: string,
     Realname: string,
     Password: string,
     Admin: boolean,
     Enabled: boolean,
     IsModified?: boolean,
     Options: IUserOption[],
     Token: string,
     TokenExpiration: string
}