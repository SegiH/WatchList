import IWatchListItem from "../IWatchListItem";

export interface WatchListStatsContextType {
     darkMode: boolean;
     demoMode: boolean;
     ratingMax: number;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
     watchListItems: IWatchListItem[];
}