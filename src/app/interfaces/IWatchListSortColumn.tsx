/* Used for WatchListSortColumns and WatchListItemsSortColumns. WLI Sort columns do not have start and end date so they have to be optional */
export default interface IWatchListSortColumn {
     ID: string,
     Name: string,
     StartDate?: string,
     EndDate?: string
}