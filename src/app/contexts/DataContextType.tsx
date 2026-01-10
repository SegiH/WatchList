import IBugLog from "../interfaces/IBugLog";
import ISectionChoice from "../interfaces/ISectionChoice";
import IWatchList from "../interfaces/IWatchList";
import IWatchListItem from "../interfaces/IWatchListItem";
import IWatchListSource from "../interfaces/IWatchListSource";
import IWatchListType from "../interfaces/IWatchListType";

export interface DataContextType {
     bugLogs: IBugLog[];
     darkMode: boolean;
     defaultRoute: string;
     demoMode: boolean;
     isAdmin: () => boolean;
     lastPage: boolean;
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