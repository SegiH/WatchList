import { NextRequest } from 'next/server';
import { getDB, getUserID } from "../lib";
import IWatchListSource from '@/app/interfaces/IWatchListSource';
import IWatchList from '@/app/interfaces/IWatchList';
import IWatchListItem from '@/app/interfaces/IWatchListItem';
import IWatchListType from '@/app/interfaces/IWatchListType';

export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const db: any = await getDB();

     const watchListDB = db.WatchList;
     const watchListItemsDB = db.WatchListItems;
     const watchListSourcesDB = db.WatchListSources;
     const watchListTypesDB = db.WatchListTypes;

     const filteredWatchList = watchListDB.filter((watchList: IWatchList) => {
          return (String(watchList.UserID) === String(userID));
     });

     // Get ID for movie type
     const movieTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "Movie";
     });

     if (movieTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for movie type movie`]);
     }

     const movieTypeID = movieTypeIDResult[0].WatchListTypeID;

     const allWLIMovies = watchListItemsDB.filter((watchListItem: IWatchListItem) => {
          return watchListItem.WatchListTypeID === movieTypeID;
     });

     const tvTypeIDResult = watchListTypesDB.filter((watchListType: IWatchListType) => {
          return watchListType.WatchListTypeName === "TV";
     });

     if (tvTypeIDResult.length !== 1) {
          return Response.json(["ERROR", `Unable to get ID for tv type movie`]);
     }

     const tvTypeID = tvTypeIDResult[0].WatchListTypeID;

     // Filter filteredWatchList for all TV types 
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

     const watchListMovieCountStats = generateWatchListMovieCountStats(filteredWatchList, watchListItemsDB, movieTypeID);
     const watchListSourceStats = generateWatchListSourceStats(filteredWatchList, watchListItemsDB, watchListSourcesDB, false);
     const watchListSourceDetailsStats = generateWatchListSourceStats(filteredWatchList, watchListItemsDB, watchListSourcesDB, true);
     const watchListTop10MoviesStats = generateWatchListTop10MoviesStats(filteredWatchList, watchListItemsDB, allWLIMovies);
     const watchListTopRatedStats = generateWatchListTopRatedStats(filteredWatchList, watchListItemsDB);
     const watchListTVTop10Stats = generateWatchListTVTop10Stats(watchListItemsDB, allTvWatchList);
     const watchListTVTotalCountStats = generateWatchListTVTotalCountStats(allTvWatchList);
     const watchListWeeklyBreakdownTV = generateWatchListWeeklyBreakdownTV(allTvWatchList);
     const watchListWeeklyBreakdownMovieStats = generateWatchListWeeklyMovieBreakdown(allMovieWatchList, allTvWatchList)

     const response = {
          "WatchListMovieCountStats": watchListMovieCountStats,
          "WatchListSourceStats": watchListSourceStats,
          "WatchListSourceDetailStats": watchListSourceDetailsStats,
          "WatchListTop10MoviesStats": watchListTop10MoviesStats,
          "WatchListTopRatedStats": watchListTopRatedStats,
          "WatchListTVSeasonsStats": allTvWatchList.length,
          "WatchListTVTop10Stats": watchListTVTop10Stats,
          "WatchListTVTotalCountStats": watchListTVTotalCountStats,
          "WeeklyBreakdownTVSeasonsStats": watchListWeeklyBreakdownTV[0],
          "WeeklyBreakdownTVTotalResultsStats": watchListWeeklyBreakdownTV[1],
          "WeeklyBreakdownMovieStats": watchListWeeklyBreakdownMovieStats
     }

     return Response.json(["OK", response]);
}

const generateWatchListMovieCountStats = (filteredWatchList: IWatchList[], watchListItems: IWatchListItem[], movieTypeID: number) => {


     const allMovieWatchList = filteredWatchList.filter((watchList: IWatchList) => {
          return watchListItems.filter((watchListItem: IWatchListItem) => {
               return (watchListItem.WatchListItemID === watchList.WatchListItemID && String(watchListItem.WatchListTypeID) === String(movieTypeID));
          }).length == 1;
     });

     return allMovieWatchList.length;
}

const generateWatchListSourceStats = (filteredWatchList: IWatchList[], watchListItems: IWatchListItem[], watchListSources: IWatchListSource[], getDetail: boolean) => {
     const countOccurrences = filteredWatchList.reduce((acc, obj) => {
          acc[obj.WatchListSourceID] = (acc[obj.WatchListSourceID] || 0) + 1;
          return acc;
     }, {});

     const countArray = Object.entries(countOccurrences);

     const top10 = countArray.sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);

     const results: any = [];

     if (!getDetail) {
          top10.map(async (element: any, index) => {
               const watchListSource = watchListSources.filter((watchListSource: IWatchListSource) => {
                    return (String(watchListSource.WatchListSourceID) === String(element[0]));
               });

               if (watchListSource.length === 1) {
                    results.push({
                         WatchListSourceID: element[0],
                         WatchListSourceName: watchListSource[0].WatchListSourceName,
                         SourceCount: element[1]
                    });
               }
          });

          return results;
     } else {
          top10.map(async (element: any) => {
               const watchListForSource = filteredWatchList.filter((watchList: IWatchList) => {
                    return (String(watchList.WatchListSourceID) === String(element[0]));
               });

               watchListForSource.map(async (watchList: any) => {
                    const currentWatchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
                         return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
                    });

                    const currentWatchListSource = watchListSources.filter((watchListSource: IWatchListSource) => {
                         return (String(watchListSource.WatchListSourceID) === String(watchList.WatchListSourceID));
                    });

                    if (currentWatchListSource.length !== 0 && currentWatchListItem.length !== 0) {
                         results.push({
                              WatchListID: watchList.WatchListID,
                              UserID: watchList.UserID,
                              WatchListItemID: watchList.WatchListItemID,
                              WatchListItemName: currentWatchListItem[0].WatchListItemName,
                              StartDate: watchList.StartDate,
                              EndDate: watchList.EndDate,
                              Season: watchList.Season,
                              WatchListSourceID: currentWatchListSource[0]?.WatchListSourceID,
                              WatchListSourceName: currentWatchListSource[0]?.WatchListSourceName
                         });
                    }
               });
          });

          return results;
     }
}

const generateWatchListTop10MoviesStats = (filteredWatchList: IWatchList[], watchListItems: IWatchListItem[], allWLIMovies: IWatchListItem[]) => {
     // Get All watched movies
     const watchedMovies = filteredWatchList.filter((watchList: IWatchList) => {
          return allWLIMovies.filter((watchListItem: IWatchListItem) => {
               return watchListItem.WatchListItemID === watchList.WatchListItemID;
          }).length > 0;
     });

     const frequencyMap = watchedMovies.reduce((acc, item) => {
          const key = `${item.UserID}-${item.WatchListItemID}`;
          if (!acc[key]) {
               acc[key] = 0;
          }
          acc[key]++;
          return acc;
     }, {} as { [key: string]: number });

     const frequencyArray = Object.entries(frequencyMap);

     const sortedTop10 = frequencyArray
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .map(([key, count]) => {
               const [UserID, WatchListItemID] = key.split('-');
               return { UserID: parseInt(UserID, 10), WatchListItemID: Number(WatchListItemID), count };
          });

     sortedTop10.map((watchList: any) => {
          const watchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
          });

          if (watchListItem.length === 1) {
               watchList.ItemCount = watchList.count;
               watchList.WatchListItemName = watchListItem[0].WatchListItemName;
               watchList.IMDB_URL = watchListItem[0].IMDB_URL;
          }
     });

     return sortedTop10;
}

const generateWatchListTopRatedStats = (filteredWatchList: IWatchList[], watchListItems: IWatchListItem[]) => {
     const getTop10Rated = (watchList) => {
          return watchList
               .sort((a, b) => b.Rating - a.Rating)  // Sort in descending order based on Rating
               .slice(0, 10);  // Take the first 10 items
     };

     // Get the top 10 highest-rated records
     const top10Rated = getTop10Rated(filteredWatchList);

     top10Rated.map(async (element: any) => {
          const currentWatchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(element.WatchListItemID));
          });

          if (currentWatchListItem.length > 0) {
               element.WatchListItemName = currentWatchListItem[0].WatchListItemName
               element.IMDB_URL = currentWatchListItem[0].IMDB_URL;
          }
     });

     return top10Rated;
}

const generateWatchListTVTotalCountStats = (allTvWatchList: IWatchList[]) => {
     const frequencyMap = allTvWatchList.reduce((acc, item) => {
          const key = `${item.WatchListItemID}`;
          if (!acc[key]) {
               acc[key] = 0;
          }
          acc[key]++;
          return acc;
     }, {} as { [key: string]: number });

     const frequencyArray = Object.entries(frequencyMap);

     const sorted = frequencyArray
          .sort((a: any, b: any) => b[1] - a[1])
          .map(([key, count]) => {
               const [WatchListItemID] = key.split('-');
               return { WatchListItemID: Number(WatchListItemID), ItemCount: count };
          });

     return sorted.length;
}

const generateWatchListTVTop10Stats = (watchListItems: IWatchListItem[], allTvWatchList: IWatchList[]) => {
     const frequencyMap = allTvWatchList.reduce((acc, item) => {
          const key = `${item.WatchListItemID}`;
          if (!acc[key]) {
               acc[key] = 0;
          }
          acc[key]++;
          return acc;
     }, {} as { [key: string]: number });

     const frequencyArray = Object.entries(frequencyMap);

     const sortedTop10 = frequencyArray
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .map(([key, count]) => {
               const [WatchListItemID] = key.split('-');
               return { WatchListItemID: Number(WatchListItemID), ItemCount: count };
          });

     sortedTop10.map((watchList: any) => {
          const watchListItem = watchListItems.filter((watchListItem: IWatchListItem) => {
               return (String(watchListItem.WatchListItemID) === String(watchList.WatchListItemID));
          });

          if (watchListItem.length === 1) {
               watchList.WatchListItemName = watchListItem[0].WatchListItemName;
               watchList.IMDB_URL = watchListItem[0].IMDB_URL;
          }
     });

     return sortedTop10;
}

const generateWatchListWeeklyBreakdownTV = (allTvWatchList: IWatchList[]) => {
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

     return [tvSeasonsResults, tvTotalResults];
}

const generateWatchListWeeklyMovieBreakdown = (allMovieWatchList: IWatchList[], allTvWatchList: IWatchList[]) => {
     const movieYearWeekNum: any = [];

     allMovieWatchList.map((watchList: any) => {
          if (watchList.StartDate != null) {
               const startDate = new Date(watchList.StartDate);

               movieYearWeekNum.push({
                    Year: startDate.getFullYear(),
                    WeekNum: getDateWeek(startDate)
               });
          }
     });

     const movieResults = movieYearWeekNum.filter((value, index, self) =>
          index === self.findIndex((t) => (
               t.Year === value.Year && t.WeekNum === value.WeekNum
          ))
     );

     movieResults.map((element: any) => {
          const movieCountResults = allTvWatchList.filter((watchList: IWatchList) => {
               if (watchList.StartDate !== null) {
                    const startDate = new Date(watchList.StartDate);

                    return String(startDate.getFullYear()) === String(element.Year) && String(getDateWeek(startDate)) === String(element.WeekNum);
               }
          });

          element.MovieCount = movieCountResults.length;
     });

     return movieResults;
}

const getDateWeek = (date) => {
     const startDate: any = new Date(date.getFullYear(), 0, 1); // Start of the year
     const diff = date - startDate; // Difference between the given date and the start of the year
     const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
     const days = Math.floor(diff / oneDay); // Total days since the start of the year
     const weekNumber = Math.ceil((days + 1) / 7); // Calculate the week number

     return weekNumber;
}