export interface NavBarContextType {
     activeRoute: string;
     currentPage: number;
     darkMode: boolean;
     isAdding: boolean;
     isLoading: boolean;
     hideTabs: boolean;
     lastPage: boolean;
     setCurrentPage: (value: number) => void;
     watchListSortDirection: string;
}