import IWatchListItem from "../interfaces/IWatchListItem";
import IWatchListSource from "../interfaces/IWatchListSource";

export interface WatchListDtlContextType {
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     getWatchList: () => void;
     imdbSearchEnabled: boolean;
     isAdding: boolean;
     isEditing: boolean;
     isLoading: boolean;
     pullToRefreshEnabled: (value: boolean) => void;
     recommendationsEnabled: boolean,
     SaveIconComponent: React.ReactNode;
     setErrorMessage: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setStillWatching: (value: boolean) => void;
     showSearch: () => void;
     stillWatching: boolean;
     watchListSortDirection: string;
     watchListSources: IWatchListSource[];
     writeLog: (writeLogText: string) => void;
}