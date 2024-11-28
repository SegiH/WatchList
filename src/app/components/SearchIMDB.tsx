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
          darkMode,
          imdbSearchEnabled,
          searchCount,
          SearchIconComponent,
          setIsAdding,
          setSearchCount,
          setSearchVisible,
          setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete,
          watchList,
          watchListItems
     } = useContext(DataContext) as DataContextType

     const [imdbSearchResults, setIMDBSearchResults] = useState([]);
     const [searchLoadingStarted, setSearchLoadingStarted] = useState(false);
     const [searchLoadingComplete, setSearchLoadingComplete] = useState(false);
     const [searchSection, setSearchSection] = useState("IMDB");
     const [searchTerm, setSearchTerm] = useState("");
     const [watchListSearchResults, setWatchListSearchResults] = useState([]);
     const [watchListItemsSearchResults, setWatchListItemsSearchResults] = useState([]);

     const searchCountOptions: any = {
          "10 results": 10,
          "20 results": 20,
          "30 results": 30,
          "40 results": 40,
          "50 results": 50
     };

     const searchSectionTypes = {
          WatchList: "WatchList",
          WatchListItems: "Items",
          IMDB: "IMDB"
     }

     const router = useRouter();

     const addIMDBSearchResultClickHandler = (index: number) => {
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

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${imdbSearchResults[index].imdbID}/`;

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
                              setIsAdding(true);
                              router.push(`/WatchList/Dtl?WatchListItemID=${res.data[1]}`);
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
          router.push(`/Items/Dtl?WatchListItemID=${watchListItemID}`);

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

     const searchIMDB = () => {
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
                         return currentWatchList?.WatchListItemName.toString().toUpperCase().includes(String(searchTerm).toUpperCase());
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
               case searchSectionTypes["IMDB"]: // This may or may not exist
                    if (searchTerm === "") {
                         setSearchLoadingStarted(true);
                    }

                    // Use this to test IMDB search using demo data instead of hitting the API
                    /*setTimeout(() => {
                         const demoData = require("../demo/index").demoIMDBSearchResults;

                         setIMDBSearchResults(demoData[1]);
                         setSearchLoadingComplete(true);
                         setSearchLoadingStarted(false);
                    }, 5000);*/

                    axios.get(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`)
                         .then((res: typeof ISearchImdb) => {
                              if (res.data[0] === "ERROR") {
                                   //alert(`The error ${res.data[1]} occurred while searching IMDB`);
                              } else {
                                   setIMDBSearchResults(res.data[1]);
                                   setSearchLoadingComplete(true);
                                   setSearchLoadingStarted(false);
                              }
                         }).catch((err: Error) => {
                              //alert(`The error ${err} occurred while searching IMDB`);
                         });

                    break;
          }
     }

     return (
          <div className={`modal zIndex ${!darkMode ? " lightMode" : " darkMode"}`}>
               <div className={`modal-content ${searchLoadingComplete === true ? "" : "customModalHeight"}`}>
                    {searchLoadingStarted &&
                         <>
                              <div className="card rightAligned customCloseButton searchMarginTop">
                                   <span className="clickable closeButton" onClick={closeSearch}>
                                        X
                                   </span>
                              </div>

                              <div className="spinner-custom">
                                   <div className="spinner-label">Loading</div>
                                   <div className="spinner"></div>
                              </div>
                         </>
                    }

                    <div className="container searchHeader sticky">
                         {!searchLoadingStarted &&
                              <div style={{ marginBottom: "20px" }}>
                                   <div className='customWidth flex'>
                                        <div className="leftMargin searchLabel textLabel">Section</div>

                                        <select className="customBorderRadius leftMargin" value={searchSection} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchSection(event.target.value)}>
                                             {Object.keys(searchSectionTypes)
                                                  .filter((searchSectionType: any, index: number) => {
                                                       return searchSectionType !== "IMDB" || (searchSectionType === "IMDB" && imdbSearchEnabled)
                                                  })
                                                  .map((searchSectionType: any, index: number) => {
                                                       return (
                                                            <option key={index} value={searchSectionType}>
                                                                 {searchSectionTypes[searchSectionType]}
                                                            </option>
                                                       );
                                                  })}
                                        </select>

                                        <div className="leftMargin searchLabel textLabel">Count</div>

                                        <select className="customBorderRadius leftMargin" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value, 10))}>
                                             {Object.keys(searchCountOptions).map((searchCount: any, index: number) => {
                                                  return (
                                                       <option key={index} value={searchCountOptions[searchCount]}>
                                                            {searchCount}
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
                                        <span className="card leftMargin searchMarginTop unsetcardwidth">
                                             {/* Credit to https://codepen.io/menelaosly/pen/rZddyb */}
                                             <span className="searchContainer">
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
                                                  <span className={`clickable width50 ${!darkMode ? " darkMode" : " lightMode"}`} onClick={searchIMDB}>
                                                       {SearchIconComponent}
                                                  </span>
                                                  <br /><br />
                                             </span>
                                        </span>

                                        <div className="card rightAligned customCloseButton searchMarginTop">
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
                                                                           <span className="addSearchResultIcon" onClick={() => addIMDBSearchResultClickHandler(index)}>{AddIconComponent}</span>

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
                                                                 <span className="clickable searchResult" onClick={() => openWatchListDetailClickHandler(currentResult.WatchListID)}>
                                                                      {currentResult?.IMDB_Poster !== null && !currentResult?.IMDB_Poster_Error && (
                                                                           // The poster column
                                                                           <div>
                                                                                <Image
                                                                                     className="searchResultPoster"
                                                                                     src={currentResult?.IMDB_Poster}
                                                                                     alt={currentResult?.IMDB_Poster}
                                                                                     width="40"
                                                                                     height="40"
                                                                                     onError={() => showDefaultSrcWatchList(currentResult?.WatchListID)}
                                                                                />
                                                                           </div>
                                                                      )}

                                                                      {(currentResult.IMDB_Poster_Error || currentResult.IMDB_Poster === null) && (
                                                                           // The poster column
                                                                           <div className="brokenImage">
                                                                                broken
                                                                                {BrokenImageIconComponent}
                                                                           </div>
                                                                      )}

                                                                      <div className="whitespace-nowrap px-3 py-5 text-sm flex-1">
                                                                           <span className="textLabel">
                                                                                {currentResult?.WatchListItemName}
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
                                                                           <div>
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
                                                                           <div className="brokenImage">
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