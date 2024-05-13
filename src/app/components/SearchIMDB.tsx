"use client"

const axios = require("axios");
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const React = require("react");
const useContext = require("react").useContext;
const useRouter = require("next/navigation").useRouter;
const useState = require("react").useState;
const ISearchImdb = require("../interfaces/ISearchImdb");
const IWatchListItem = require("../interfaces/IWatchListItem");

import { DataContext, DataContextType } from "../data-context";

export default function SearchIMDB() {
     const {
          AddIconComponent,
          autoAdd,
          BrokenImageIconComponent,
          EditIconComponent,
          searchCount,
          setNewWatchListItemDtlID,
          setSearchVisible,
          setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete,
          watchListItems
     } = useContext(DataContext) as DataContextType

     const [includeIMDB, setIncludeIMDB] = useState(false);
     const [searchResults, setSearchResults] = useState({});
     const [searchSubmitted, setSearchSubmitted] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
     const [watchlistSearchResults, setWatchlistSearchResults] = useState({});

     const router = useRouter();

     const addExistingResultClickHandler = (watchListItemID: number) => {
          router.push(`/WatchListItems/Dtl?WatchListItemID=${watchListItemID}`);

          closeSearch();
     }

     const addSearchResultClickHandler = (index: number) => {
          let itemType = 0; ``

          if (searchResults[index].Type === "movie") {
               itemType = 1;
          } else if (searchResults[index].Type === "series") {
               itemType = 2;
          } else {
               itemType = 3;
          }

          const confirmAdd = confirm("Add IMDB search result ?");

          if (!confirmAdd) {
               return;
          }

          let paramStr = `/api/AddWatchListItem?WatchListItemName=${searchResults[index].Title}&WatchListTypeID=${itemType}`;

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${searchResults[index].ImdbID}/`;

          paramStr += `&IMDB_Poster=${searchResults[index].Poster}`;

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
                         const newSearchResults = Object.assign([], searchResults);
                         newSearchResults.splice(index, 1);
                         setSearchResults(newSearchResults);

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

     const includeIMDBSearchChangeHandler = async (event: any) => {
          setIncludeIMDB(event.target.checked);

          axios
               .get(
                    `/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`
               )
               .then((res: typeof ISearchImdb) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while  searching IMDB`);
                    } else {
                         setSearchResults(res.data[1]);
                         setSearchSubmitted(true);
                    }
               })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while searching IMDB`);
               });
     }

     const onKeyUpHandler = (event: typeof GridEventListener) => {
          setTimeout(() => {
               searchTermHandler();

               if (includeIMDB) {
                    includeIMDBSearchChangeHandler(event);
               }
          }, 1000); // Delay of 1000 milliseconds (1 second)
     };

     const searchTermHandler = () => {
          if (searchTerm === "") {
               //alert("Please enter a search term");
               return;
          }

          // Search existing WatchListItems
          const newWatchListItems: typeof IWatchListItem = Object.assign([], watchListItems);

          const currentWatchListItemsResult = newWatchListItems?.filter((currentWatchListItem: typeof IWatchListItem) => {
               return currentWatchListItem.WatchListItemName.toString().toUpperCase().includes(String(searchTerm).toUpperCase());
          });

          if (currentWatchListItemsResult.length > 0) {
               setWatchlistSearchResults(currentWatchListItemsResult);
          }
     };

     return (
          <div className="modal">
               <div className={`customBackgroundColor modal-content ${searchSubmitted === true ? "" : "customModalHeight"}`}>
                    <div className="container searchHeader sticky">
                         <div className="foregroundColor margin-left" style={{ marginBottom: "20px" }}>
                              &nbsp;&nbsp;(include IMDB&nbsp;&nbsp;<input type="checkbox" checked={includeIMDB} onChange={(event) => includeIMDBSearchChangeHandler(event)} />)
                         </div>

                         <div className="cards searchHeader">
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
                                             onKeyUp={(event) => onKeyUpHandler(event)}
                                        />
                                        <i className="fa fa-search"></i>
                                        <br /><br />
                                   </div>
                              </div>

                              <div className="card foregroundColor rightAligned customCloseButton searchMarginTop">
                                   <span className="clickable closeButton" onClick={closeSearch}>
                                        X
                                   </span>
                              </div>
                         </div>
                    </div>

                    <table className="datagrid">
                         <tbody className="data watchList">
                              {searchResults.length > 0 &&
                                   searchResults.map((currentResult: typeof ISearchImdb, index: number) => {
                                        return (
                                             <tr key={index}>
                                                  <td className="row">
                                                       <span className="searchResult">
                                                            <span className="addSearchResultIcon foregroundColor" onClick={() => addSearchResultClickHandler(index)}>{AddIconComponent}</span>

                                                            {currentResult.Poster !== "N/A" && (
                                                                 <>
                                                                      <img className="searchResultPoster" src={currentResult.Poster} alt={currentResult.Title} />

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

                                                                      <div className="searchResultPoster">{BrokenImageIconComponent}</div>

                                                                      {/*<img className="searchResultPoster" alt={currentResult.Title}>{BrokenImageIconComponent}</img>*/}
                                                                 </>
                                                            )}
                                                       </span>
                                                  </td>
                                             </tr>
                                        );
                                   })
                              }

                              {watchlistSearchResults && watchlistSearchResults.length > 0 &&
                                   watchlistSearchResults.map(
                                        (currentResult: typeof IWatchListItem, index: number) => {
                                             return (
                                                  <tr key={index}>
                                                       {/*<td className="row">
                                                            <span className="searchResult">
                                                                 <span
                                                                      className="addSearchResultIcon"
                                                                      onClick={(event) =>
                                                                           addExistingResultClickHandler(currentResult.WatchListItemID)
                                                                      }
                                                                 >
                                                                      <button>
                                                                           {EditIconComponent}
                                                                      </button>
                                                                 </span>
                                                            </span>
                                                       </td>*/}

                                                       <td className="row">
                                                            <span className="clickable searchResult" onClick={(event) => addExistingResultClickHandler(currentResult.WatchListItemID) }>
                                                                 {currentResult.IMDB_Poster && (
                                                                      // The poster column
                                                                      <div>
                                                                           <img
                                                                                className="searchResultPoster"
                                                                                src={currentResult.IMDB_Poster}
                                                                                alt={currentResult.WatchListItemName}
                                                                           />
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
               </div>
          </div >
     );
}