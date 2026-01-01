import IWatchList from "../interfaces/IWatchList";

export interface WatchListCardContextType {
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     filteredWatchList: IWatchList[];
     formatWatchListDates: (startDate: string, endDate: string) => string;
     getMissingPoster: (watchListItemID: number) => Promise<any[] | undefined>;
     openDetailClickHandler: (value: number, activeRouteOverride?: string) => void;
     setFilteredWatchList: React.Dispatch<React.SetStateAction<IWatchList[]>>;
     writeLog: (writeLogText: string) => void;
}