import Image from 'next/image';
import ISearchImdb from "../interfaces/ISearchImdb";

import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";

import { APIStatus, SearchIMDBContext } from "../context";
import { SearchIMDBContextType } from "../contexts/SearchIMDBContextType";

export default function SearchIMDB() {
     const {
          AddIconComponent, autoAdd, BrokenImageIconComponent, darkMode, searchCount, SearchIconComponent, searchTerm, setIsAdding, setSearchCount, setSearchModalVisible, setSearchTerm
     } = useContext(SearchIMDBContext) as SearchIMDBContextType

     const [imdbSearchResults, setIMDBSearchResults] = useState<ISearchImdb[]>([]);
     const [searchLoadingCheck, setSearchLoadingCheck] = useState(APIStatus.Idle);
     const [IMDBSearchTerm, setIMDBSearchTerm] = useState("");

     const searchCountOptions = {
          "10 results": 1,
          "20 results": 2,
          "30 results": 3,
          "40 results": 4,
          "50 results": 5
     };

     const router = useRouter();

     const addIMDBSearchResultClickHandler = async (index: number) => {
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

          try {
               const searchIMDBResponse = await fetch(paramStr, { method: 'PUT', credentials: 'include' });

               const searchIMDBResult = await searchIMDBResponse.json();

               if (searchIMDBResult[0] === "ERROR") {
                    alert(`The error ${searchIMDBResult[1]} occurred while adding the search result`);
               } else if (searchIMDBResult[0] === "ERROR-ALREADY-EXISTS") {
                    alert(searchIMDBResult[1]);
               } else {
                    if (autoAdd) {
                         setIsAdding(true);
                         router.push(`/WatchList/Dtl?WatchListItemID=${searchIMDBResult[1]}`);
                    }

                    setIMDBSearchResults(imdbSearchResults);

                    setSearchModalVisible(false);
               }
          } catch (e: any) {
               alert(e.message);
          }
     };

     const closeSearch = async () => {
          setSearchModalVisible(false);
     };

     const handleKeypress = e => {
          if (e.keyCode === 13) {
               searchIMDB();
          }
     };

     const searchIMDB = async () => {
          if (IMDBSearchTerm === "") {
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

          try {
               const searchIMDBResponse = await fetch(`/api/SearchIMDB?SearchTerm=${IMDBSearchTerm}&SearchCount=${searchCount}`, { credentials: 'include' });

               const searchIMDBResult = await searchIMDBResponse.json();

               if (searchIMDBResult[0] === "ERROR") {
                    alert(`The error ${searchIMDBResult[1]} occurred while searching IMDB`);
               } else {
                    setIMDBSearchResults(searchIMDBResult[1]);
                    setSearchLoadingCheck(APIStatus.Success);
               }
          } catch (e: any) {
               alert(e.message);
          }
     }

     useEffect(() => {
          if (searchTerm !== "") {
               setSearchTerm("");
               setIMDBSearchTerm(searchTerm);
          }
     }, []);

     useEffect(() => {
          if (IMDBSearchTerm !== "") {
               setSearchLoadingCheck(APIStatus.Loading);
               searchIMDB();
          }
     }, [IMDBSearchTerm]);

     return (
          <div className={`modal zIndex ${!darkMode ? " lightMode" : " darkMode"}`}>
               <div className={`modal-content ${searchLoadingCheck === APIStatus.Success ? "" : "customModalHeight"}`}>
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

                                        <div className="card rightAligned customCloseButton">
                                             <span className="clickable closeButton" onClick={closeSearch}>
                                                  X
                                             </span>
                                        </div>
                                   </div>
                              </div>
                         }

                         <div className="cards searchHeader">
                              {searchLoadingCheck === APIStatus.Idle && searchTerm ===  "" &&
                                   <>
                                        <div className={`card leftMargin searchLabel textLabel${!darkMode ? " lightMode" : " darkMode"}`}>Search</div>
                                        <span className={`card leftMargin searchMarginTop unsetcardwidth${!darkMode ? " lightMode" : " darkMode"}`}>
                                             <span className={`clickable searchIcon${darkMode ? " lightMode" : " darkMode"}`} onClick={searchIMDB}>
                                                  {SearchIconComponent}

                                                  {IMDBSearchTerm === "" &&
                                                       <i className="fa fa-search"></i>
                                                  }
                                             </span>

                                             {/* Credit to https://codepen.io/menelaosly/pen/rZddyb */}
                                             <span className={`searchContainer`}>
                                                  <input
                                                       type="search"
                                                       placeholder="e.g. Anchorman or The Office"
                                                       value={IMDBSearchTerm}
                                                       autoFocus
                                                       className={`searchInput`}
                                                       onChange={(event) => setIMDBSearchTerm(event.target.value)}
                                                       onKeyUp={handleKeypress}
                                                  />
                                             </span>
                                        </span>

                                        <div className="card rightAligned customCloseButton">
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

                                                                                     <span className="searchResultPoster">{BrokenImageIconComponent}</span>
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