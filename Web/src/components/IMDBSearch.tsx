const axios = require("axios");
const exact = require ("prop-types-exact");
const GridEventListener = require("@mui/x-data-grid").GridEventListener;
const IimdbSearch = require("../interfaces/IimdbSearch");
const MuiIcon = require("@mui/icons-material").default;
const PropTypes = require("prop-types");
const React = require("react");
const useState = require("react").useState;

const IMDBSearch = ({ AddIcon, autoAdd, backendURL, BrokenImageIcon, setNewWatchListItemDtlID, setWatchListItemsLoadingStarted, setWatchListItemsLoadingComplete }
     :
     {
          AddIcon: typeof MuiIcon,
          autoAdd: boolean,
          backendURL: string,
          BrokenImageIcon: typeof MuiIcon,
          setNewWatchListItemDtlID: (arg0: number) => void,
          setWatchListItemsLoadingStarted: (arg0: boolean) => void,
          setWatchListItemsLoadingComplete: (arg0: boolean) => void
     }) => {
          const [searchResults, setSearchResults] = useState({});
          const [searchTerm, setSearchTerm] = useState("");

          const addSearchResultClickHandler = (index: number) => {
               let itemType = 0;``

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

               let paramStr = `${backendURL}/AddWatchListItem?WatchListItemName=${searchResults[index].Title}&WatchListTypeID=${itemType}`;

               paramStr += `&IMDB_URL=https://www.imdb.com/title/${searchResults[index].imdbID}/`;

               paramStr += `&IMDB_Poster=${searchResults[index].Poster}`;

               axios.put(paramStr)
               .then((res: typeof IimdbSearch) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while  adding the search result`);
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
                    }
               })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the search result`);
               });
          };

          const onKeyUpHandler = (event: typeof GridEventListener) => {
               if (event.key === "Enter") {
                    searchTermHandler();
               }
          };

          const searchTermHandler = () => {
               if (searchTerm === "") {
                    alert("Please enter a search term");
                    return;
               }

               axios.get(`${backendURL}/SearchIMDB?SearchTerm=${searchTerm}`)
               .then((res: typeof IimdbSearch) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while  searching IMDB`);
                    } else {
                         //  Trap IMDB errors
                         const imdbResponse = JSON.parse(res.data[1]);

                         if (imdbResponse.Response === "False") {
                              alert(imdbResponse.Error);
                              return;
                         } else {
                              const set1 = JSON.parse(res.data[1]).Search;

                              if (typeof JSON.parse(res.data[2]).Search !== "undefined") {
                                   const set2 = JSON.parse(res.data[2]).Search;
                                   set1.push(...set2);
                              }

                              setSearchResults(set1);
                         }
                    }
               })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while searching IMDB`);
               });
          };

          return (
               <>
                    <span className="imdbSearch">
                         <input className="inputStyle" autoFocus={true} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyUp={(event) => onKeyUpHandler(event)} />
                    </span>

                    <table className="datagrid">
                         <tbody className="data watchList">
                              {searchResults.length > 0 &&
                                   searchResults.map((currentResult: typeof IimdbSearch, index: number) => {
                                        return (
                                             <tr key={index}>
                                                  <td className="row">
                                                       <span className="searchResult">
                                                            <span className="addSearchResultIcon" onClick={(event) => addSearchResultClickHandler(index)}>{AddIcon}</span>
                                                            
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
                                                                          
                                                                      <img className="searchResultPoster" src={BrokenImageIcon} alt={currentResult.Title} />
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
               </>
          );
};

IMDBSearch.propTypes = exact({
     AddIcon: PropTypes.object.isRequired,
     autoAdd: PropTypes.bool.isRequired,
     backendURL: PropTypes.string.isRequired,
     setNewWatchListItemDtlID: PropTypes.func.isRequired,
     setWatchListItemsLoadingStarted: PropTypes.func.isRequired,
     setWatchListItemsLoadingComplete: PropTypes.func.isRequired,
});

export default IMDBSearch;