export interface ErrorContextType {
     darkMode: boolean;
     defaultRoute: string;
     errorMessage: string;
     setActiveRoute: (value: string) => void;
}