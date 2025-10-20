import IWatchListType from "../IWatchListType";

export interface ItemsDtlContextType {
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     isAdding: boolean;
     isEnabled: (value: string) => boolean;
     isEditing: boolean;
     isLoading: boolean;
     pullToRefreshEnabled: (value: boolean) => void;
     SaveIconComponent: React.ReactNode;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     setWatchListItemsSortingCheck: (value: string) => void;
     watchListTypes: IWatchListType[];
}