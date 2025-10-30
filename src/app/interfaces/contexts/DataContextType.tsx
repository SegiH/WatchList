import IBugLog from "../IBugLog";
import ISectionChoice from "../ISectionChoice";
import IWatchList from "../IWatchList";
import IWatchListItem from "../IWatchListItem";
import IWatchListSource from "../IWatchListSource";
import IWatchListType from "../IWatchListType";

export interface DataContextType {
     bugLogs: IBugLog[];
     darkMode: boolean;
     defaultRoute: string;
     demoMode: boolean;
     isAdmin: () => boolean;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     visibleSections: ISectionChoice[],
     watchList: IWatchList[];
     watchListSortingCheck: string;
     watchListItems: IWatchListItem[];
     watchListItemsSortingCheck: string;
     watchListSources: IWatchListSource[];
     watchListTypes: IWatchListType[];
}