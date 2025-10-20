export interface SearchIMDBContextType {
     AddIconComponent: React.ReactNode;
     autoAdd: boolean;
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     searchCount: number;
     SearchIconComponent: React.ReactNode;
     setIsAdding: (value: boolean) => void;
     setSearchCount: (value: number) => void;
     setSearchModalVisible: (value: boolean) => void;
}