import IWatchListType from "../interfaces/IWatchListType";

export interface ManageWatchListTypesContextType {
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     defaultRoute: string;
     DeleteIconComponent: React.ReactNode;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     isAdding: boolean;
     isAdmin: () => boolean;
     isEditing: boolean;
     SaveIconComponent: React.ReactNode;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setWatchListTypesLoadingCheck: (value: string) => void;
     watchListTypes: IWatchListType[];
     watchListTypesLoadingCheck: string;
}