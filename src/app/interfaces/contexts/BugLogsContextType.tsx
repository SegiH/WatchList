import IBugLog from "../IBugLog";

export interface BugLogsContextType {
     bugLogs: IBugLog[];
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     defaultRoute: string;
     DeleteIconComponent: React.ReactNode;
     EditIconComponent: React.ReactNode;
     isAdding: boolean;
     isAdmin: () => boolean;
     isEditing: boolean;
     SaveIconComponent: React.ReactNode;
     setBugLogs: React.Dispatch<React.SetStateAction<IBugLog[]>>;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
}