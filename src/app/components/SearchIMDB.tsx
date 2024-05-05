"use client"

const axios = require("axios");
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const React = require("react");
const useContext = require("react").useContext;
const useState = require("react").useState;
const ISearchImdb = require("../interfaces/ISearchImdb");

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
     } = useContext(DataContext) as DataContextType

     const [searchResults, setSearchResults] = useState({});
     const [searchSubmitted, setSearchSubmitted] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");

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

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${searchResults[index].imdbID}/`;

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

     const onKeyUpHandler = (event: typeof GridEventListener) => {
          if (event.key === "Enter") {
               searchTermHandler();
          }
     };

     const searchTermHandler = () => {
          if (searchTerm === "") {
               //alert("Please enter a search term");
               return;
          }

          axios.get(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`)
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
     };

     return (
          <div className="modal">
               <div className={`modal-content ${searchSubmitted === true ? "" : "customModalHeight"}`}>
                    <div className="container searchHeader sticky">
                         <div className="cards searchHeader">
                              <div className="card leftMargin searchLabel">Search</div>
                              <div className="card leftMargin searchMarginTop unsetcardwidth">
                                   {/* Credit to https://codepen.io/menelaosly/pen/rZddyb */}
                                   <div className="searchContainer">
                                        <input type="search" autoFocus className="searchInput" onChange={(event) => setSearchTerm(event.target.value)} onKeyUp={(event) => onKeyUpHandler(event)}/>
                                        <i className="fa fa-search"></i>
                                   </div>
                                   {/*<input className="customBorderRadius customWidth" autoFocus={true} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyUp={(event) => onKeyUpHandler(event)} />*/}
                              </div>

                              <div className="card rightAligned customCloseButton searchMarginTop">
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
                                                            <span className="addSearchResultIcon" onClick={() => addSearchResultClickHandler(index)}>{AddIconComponent}</span>

                                                            {currentResult.Poster !== "N/A" && (
                                                                 <>
                                                                      <span className="textLabel">
                                                                           {currentResult.Title} ({currentResult.Year})
                                                                      </span>

                                                                      <img className="searchResultPoster" src={currentResult.Poster} alt={currentResult.Title} />
                                                                 </>
                                                            )}

                                                            {currentResult.Poster === "N/A" && (
                                                                 <>
                                                                      <span className="textLabel">
                                                                           {currentResult.Title} ({currentResult.Year})
                                                                      </span>

                                                                      <img className="searchResultPoster" src={BrokenImageIconComponent} alt={currentResult.Title} />
                                                                 </>
                                                            )}
                                                       </span>
                                                  </td>
                                             </tr>
                                        );
                                   })
                              }
                         </tbody>
                    </table>
               </div>
          </div >
     );
}