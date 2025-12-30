import IWatchList from "../IWatchList";

export interface WatchListCardContextType {
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     filteredWatchList: IWatchList[];
     getMissingPoster: (watchListItemID: number) => Promise<any[]>;
     openDetailClickHandler: (value: number, activeRouteOverride?: string) => void;
     setFilteredWatchList: React.Dispatch<React.SetStateAction<IWatchList[]>>;
}