export interface AdminContextType {
     darkMode: boolean;
     defaultRoute: string;
     demoMode: boolean;
     isAdding: boolean;
     isAdmin: () => boolean;
     isEditing: boolean;
}