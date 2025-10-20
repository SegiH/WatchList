import IWatchListItem from "../IWatchListItem";

export interface ItemsCardContextType {
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     filteredWatchListItems: IWatchListItem[];
     getMissingPoster: (watchListItemID: number) => void;
     openDetailClickHandler: (value: number, activeRouteOverride?: string) => void;
     setFilteredWatchListItems: React.Dispatch<React.SetStateAction<IWatchListItem[]>>;
}