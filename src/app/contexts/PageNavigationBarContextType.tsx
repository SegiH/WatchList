export interface PageNavigationBarContextType {
     activeRoute: string;
     currentItemsPage: number;
     currentWatchListPage: number;
     darkMode: boolean;
     isAdding: boolean;
     isLoading: boolean;
     hideTabs: boolean;
     lastPage: boolean;
     setNewPage: (value: number) => void;
}