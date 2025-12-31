import IWatchList from "../interfaces/IWatchList";
import IWatchListItem from "../interfaces/IWatchListItem";

export interface ItemsCardContextType {
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     filteredWatchListItems: IWatchListItem[];
     getMissingPoster: (watchListItemID: number) => void;
     getWatchList: () => void;
     openDetailClickHandler: (value: number, activeRouteOverride?: string) => void;
     setFilteredWatchListItems: React.Dispatch<React.SetStateAction<IWatchListItem[]>>;
     watchList: IWatchList[];
     watchListSortingCheck: string;
}