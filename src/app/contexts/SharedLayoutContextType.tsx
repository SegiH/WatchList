import IRouteList from "../interfaces/IRoute";

export interface SharedLayoutContextType {
     activeRoute: string;
     autoAdd: boolean;
     currentItemsPage: number;
     currentWatchListPage: number;
     darkMode: boolean;
     demoModeNotificationVisible: boolean;
     imdbSearchEnabled: boolean;
     isError: boolean;
     isLoading: boolean;
     lastPage: boolean;
     loggedInCheck: string;
     modalVisible: boolean;
     searchTerm: string;
     setIsAdding: (value: boolean) => void;
     setModalVisible: (value: boolean) => void;
     setNewPage: (value: number) => void;
     setSearchTerm: (value: string) => void;
}
