import IWatchList from "../interfaces/IWatchList";
import IWatchListItem from "../interfaces/IWatchListItem";

export interface ItemsContextType {
     darkMode: boolean;
     filteredWatchListItems: IWatchListItem[];
     hideTabs: boolean;
     imdbSearchEnabled: boolean;
     isLoading: boolean;
     setActiveRoute: (value: string) => void;
     setFilteredWatchListItems: (value: IWatchListItem[]) => void;
     setModalVisible: (value: boolean) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     watchListItemsSortingCheck: string;
}