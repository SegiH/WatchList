import axios, { AxiosResponse } from "axios";
import Image from 'next/image';
import ISearchImdb from "../interfaces/ISearchImdb";

import { useRouter } from 'next/navigation';
import React, { useContext, useState } from "react";

import { APIStatus, SearchIMDBContext, SearchIMDBContextType } from "../data-context";

export default function SearchIMDB() {
     const {
          AddIconComponent, autoAdd, BrokenImageIconComponent, darkMode, searchCount, SearchIconComponent, setIsAdding, setSearchCount, setSearchModalVisible
     } = useContext(SearchIMDBContext) as SearchIMDBContextType

     const [imdbSearchResults, setIMDBSearchResults] = useState<ISearchImdb[]>([]);
     const [searchLoadingCheck, setSearchLoadingCheck] = useState(APIStatus.Idle);
     const [searchTerm, setSearchTerm] = useState("");

     const searchCountOptions = {
          "10 results": 1,
          "20 results": 2,
          "30 results": 3,
          "40 results": 4,
          "50 results": 5
     };

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
               .then((res: AxiosResponse<ISearchImdb>) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while adding the search result`);
                    } else if (res.data[0] === "ERROR-ALREADY-EXISTS") {
                         alert(res.data[1]);
                    } else {
                         if (autoAdd) {
                              setIsAdding(true);
                              router.push(`/WatchList/Dtl?WatchListItemID=${res.data[1]}`);
                         }

                         // Remove this item from the the search results since its been added
                         const newSearchResults = Object.assign([], imdbSearchResults);
                         newSearchResults.splice(index, 1);
                         setIMDBSearchResults(newSearchResults);

                         setSearchModalVisible(false);
                    }
               })
               .catch((err: Error) => {
                    alert(`The error ${err.message} occurred while adding the search result`);
               });
     };

     const closeSearch = async () => {
          setSearchModalVisible(false);
     };

     const handleKeypress = e => {
          if (e.keyCode === 13) {
               searchIMDB();
          }
     };

     const searchIMDB = () => {
          if (searchTerm === "") {
               setIMDBSearchResults([]);

               alert("Please enter a search term");

               return;
          }

          // Use this to test IMDB search using demo data instead of hitting the API
          //setTimeout(() => {
          //     const demoData = require("../demo/index").demoIMDBSearchResults;

          //     setIMDBSearchResults(demoData[1]);
          //     setSearchLoadingCheck(APIStatus.Success);
          //}, 5000);

          axios.get(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`)
               .then((res: AxiosResponse<ISearchImdb>) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while searching IMDB`);
                    } else {
                         setIMDBSearchResults(res.data[1]);
                         setSearchLoadingCheck(APIStatus.Success);
                    }
               }).catch((err: Error) => {
                    alert(`The error ${err} occurred while searching IMDB`);
               });
     }

     return (
          <div className={`modal zIndex ${!darkMode ? " lightMode" : " darkMode"}`}>
               <div className={`modal-content ${searchLoadingCheck === APIStatus.Success ? "" : "customModalHeight"}`}>
                    {searchLoadingCheck === APIStatus.Loading &&
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
                         {searchLoadingCheck === APIStatus.Success &&
                              <div style={{ marginBottom: "20px" }}>
                                   <div className='customWidth flex'>
                                        <div className="leftMargin searchLabel textLabel">Count</div>

                                        <select className="customBorderRadius leftMargin" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value, 10))}>
                                             {Object.keys(searchCountOptions).map((searchCount: string, index: number) => {
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
                              {searchLoadingCheck === APIStatus.Idle &&
                                   <>
                                        <div className={`card leftMargin searchLabel textLabel${!darkMode ? " lightMode" : " darkMode"}`}>Search</div>
                                        <span className={`card leftMargin searchMarginTop unsetcardwidth${!darkMode ? " lightMode" : " darkMode"}`}>
                                             <span className={`clickable searchIcon${darkMode ? " lightMode" : " darkMode"}`} onClick={searchIMDB}>
                                                  {SearchIconComponent}

                                                  {searchTerm === "" &&
                                                       <i className="fa fa-search"></i>
                                                  }
                                             </span>

                                             {/* Credit to https://codepen.io/menelaosly/pen/rZddyb */}
                                             <span className={`searchContainer`}>
                                                  <input
                                                       type="search"
                                                       placeholder="e.g. Anchorman or The Office"
                                                       value={searchTerm}
                                                       autoFocus
                                                       className={`searchInput`}
                                                       onChange={(event) => setSearchTerm(event.target.value)}
                                                       onKeyUp={handleKeypress}
                                                  />
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

                    {searchLoadingCheck === APIStatus.Success &&
                         <table className="datagrid">
                              <tbody className="data watchList">
                                   {imdbSearchResults && imdbSearchResults.length > 0 &&
                                        imdbSearchResults.map((currentResult: ISearchImdb, index: number) => {
                                             return (
                                                  <React.Fragment key={index}>
                                                       {typeof currentResult.Poster !== "undefined" && currentResult.Poster !== null && currentResult.Poster !== "" && currentResult.Poster !== "N/A" &&
                                                            <tr>
                                                                 <td className="row">
                                                                      <span className="searchResult">
                                                                           <span className="addSearchResultIcon" onClick={() => addIMDBSearchResultClickHandler(index)}>{AddIconComponent}</span>

                                                                           <Image width="100" height="125" className="searchResultPoster" src={currentResult.Poster} alt={currentResult.Title} />

                                                                           <span className="textLabel">
                                                                                {currentResult.Title} ({currentResult.Year})
                                                                           </span>

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
                                                       }
                                                  </React.Fragment>
                                             );
                                        })
                                   }
                              </tbody>
                         </table>
                    }

                    {searchLoadingCheck === APIStatus.Loading &&
                         <div className="bouncing-loader">
                              <span className="bouncing-loader-text">Loading</span>
                              <div className="bubble"></div>
                              <div className="bubble"></div>
                              <div className="bubble"></div>
                         </div>
                    }
               </div>
          </div >
     );
}