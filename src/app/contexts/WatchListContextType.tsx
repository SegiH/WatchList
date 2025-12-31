import IWatchList from "../interfaces/IWatchList";

export interface WatchListContextType {
     darkMode: boolean;
     filteredWatchList: IWatchList[];
     hideTabs: boolean;
     isLoading: boolean;
     setActiveRoute: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     watchListSortingCheck: string;
     writeLog: (writeLogText: string) => void;
}