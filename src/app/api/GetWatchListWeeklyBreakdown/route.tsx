import { NextRequest } from 'next/server';
import { getDB, getUserID } from "../lib";
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListType from '@/app/interfaces/IWatchListType';
import IWatchListItem from '@/app/interfaces/IWatchListItem';

function getDateWeek(date) {
     const startDate: any = new Date(date.getFullYear(), 0, 1); // Start of the year
     const diff = date - startDate; // Difference between the given date and the start of the year
     const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
     const days = Math.floor(diff / oneDay); // Total days since the start of the year
     const weekNumber = Math.ceil((days + 1) / 7); // Calculate the week number

     return weekNumber;
}


export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const db = getDB();

     const watchListDB = db.WatchList;
     const watchListItemsDB = db.WatchListItems;
     const watchListTypesDB = db.WatchListTypes;

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (watchList.UserID === userID);
     });

     const tvTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "TV";
     });

     if (tvTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for tv type movie`]);
     }

     const tvTypeID = tvTypeIDResult[0].WatchListTypeID;

     const movieTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "Movie";
     });

     if (movieTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for movie type movie`]);
     }

     const movieTypeID = movieTypeIDResult[0].WatchListTypeID;

     const allTvWatchList = filteredWatchList.filter((watchList: IWatchList) => {
          return watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(tvTypeID));
          }).length == 1;
     });

     const allMovieWatchList = filteredWatchList.filter((watchList: IWatchList) => {
          return watchListItemsDB.filter((watchListItem: IWatchListItem) => {
               return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(movieTypeID));
          }).length == 1;
     });

     const movieYearWeekNum: any = [];
     const tvSeasonsYearWeekNum: any = [];
     const tvTotalYearWeekNum: any = [];

     allTvWatchList.map((watchList: any) => {
          if (watchList.StartDate != null) {
               const startDate = new Date(watchList.StartDate);

               tvSeasonsYearWeekNum.push({
                    Year: startDate.getFullYear(),
                    WeekNum: getDateWeek(startDate)
               });

               tvTotalYearWeekNum.push({
                    WatchListItemID: watchList.WatchListItemID,
                    Year: startDate.getFullYear(),
                    WeekNum: getDateWeek(startDate)
               });
          }
     });

     allMovieWatchList.map((watchList: any) => {
          if (watchList.StartDate != null) {
               const startDate = new Date(watchList.StartDate);

               movieYearWeekNum.push({
                    Year: startDate.getFullYear(),
                    WeekNum: getDateWeek(startDate)
               });
          }
     });

     // Remove duplicates
     const tvSeasonsResults = tvSeasonsYearWeekNum.filter((value, index, self) =>
          index === self.findIndex((t) => (
               t.Year === value.Year && t.WeekNum === value.WeekNum
          ))
     );

     const tvTotalResults = tvTotalYearWeekNum.filter((value, index, self) =>
          index === self.findIndex((t) => (
               t.WatchListItemID === value.WatchListItemID && t.Year === value.Year && t.WeekNum === value.WeekNum
          ))
     );

     const movieResults = movieYearWeekNum.filter((value, index, self) =>
          index === self.findIndex((t) => (
               t.Year === value.Year && t.WeekNum === value.WeekNum
          ))
     );

     tvSeasonsResults.map((element: any) => {
          const tvCountResults = allTvWatchList.filter((watchList: IWatchList) => {
               if (watchList.StartDate !== null) {
                    const startDate = new Date(watchList.StartDate);

                    return String(startDate.getFullYear()) === String(element.Year) && String(getDateWeek(startDate)) === String(element.WeekNum);
               }
          });

          element.TVCount = tvCountResults.length;
     });

     tvTotalResults.map((element: any) => {
          const tvCountResults = allTvWatchList.filter((watchList: IWatchList) => {
               if (watchList.StartDate !== null) {
                    const startDate = new Date(watchList.StartDate);

                    return String(watchList.WatchListItemID) === String(element.WatchListItemID) && String(startDate.getFullYear()) === String(element.Year) && String(getDateWeek(startDate)) === String(element.WeekNum);
               }
          });

          element.TVCount = tvCountResults.length;
     });

     movieResults.map((element: any) => {
          const movieCountResults = allTvWatchList.filter((watchList: IWatchList) => {
               if (watchList.StartDate !== null) {
                    const startDate = new Date(watchList.StartDate);

                    return String(startDate.getFullYear()) === String(element.Year) && String(getDateWeek(startDate)) === String(element.WeekNum);
               }
          });

          element.MovieCount = movieCountResults.length;
     });

     return Response.json(["OK", tvSeasonsResults, movieResults, tvTotalResults]);
}