import IUserData from "../interfaces/IUserData";
import IUserOption from "../interfaces/IUserOption";

export interface LoginContextType {
     activeRoute: string;
     darkMode: boolean;
     defaultRoute: string;
     demoPassword: string;
     demoUsername: string;
     loggedInCheck: string;
     setActiveRoute: (value: string) => void;
     setDemoMode: (value: boolean) => void;
     setLoggedInCheck: (value: string) => void;
     setOptions: (value: IUserOption) => void;
     setUserData: React.Dispatch<React.SetStateAction<IUserData>>;
}