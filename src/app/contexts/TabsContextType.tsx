import IRouteList from "../interfaces/IRoute";
import ISectionChoice from "../interfaces/ISectionChoice";

export interface TabsContextType {
     activeRoute: string;
     darkMode: boolean;
     demoMode: boolean;
     getPath: (value: string) => string;
     hideTabs: boolean;
     isAdding: boolean;
     isAdmin: () => boolean;
     isClient: boolean;
     isEditing: boolean;
     isEnabled: (value: string) => boolean;
     isError: boolean;
     isLoading: boolean;
     loggedInCheck: string;
     pullToRefreshEnabled: (value: boolean) => void;
     routeList: IRouteList;
     setActiveRoute: (value: string) => void;
     setSearchInputVisible: (value: boolean) => void;
     setSearchTerm: (value: string) => void;
     visibleSections: ISectionChoice[],
}