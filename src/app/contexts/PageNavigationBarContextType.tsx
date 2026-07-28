export interface PageNavigationBarContextType {
     activeRoute: string;
     currentItemsPage: number;
     currentWatchListPage: number;
     darkMode: boolean;
     IMDBSearchClickHandler: () => void;
     imdbSearchEnabled: boolean;
     isAdding: boolean;
     isLoading: boolean;
     hideTabs: boolean;
     lastPage: boolean;
     searchTerm: string;
     setNewPage: (value: number) => void;
     setSearchTerm: (value: string) => void;
}