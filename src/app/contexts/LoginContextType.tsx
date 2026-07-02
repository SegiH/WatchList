import IRouteList from "../interfaces/IRoute";
import IUserData from "../interfaces/IUserData";
import IUserOption from "../interfaces/IUserOption";

export interface LoginContextType {
     activeRoute: string;
     darkMode: boolean;
     defaultRoute: string;
     demoPassword: string;
     demoUsername: string;
     loggedInCheck: string;
     routeList: IRouteList;
     setActiveRoute: (value: string) => void;
     setDemoMode: (value: boolean) => void;
     setLoggedInCheck: (value: string) => void;
     setOptions: (value: IUserOption[]) => void;
     setVisibleSections: (value: []) => void;
     setRoutes: (value: IRouteList) => void;
     setUserData: React.Dispatch<React.SetStateAction<IUserData>>;
}