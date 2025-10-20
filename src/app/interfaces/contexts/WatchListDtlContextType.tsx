import IWatchListItem from "../IWatchListItem";
import IWatchListSource from "../IWatchListSource";

export interface WatchListDtlContextType {
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
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
     setWatchListSortingCheck: (value: string) => void;
     showSearch: () => void;
     stillWatching: boolean;
     watchListItems: IWatchListItem[];
     watchListSortDirection: string;
     watchListSources: IWatchListSource[];
}