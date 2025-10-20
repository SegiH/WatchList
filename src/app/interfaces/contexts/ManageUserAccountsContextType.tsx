import IUser from "./IUser";

export interface ManageUserAccountsContextType {
     CancelIconComponent: React.ReactNode;
     darkMode: boolean;
     defaultRoute: string;
     demoMode: boolean;
     EditIconComponent: React.ReactNode;
     isAdding: boolean;
     isAdmin: () => boolean;
     isEditing: boolean;
     SaveIconComponent: React.ReactNode;
     setIsAdding: (value: boolean) => void;
     setIsEditing: (value: boolean) => void;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
     users: IUser[],
     validatePassword: (value: string) => boolean;
}