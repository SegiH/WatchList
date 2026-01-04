import IRouteList from "../interfaces/IRoute";

export interface SharedLayoutContextType {
     activeRoute: string;
     darkMode: boolean;
     demoModeNotificationVisible: boolean;
     imdbSearchEnabled: boolean;
     isError: boolean;
     isLoading: boolean;
     loggedInCheck: string;
     searchModalVisible: boolean;
     searchTerm: string;
     setDemoModeNotificationVisible: (value: boolean) => void;
     setSearchTerm: (value: string) => void;
}
