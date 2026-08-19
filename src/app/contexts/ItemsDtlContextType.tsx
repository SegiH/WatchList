import IWatchListType from "../interfaces/IWatchListType";

export interface ItemsDtlContextType {
     autoAdd: boolean;
     BrokenImageIconComponent: React.ReactNode;
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     formatWatchListDates: (startDate: string, endDate: string) => string;
     getMissingPoster: (watchListItemID: number) => void;
     getWatchListItems: () => void;
     imageHeight: number;
     imageIsValid: (imgUrl: string, poster_error?: boolean) => boolean;
     imageWidth: number;
     isAdding: boolean;
     isEditing: boolean;
     isEnabled: (value: string) => boolean;
     isLoading: boolean;
     pullToRefreshEnabled: (value: boolean) => void;
     SaveIconComponent: React.ReactNode;
     setActiveRoute: (value: string) => void;
     setErrorMessage: (value: string) => void;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setModalVisible: (value: boolean) => void;
     watchListTypes: IWatchListType[];
     writeLog: (writeLogText: string) => void;
}