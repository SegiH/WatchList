"use client"

const axios = require("axios");
import Image from 'next/image';
const React = require("react");
const useContext = require("react").useContext;
const useEffect = require("react").useEffect;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;
const ISearchImdb = require("../interfaces/ISearchImdb");
const IWatchList = require("../interfaces/IWatchList");
const IWatchListItem = require("../interfaces/IWatchListItem");

import { DataContext, DataContextType } from "../data-context";

export default function SearchIMDB() {
     const {
          AddIconComponent,
          autoAdd,
          BrokenImageIconComponent,
          searchCount,
          setNewWatchListItemDtlID,
          setSearchVisible,
          setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete,
          watchList,
          watchListItems
     } = useContext(DataContext) as DataContextType

     const [imdbSearchResults, setIMDBSearchResults] = useState([]);
     const [searchLoadingStarted, setSearchLoadingStarted] = useState(false);
     const [searchLoadingComplete, setSearchLoadingComplete] = useState(false);
     const [searchSection, setSearchSection] = useState("WatchList");
     const [searchTerm, setSearchTerm] = useState("");
     const [watchListSearchResults, setWatchListSearchResults] = useState([]);
     const [watchListItemsSearchResults, setWatchListItemsSearchResults] = useState([]);

     const searchSectionTypes = {
          WatchList: "WatchList",
          WatchListItems: "WatchListItems",
          IMDB: "IMDB"
     }

     const router = useRouter();

     const addSearchResultClickHandler = (index: number) => {
          let itemType = 0; ``

          if (imdbSearchResults[index].Type === "movie") {
               itemType = 1;
          } else if (imdbSearchResults[index].Type === "series") {
               itemType = 2;
          } else {
               itemType = 3;
          }

          const confirmAdd = confirm("Add IMDB search result ?");

          if (!confirmAdd) {
               return;
          }

          let paramStr = `/api/AddWatchListItem?WatchListItemName=${imdbSearchResults[index].Title}&WatchListTypeID=${itemType}`;

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${imdbSearchResults[index].ImdbID}/`;

          paramStr += `&IMDB_Poster=${imdbSearchResults[index].Poster}`;

          axios.put(paramStr)
               .then((res: typeof ISearchImdb) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while adding the search result`);
                    } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
                         alert(res.data[1]);
                    } else {
                         setWatchListItemsLoadingStarted(false);
                         setWatchListItemsLoadingComplete(false);

                         if (autoAdd) {
                              setNewWatchListItemDtlID(res.data[1]);
                         }

                         // Remove this item from the the search results since its been added
                         const newSearchResults = Object.assign([], imdbSearchResults);
                         newSearchResults.splice(index, 1);
                         setIMDBSearchResults(newSearchResults);

                         setSearchVisible(false);
                    }
               })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the search result`);
               });
     };

     const closeSearch = async () => {
          setSearchVisible(false);
     };

     const openWatchListDetailClickHandler = (watchListID: number) => {
          router.push(`/WatchList/Dtl?WatchListID=${watchListID}`);

          closeSearch();
     }

     const openWatchListItemDetailClickHandler = (watchListItemID: number) => {
          router.push(`/WatchListItems/Dtl?WatchListItemID=${watchListItemID}`);

          closeSearch();
     }

     const showDefaultSrcWatchList = (watchListID: number) => (): void => {
          const newSearchResults = Object.assign([], watchList);

          const currentSearchResultsResult = newSearchResults?.filter((currentWatchList: typeof IWatchList) => {
               return String(currentWatchList.WatchListID) === String(watchListID);
          });

          if (currentSearchResultsResult === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentSearchResult = currentSearchResultsResult[0];

          currentSearchResult["WatchListItem"]["IMDB_Poster_Error"] = true;

          setWatchListSearchResults(newSearchResults);
     };

     const showDefaultSrcWatchListItems = (watchListItemID: number) => (): void => {
          const newSearchResults = Object.assign([], watchListItems);

          const currentSearchResultsResult = newSearchResults?.filter((currentWatchListItem: typeof IWatchListItem) => {
               return String(currentWatchListItem.WatchListItemID) === String(watchListItemID);
          });

          if (currentSearchResultsResult === 0) {
               // this shouldn't ever happen!
               return;
          }

          const currentSearchResult = currentSearchResultsResult[0];

          currentSearchResult["IMDB_Poster_Error"] = true;

          setWatchListItemsSearchResults(newSearchResults);
     };

     useEffect(() => {
          if (searchTerm === "") {
               setIMDBSearchResults([]);
               setWatchListSearchResults([]);
               setWatchListItemsSearchResults([]);

               return;
          }

          switch (searchSection) {
               case searchSectionTypes.WatchList:
                    // Search existing WatchList
                    const newWatchList: typeof IWatchList = Object.assign([], watchList);

                    const currentWatchListResults = newWatchList?.filter((currentWatchList: typeof IWatchList) => {
                         return currentWatchList?.WatchListItem?.WatchListItemName.toString().toUpperCase().includes(String(searchTerm).toUpperCase());
                    });

                    if (currentWatchListResults.length > 0) {
                         setWatchListSearchResults(currentWatchListResults);
                    }

                    break;
               case searchSectionTypes.WatchListItems:
                    // Search existing WatchList Items
                    const newWatchListItems: typeof IWatchListItem = Object.assign([], watchListItems);

                    const currentWatchListItemsResult = newWatchListItems?.filter((currentWatchListItems: typeof IWatchListItem) => {
                         return currentWatchListItems?.WatchListItemName.toString().toUpperCase().includes(String(searchTerm).toUpperCase());
                    });

                    if (currentWatchListItemsResult.length > 0) {
                         setWatchListItemsSearchResults(currentWatchListItemsResult);
                    }

                    break;
               case searchSectionTypes.IMDB:
                    setTimeout(() => {
                         setSearchLoadingStarted(true);

                         // Uncomment this and comment out API call below to test search response without hitting API server
                         /*setTimeout(() => {
                              const demoData = ["OK", [{ "Title": "RED", "Year": "2010", "imdbID": "tt1245526", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMzg2Mjg1OTk0NF5BMl5BanBnXkFtZTcwMjQ4MTA3Mw@@._V1_SX300.jpg" }, { "Title": "Red Notice", "Year": "2021", "imdbID": "tt7991608", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BZmRjODgyMzEtMzIxYS00OWY2LTk4YjUtMGMzZjMzMTZiN2Q0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" }, { "Title": "Red Dragon", "Year": "2002", "imdbID": "tt0289765", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BOTAwZDI1OTctN2Q5YS00OGNiLWIyMmUtYWM4ZGFjYWYyYzJjXkEyXkFqcGdeQXVyMTUzMDUzNTI3._V1_SX300.jpg" }, { "Title": "The Hunt for Red October", "Year": "1990", "imdbID": "tt0099810", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BZDdkODg3YzctMGVmZS00ZDM5LWIzNTctZDRlMjA5Mjc4MGViXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg" }, { "Title": "Red Sparrow", "Year": "2018", "imdbID": "tt2873282", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTA3MDkxOTc4NDdeQTJeQWpwZ15BbWU4MDAxNzgyNTQz._V1_SX300.jpg" }, { "Title": "The Thin Red Line", "Year": "1998", "imdbID": "tt0120863", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYjEzMTM2NjAtNWFmZC00MTVlLTgyMmQtMGQyNTFjZDk5N2NmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_SX300.jpg" }, { "Title": "RED 2", "Year": "2013", "imdbID": "tt1821694", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMjI2ODQ4ODY3Nl5BMl5BanBnXkFtZTcwNTc2NzE1OQ@@._V1_SX300.jpg" }, { "Title": "Turning Red", "Year": "2022", "imdbID": "tt8097030", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BOWYxZDMxYWUtNjNiZC00MDE1LWI2Y2QtNWZhNDAyMGY5ZjVhXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg" }, { "Title": "Red Eye", "Year": "2005", "imdbID": "tt0421239", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNzAxNjc1ODczOF5BMl5BanBnXkFtZTcwMjE3MjEzMw@@._V1_SX300.jpg" }, { "Title": "Red Riding Hood", "Year": "2011", "imdbID": "tt1486185", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTc4NjYyMzQ5MV5BMl5BanBnXkFtZTcwNjE5Mjc3NA@@._V1_SX300.jpg" }, { "Title": "Three Colors: Red", "Year": "1994", "imdbID": "tt0111495", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYTg1MmNiMjItMmY4Yy00ZDQ3LThjMzYtZGQ0ZTQzNTdkMGQ1L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg" }, { "Title": "Red Dawn", "Year": "2012", "imdbID": "tt1234719", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BOGJkOWNjYmQtMjgzMi00NTUxLTk2M2MtZjJjMGZlZTgyZGI5XkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg" }, { "Title": "Red Heat", "Year": "1988", "imdbID": "tt0095963", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNDVkMWZkMDctMWYyYy00MTRlLTlhMzktNDVjMWUzY2Y0OGMzXkEyXkFqcGdeQXVyMTUzMDUzNTI3._V1_SX300.jpg" }, { "Title": "Legally Blonde 2: Red, White & Blonde", "Year": "2003", "imdbID": "tt0333780", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTkwNzExMjk0MF5BMl5BanBnXkFtZTcwOTUzNDcyMw@@._V1_SX300.jpg" }, { "Title": "Red State", "Year": "2011", "imdbID": "tt0873886", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTQyNjMwMzA1MV5BMl5BanBnXkFtZTcwMzQyNDAxNg@@._V1_SX300.jpg" }, { "Title": "Red Lights", "Year": "2012", "imdbID": "tt1748179", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTQzMjYwNTc2M15BMl5BanBnXkFtZTcwMTY0Mjc4Nw@@._V1_SX300.jpg" }, { "Title": "Red Dawn", "Year": "1984", "imdbID": "tt0087985", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNGU2NzI1NDEtNTFlNi00NDA4LWIxNDEtNTliM2RmMmQxMjExXkEyXkFqcGdeQXVyMTUzMDUzNTI3._V1_SX300.jpg" }, { "Title": "Red Planet", "Year": "2000", "imdbID": "tt0199753", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTY2MzE0MjAwOF5BMl5BanBnXkFtZTYwNDM4Mzg2._V1_SX300.jpg" }, { "Title": "Batman: Under the Red Hood", "Year": "2010", "imdbID": "tt1569923", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNmY4ZDZjY2UtOWFiYy00MjhjLThmMjctOTQ2NjYxZGRjYmNlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" }, { "Title": "Blood Red Sky", "Year": "2021", "imdbID": "tt6402468", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMDQ0MWEzMDEtMGZmNC00NjQ0LWJlNDItZDMyNDc5MmFkODJjXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg" }, { "Title": "Insidious: The Red Door", "Year": "2023", "imdbID": "tt13405778", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BOTQyNGY5ZGQtN2E1MC00ZDhkLWJiYWMtMTFjODAwMDFmZDRhXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_SX300.jpg" }, { "Title": "Red Cliff", "Year": "2008", "imdbID": "tt0425637", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTcyOTQ3NDA1OV5BMl5BanBnXkFtZTcwMDY3NzM4Mg@@._V1_SX300.jpg" }, { "Title": "Red, White & Royal Blue", "Year": "2023", "imdbID": "tt10172266", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BOTFhNzc2MGMtZGUwYi00ZWFjLThlOWEtNDdmYTQyZjc3NDQ4XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" }, { "Title": "Red Sonja", "Year": "1985", "imdbID": "tt0089893", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BY2E1MzI1NjAtZmM5Zi00Y2VlLTg3NTEtZTM1ZTg0Njg2Y2Y2XkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg" }, { "Title": "Deep Red", "Year": "1975", "imdbID": "tt0073582", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYTg4MjczZWMtMzAzNS00NzUwLWEwNzYtZmUzZGJjNjA1OTdiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg" }, { "Title": "The Red Shoes", "Year": "1948", "imdbID": "tt0040725", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNGY3NzRmMzQtYzljOC00NGZjLTk4NjQtMzc3YzMwOTVjYzE3XkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg" }, { "Title": "The Red Turtle", "Year": "2016", "imdbID": "tt3666024", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNGZlYzFhNmYtMmJhMS00YTk5LWI3MDAtZmZhZTM0YzFlYjAxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" }, { "Title": "Rudolph the Red-Nosed Reindeer", "Year": "1964", "imdbID": "tt0058536", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYjdjZjkyYjUtOWJiZC00ZTE2LTk4MDktZjliOTk5ZDk5ZTZhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" }, { "Title": "Red Dwarf", "Year": "1988–", "imdbID": "tt0094535", "Type": "series", "Poster": "https://m.media-amazon.com/images/M/MV5BMDlhODEyNjAtOTJiNy00ZTNhLWIzMDYtMDNiZjAzYzJhNzE3XkEyXkFqcGdeQXVyMTE5NDkxMA@@._V1_SX300.jpg" }, { "Title": "Red Tails", "Year": "2012", "imdbID": "tt0485985", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNDQ5MTg2NzI4OF5BMl5BanBnXkFtZTcwMDM2NzQzNg@@._V1_SX300.jpg" }, { "Title": "Raise the Red Lantern", "Year": "1991", "imdbID": "tt0101640", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNDMxMTc2N2ItMjI5Ny00MGFiLThkOTYtZTIyYTZhMzA2NjIzXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_SX300.jpg" }, { "Title": "The Red Violin", "Year": "1998", "imdbID": "tt0120802", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYmZiMGI1ZWQtM2ZiOS00YWQ0LWEwYzMtODhhYTMwMzM5MjU4XkEyXkFqcGdeQXVyMTA0MjU0Ng@@._V1_SX300.jpg" }, { "Title": "Red River", "Year": "1948", "imdbID": "tt0040724", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTM2NDA3NTQ2OF5BMl5BanBnXkFtZTcwODUzNzU2NA@@._V1_SX300.jpg" }, { "Title": "Red Rocket", "Year": "2021", "imdbID": "tt13453006", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BZjYyZWMyNjYtZjNlNC00NmNhLThjOTItYmViMGU5ZDU4YTM4XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_SX300.jpg" }, { "Title": "The Red Sea Diving Resort", "Year": "2019", "imdbID": "tt4995776", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMjZiYWI3MWMtM2NiZi00Y2E0LWI1ODctNmNhMDUyNGMzODkwXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SX300.jpg" }, { "Title": "The Red Circle", "Year": "1970", "imdbID": "tt0065531", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYjA4YzZiOTAtY2E4NS00Y2YwLTkxMWItZjU2NDU2NmRhMjc3XkEyXkFqcGdeQXVyNDE0OTU3NDY@._V1_SX300.jpg" }, { "Title": "Rose Red", "Year": "2002", "imdbID": "tt0259153", "Type": "series", "Poster": "https://m.media-amazon.com/images/M/MV5BMzAwOTY0Y2UtOGRjYi00ZmE1LTk2MmUtYjQyYjA0Mzc4OTFkXkEyXkFqcGdeQXVyNjk1Njg5NTA@._V1_SX300.jpg" }, { "Title": "Dead Snow 2: Red vs. Dead", "Year": "2014", "imdbID": "tt2832470", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTk2MTEwOTcwOF5BMl5BanBnXkFtZTgwMDEzMjM2MjE@._V1_SX300.jpg" }, { "Title": "Red Cliff II", "Year": "2009", "imdbID": "tt1326972", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNGExZjRhZjItZjUxMC00MTdiLTg4Y2ItOGM1MjRlYmFiYjY1XkEyXkFqcGdeQXVyNzI1NzMxNzM@._V1_SX300.jpg" }, { "Title": "Red Rock West", "Year": "1993", "imdbID": "tt0105226", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNzhiMTQxYzMtOWI4NS00NWJiLWE5MDMtMmIzNjMxODNjZjBlXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_SX300.jpg" }, { "Title": "Red Dead Redemption II", "Year": "2018", "imdbID": "tt6161168", "Type": "game", "Poster": "https://m.media-amazon.com/images/M/MV5BMThiMGJkNDUtYjIxYy00ZTRhLWE5NmUtNzI4NTJlOGI4ZTMwXkEyXkFqcGdeQXVyNTk1ODMyNjA@._V1_SX300.jpg" }, { "Title": "Red Dead Redemption", "Year": "2010", "imdbID": "tt1479962", "Type": "game", "Poster": "https://m.media-amazon.com/images/M/MV5BZmYwNjk3OWMtODk2Yi00MjA3LTgzYzctODk1NmRhM2M4ZDVjXkEyXkFqcGdeQXVyNjgzMTIxNzE@._V1_SX300.jpg" }, { "Title": "The Big Red One", "Year": "1980", "imdbID": "tt0080437", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMGM3MmI0ZDUtYzE1ZS00YWE4LWEzY2UtNjhiZTBiZTEyMzY1L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg" }, { "Title": "SAS: Red Notice", "Year": "2021", "imdbID": "tt4479380", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BYzVjMWU4OGUtNGEyZS00MjJiLWIzNTMtNDk1NDdmMDUwYTAyXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg" }, { "Title": "Red Beard", "Year": "1965", "imdbID": "tt0058888", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BNDU5ZjE1OWUtZjcxNS00NjAzLThhZTQtOWY0MDc3NDQ1YTE2XkEyXkFqcGdeQXVyMTIyNzY1NzM@._V1_SX300.jpg" }, { "Title": "The Red Balloon", "Year": "1956", "imdbID": "tt0048980", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BM2M1YTJiMzAtMTM2Zi00MTAwLWE5MDItMDk2NTM2Y2M3Nzk5XkEyXkFqcGdeQXVyNzgzODI1OTE@._V1_SX300.jpg" }, { "Title": "One Piece Film: Red", "Year": "2022", "imdbID": "tt16183464", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BODY4OWM5M2UtM2Y1Yi00YjAyLTlhMDktMDkzZjFmMjI5MmI5XkEyXkFqcGdeQXVyMTA1NjQyNjkw._V1_SX300.jpg" }, { "Title": "Red Dog", "Year": "2011", "imdbID": "tt0803061", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMzM3NTE2NjY5M15BMl5BanBnXkFtZTcwMTY0MzUwNg@@._V1_SX300.jpg" }, { "Title": "Red Corner", "Year": "1997", "imdbID": "tt0119994", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMzE0MjU5NzQxNV5BMl5BanBnXkFtZTcwMzQzNzU2NA@@._V1_SX300.jpg" }, { "Title": "Born Into Brothels: Calcutta's Red Light Kids", "Year": "2004", "imdbID": "tt0388789", "Type": "movie", "Poster": "https://m.media-amazon.com/images/M/MV5BMTY0Nzc4NDEwNl5BMl5BanBnXkFtZTcwMjMyNzcyMQ@@._V1_SX300.jpg" }]]
                              setSearchResults(demoData[1]);
                              setSearchLoadingComplete(true);
                              setSearchLoadingStarted(false);
                         }, 5000);*/

                         axios.get(
                              `/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`
                         ).then((res: typeof ISearchImdb) => {
                              if (res.data[0] === "ERROR") {
                                   alert(`The error ${res.data[1]} occurred while  searching IMDB`);
                              } else {
                                   setIMDBSearchResults(res.data[1]);
                                   setSearchLoadingComplete(true);
                                   setSearchLoadingStarted(false);
                              }
                         }).catch((err: Error) => {
                              alert(`The error ${err.message} occurred while searching IMDB`);
                         });
                    }, 1000);

                    break;
          }
     }, [searchSection, searchTerm]);

     return (
          <div className="modal zIndex">
               <div className={`customBackgroundColor modal-content ${searchLoadingComplete === true ? "" : "customModalHeight"}`}>
                    {searchLoadingStarted &&
                         <>
                              <div className="card foregroundColor rightAligned customCloseButton searchMarginTop">
                                   <span className="clickable closeButton" onClick={closeSearch}>
                                        X
                                   </span>
                              </div>
                              <div className="spinner-custom">
                                   <div className="foregroundColor spinner-label">Loading</div>
                                   <div className="spinner"></div>
                              </div>
                         </>
                    }

                    <div className="container searchHeader sticky">
                         {!searchLoadingStarted &&
                              <div className="foregroundColor" style={{ marginBottom: "20px" }}>
                                   <div className='customWidth flex'>
                                        <div className="searchLabel textLabel">Section</div>

                                        <select className="customBorderRadius leftMargin" value={searchSection} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchSection(event.target.value)}>
                                        {Object.keys(searchSectionTypes).map((searchSectionType: any, index: number) => {
                                                  return (
                                                       <option key={index} value={searchSectionType}>
                                                            {searchSectionTypes[searchSectionType]}
                                                       </option>
                                                  );
                                             })}
                                        </select>
                                   </div>
                              </div>
                         }

                         <div className="cards searchHeader">
                              {!searchLoadingStarted &&
                                   <>
                                        <div className="card leftMargin searchLabel textLabel">Search</div>
                                        <div className="card leftMargin searchMarginTop unsetcardwidth">
                                             {/* Credit to https://codepen.io/menelaosly/pen/rZddyb */}
                                             <div className="searchContainer">
                                                  <input
                                                       type="search"
                                                       placeholder="e.g. Anchorman or The Office"
                                                       value={searchTerm}
                                                       autoFocus
                                                       className="searchInput"
                                                       onChange={(event) => setSearchTerm(event.target.value)}
                                                  />
                                                  {searchTerm === "" &&
                                                       <i className="fa fa-search"></i>
                                                  }
                                                  <br /><br />
                                             </div>
                                        </div>

                                        <div className="card foregroundColor rightAligned customCloseButton searchMarginTop">
                                             <span className="clickable closeButton" onClick={closeSearch}>
                                                  X
                                             </span>
                                        </div>
                                   </>
                              }
                         </div>
                    </div>

                    {!searchLoadingStarted &&
                         <table className="datagrid">
                              <tbody className="data watchList">
                                   {searchSection === searchSectionTypes.IMDB &&
                                        <>
                                             {!searchLoadingStarted && searchLoadingComplete && imdbSearchResults && imdbSearchResults.length > 0 &&
                                                  imdbSearchResults.map((currentResult: typeof ISearchImdb, index: number) => {
                                                       return (
                                                            <tr key={index}>
                                                                 <td className="row">
                                                                      <span className="searchResult">
                                                                           <span className="addSearchResultIcon foregroundColor" onClick={() => addSearchResultClickHandler(index)}>{AddIconComponent}</span>

                                                                           {currentResult.Poster !== "N/A" && (
                                                                                <>
                                                                                     <Image width="100" height="125" className="searchResultPoster" src={currentResult.Poster} alt={currentResult.Title} />

                                                                                     <span className="textLabel">
                                                                                          {currentResult.Title} ({currentResult.Year})
                                                                                     </span>
                                                                                </>
                                                                           )}

                                                                           {currentResult.Poster === "N/A" && (
                                                                                <>
                                                                                     <span className="textLabel">
                                                                                          {currentResult.Title} ({currentResult.Year})
                                                                                     </span>

                                                                                     <span className="searchResultPoster">broken{BrokenImageIconComponent}</span>
                                                                                </>
                                                                           )}
                                                                      </span>
                                                                 </td>
                                                            </tr>
                                                       );
                                                  })
                                             }
                                        </>
                                   }

                                   {searchSectionTypes.WatchList && watchListSearchResults && watchListSearchResults.length > 0 &&
                                        watchListSearchResults.map(
                                             (currentResult: typeof IWatchList, index: number) => {
                                                  return (
                                                       <tr key={index}>
                                                            <td className="row">
                                                                 <span className="clickable searchResult" onClick={(event) => openWatchListDetailClickHandler(currentResult.WatchListID)}>
                                                                      {currentResult?.WatchListItem?.IMDB_Poster !== null && !currentResult?.WatchListItem?.IMDB_Poster_Error && (
                                                                           // The poster column
                                                                           <div className="foregroundColor">
                                                                                <Image
                                                                                     className="searchResultPoster"
                                                                                     src={currentResult?.WatchListItem?.IMDB_Poster}
                                                                                     alt={currentResult?.WatchListItem?.IMDB_Poster}
                                                                                     width="40"
                                                                                     height="40"
                                                                                     onError={() => showDefaultSrcWatchList(currentResult?.WatchListID)}
                                                                                />
                                                                           </div>
                                                                      )}

                                                                      {(currentResult.IMDB_Poster_Error || currentResult.IMDB_Poster === null) && (
                                                                           // The poster column
                                                                           <div className="brokenImage foregroundColor">
                                                                                broken
                                                                                {BrokenImageIconComponent}
                                                                           </div>
                                                                      )}

                                                                      <div className="whitespace-nowrap px-3 py-5 text-sm flex-1">
                                                                           <span className="textLabel">
                                                                                {currentResult?.WatchListItem?.WatchListItemName}
                                                                           </span>
                                                                      </div>
                                                                 </span>
                                                            </td>
                                                       </tr>
                                                  )
                                             })
                                   }

                                   {searchSectionTypes.WatchListItems && watchListItemsSearchResults && watchListItemsSearchResults.length > 0 &&
                                        watchListItemsSearchResults.map(
                                             (currentResult: typeof IWatchListItem, index: number) => {
                                                  return (
                                                       <tr key={index}>
                                                            <td className="row">
                                                                 <span className="clickable searchResult" onClick={(event) => openWatchListItemDetailClickHandler(currentResult.WatchListItemID)}>
                                                                      {currentResult.IMDB_Poster !== null && !currentResult.IMDB_Poster_Error && (
                                                                           // The poster column
                                                                           <div className="foregroundColor">
                                                                                <Image
                                                                                     className="searchResultPoster"
                                                                                     src={currentResult.IMDB_Poster}
                                                                                     alt={currentResult.IMDB_Poster}
                                                                                     width="40"
                                                                                     height="40"
                                                                                     onError={() => showDefaultSrcWatchListItems(currentResult?.WatchListItemID)}
                                                                                />
                                                                           </div>
                                                                      )}

                                                                      {(currentResult.IMDB_Poster_Error || currentResult.IMDB_Poster === null) && (
                                                                           // The poster column
                                                                           <div className="brokenImage foregroundColor">
                                                                                broken
                                                                                {BrokenImageIconComponent}
                                                                           </div>
                                                                      )}

                                                                      <div className="whitespace-nowrap px-3 py-5 text-sm flex-1">
                                                                           <span className="textLabel">
                                                                                {currentResult.WatchListItemName}
                                                                           </span>
                                                                      </div>
                                                                 </span>
                                                            </td>
                                                       </tr>
                                                  )
                                             })
                                   }
                              </tbody>
                         </table>
                    }
               </div>
          </div >
     );
}