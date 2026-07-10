export interface SearchIMDBContextType {
     AddIconComponent: React.ReactNode;
     autoAdd: boolean;
     BrokenImageIconComponent: React.ReactNode;
     darkMode: boolean;
     modalVisible: boolean;
     searchCount: number;
     setIsAdding: (value: boolean) => void;
     setSearchCount: (value: number) => void;
     setModalVisible: (value: boolean) => void;
     setSearchTerm: (value: string) => void;
}