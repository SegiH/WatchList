import IWatchList from "../interfaces/IWatchList";
import IWatchListItem from "../interfaces/IWatchListItem";

export interface ItemsContextType {
     darkMode: boolean;
     filteredWatchListItems: IWatchListItem[];
     hideTabs: boolean;
     isLoading: boolean;
     searchModalVisible: boolean;
     setActiveRoute: (value: string) => void;
     setFilteredWatchListItems: (value: IWatchListItem[]) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     watchList: IWatchList[];
     watchListItemsSortingCheck: string;
}