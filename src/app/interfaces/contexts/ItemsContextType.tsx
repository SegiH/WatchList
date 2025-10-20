import IWatchListItem from "../IWatchListItem";

export interface ItemsContextType {
     darkMode: boolean;
     filteredWatchListItems: IWatchListItem[];
     hideTabs: boolean;
     isLoading: boolean;
     searchModalVisible: boolean;
     setActiveRoute: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     watchListItemsSortingCheck: string;
}