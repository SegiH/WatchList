import IWatchList from "../interfaces/IWatchList";

export interface WatchListContextType {
     darkMode: boolean;
     filteredWatchList: IWatchList[];
     hideTabs: boolean;
     imdbSearchEnabled: boolean;
     isLoading: boolean;
     lastPage: boolean;
     searchModalVisible: boolean;
     searchTerm: string;
     setActiveRoute: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setSearchModalVisible: (value: boolean) => void;
     watchListSortingCheck: string;
}