import IWatchListType from "../interfaces/IWatchListType";

export interface ItemsDtlContextType {
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     getMissingPoster: (watchListItemID: number) => void;
     getWatchListItems: () => void;
     isAdding: boolean;
     isEditing: boolean;
     isEnabled: (value: string) => boolean;
     isLoading: boolean;
     pullToRefreshEnabled: (value: boolean) => void;
     SaveIconComponent: React.ReactNode;
     setErrorMessage: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     watchListTypes: IWatchListType[];
     writeLog: (writeLogText: string) => void;
}