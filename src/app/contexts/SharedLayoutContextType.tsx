import IRouteList from "../interfaces/IRoute";

export interface SharedLayoutContextType {
     activeRoute: string;
     autoAdd: boolean;
     currentItemsPage: number;
     currentWatchListPage: number;
     demoModeNotificationVisible: boolean;
     IMDBSearchClickHandler: () => void;
     imdbSearchEnabled: boolean;
     imdbSearchResults: string;
     isError: boolean;
     isLoading: boolean;
     lastPage: boolean;
     loggedInCheck: string;
     modalVisible: boolean;
     searchTerm: string;
     setIMDBSearchResults: (value: []) => void;
     setIsAdding: (value: boolean) => void;
     setModalVisible: (value: boolean) => void;
     setNewPage: (value: number) => void;
     setSearchTerm: (value: string) => void;
}
