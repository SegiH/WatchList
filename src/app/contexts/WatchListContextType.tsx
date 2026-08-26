import IWatchList from "../interfaces/IWatchList";

export interface WatchListContextType {
     autoAdd: boolean;
     filteredWatchList: IWatchList[];
     hideTabs: boolean;
     isLoading: boolean;
     lastPage: boolean;
     modalVisible: boolean;
     searchTerm: string;
     setActiveRoute: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setModalVisible: (value: boolean) => void;
     tmdbSearchEnabled: boolean;
     watchListSortingCheck: string;
}