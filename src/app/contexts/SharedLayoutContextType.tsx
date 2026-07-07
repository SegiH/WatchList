import IRouteList from "../interfaces/IRoute";

export interface SharedLayoutContextType {
     activeRoute: string;
     darkMode: boolean;
     demoModeNotificationVisible: boolean;
     isError: boolean;
     isLoading: boolean;
     loggedInCheck: string;
     modalVisible: boolean;
     searchTerm: string;
     setSearchTerm: (value: string) => void;
}
