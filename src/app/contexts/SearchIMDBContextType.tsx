export interface SearchIMDBContextType {
     AddIconComponent: React.ReactNode;
     autoAdd: boolean;
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     searchCount: number;
     SearchIconComponent: React.ReactNode;
     modalVisible: boolean;
     searchTerm: string;
     setIsAdding: (value: boolean) => void;
     setSearchCount: (value: number) => void;
     setModalVisible: (value: boolean) => void;
     setSearchTerm: (value: string) => void;
}