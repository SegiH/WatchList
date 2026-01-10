import IRouteList from "../interfaces/IRoute";
import ISectionChoice from "../interfaces/ISectionChoice";
import IUserOption from "../interfaces/IUserOption";
import IWatchListSortColumn from "../interfaces/IWatchListSortColumn";
import IWatchListSource from "../interfaces/IWatchListSource";
import IWatchListType from "../interfaces/IWatchListType";

export interface HamburgerMenuContextType {
    activeRoute: string;
    archivedVisible: boolean;
    autoAdd: boolean;
    buildDate: string;
    darkMode: boolean;
    defaultRoute: string;
    demoMode: boolean;
    demoModeNotificationVisible: boolean;
    hideTabs: boolean;
    isAdding: boolean;
    isAdmin: () => boolean;
    isEditing: boolean;
    isEnabled: (value: string) => boolean;
    loggedInCheck: string;
    LogOutIconComponent: React.ReactNode;
    metaDataFilters: any[];
    openDetailClickHandler: (value: number, activeRouteOverride?: string) => void; // *
    pullToRefreshEnabled: (value: boolean) => void;
    routes: IRouteList;
    setActiveRoute: (value: string) => void;
    setMetaDataFilters: (value: []) => void;
    setIsLoading: (value: boolean) => void;
    saveOptions: (newOptions: IUserOption) => void;
    setNewPage: (value: number) => void;
    setOptions: (value: IUserOption) => void;
    setShowMissingArtwork: (value: boolean) => void;
    setSourceFilter: (value: number) => void;
    setStillWatching: (value: boolean) => void;
    setTypeFilter: (value: number) => void;
    setVisibleSections: (value: []) => void;
    setWatchListSortColumn: (value: string) => void;
    setWatchListSortDirection: (value: string) => void;
    showMissingArtwork: boolean; 
    signOut: () => void;
    sourceFilter: number;
    stillWatching: boolean;
    typeFilter: number;
    visibleSectionChoices: ISectionChoice[],
    visibleSections: ISectionChoice[]
    watchListItemsSortColumns: IWatchListSortColumn;
    watchListSortColumn: string;
    watchListSortColumns: IWatchListSortColumn;
    watchListSortDirection: string;
    watchListSources: IWatchListSource[];
    watchListTypes: IWatchListType[];
}