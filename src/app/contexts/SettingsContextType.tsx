import ISectionChoice from "../interfaces/ISectionChoice";
import IUserOption from "../interfaces/IUserOption";

export interface SettingsContextType {
     activeRoute: string;
     archivedVisible: boolean;
     autoAdd: boolean;
     buildDate: string;
     darkMode: boolean;
     defaultRoute: string;
     demoMode: boolean;
     hideTabs: boolean;
     LogOutIconComponent: React.ReactNode;
     loggedInCheck: string;
     pullToRefreshEnabled: (value: boolean) => void;
     saveOptions: (newOptions: IUserOption) => void;
     setActiveRoute: (value: string) => void;
     setNewPage: (value: number) => void;
     setOptions: (value: IUserOption) => void;
     setSettingsVisible: (value: boolean) => void;
     setShowMissingArtwork: (value: boolean) => void;
     setStillWatching: (value: boolean) => void;
     setVisibleSections: (value: []) => void;
     showMissingArtwork: boolean;
     signOut: () => void;
     visibleSectionChoices: ISectionChoice[],
     visibleSections: ISectionChoice[],
     watchListSortColumn: string;
}