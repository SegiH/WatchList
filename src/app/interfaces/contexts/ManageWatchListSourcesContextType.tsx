import IWatchListSource from "../IWatchListSource";

export interface ManageWatchListSourcesContextType {
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
     setWatchListSourcesLoadingCheck: (value: string) => void;
     watchListSources: IWatchListSource[];
     watchListSourcesLoadingCheck: string;
}