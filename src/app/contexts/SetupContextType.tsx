export interface SetupContextType {
     activeRoute: string;
     defaultRoute: string;
     darkMode: boolean;
     demoUsername: string;
     loggedInCheck: string;
     validatePassword: (value: string) => boolean;
}