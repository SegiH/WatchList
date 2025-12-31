import IWatchListItem from "../interfaces/IWatchListItem";

export interface WatchListStatsContextType {
     darkMode: boolean;
     demoMode: boolean;
     errorMessage: string;
     ratingMax: number;
     setIsError: (value: boolean) => void;
     setErrorMessage: (value: string) => void;
}