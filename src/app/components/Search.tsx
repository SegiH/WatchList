"use client"

import axios, { AxiosResponse } from "axios";
import Image from 'next/image';
import ISearchImdb from "../interfaces/ISearchImdb";
import IWatchList from "../interfaces/IWatchList";
import IWatchListItem from "../interfaces/IWatchListItem";

import { useRouter } from 'next/navigation';
import React, { useContext, useState } from "react";

import { DataContext, DataContextType } from "../data-context";
import WatchListCard from "../WatchList/WatchListCard";
import WatchListItemCard from "../Items/WatchListItemCard";

export default function Search() {
     const {
          AddIconComponent,
          autoAdd,
          BrokenImageIconComponent,
          darkMode,
          searchCount,
          SearchIconComponent,
          setIsAdding,
          setSearchCount,
          setSearchModalVisible,
          setWatchListItemsLoadingStarted,
          setWatchListItemsLoadingComplete
     } = useContext(DataContext) as DataContextType

     const [imdbSearchResults, setIMDBSearchResults] = useState<ISearchImdb[]>([]);
     const [searchLoadingStarted, setSearchLoadingStarted] = useState(false);
     const [searchLoadingComplete, setSearchLoadingComplete] = useState(false);
     const [searchSection, setSearchSection] = useState("IMDB");
     const [searchTerm, setSearchTerm] = useState("");
     const [watchListSearchResults, setWatchListSearchResults] = useState<IWatchList[]>([]);
     const [watchListItemsSearchResults, setWatchListItemsSearchResults] = useState<IWatchListItem[]>([]);

     const searchCountOptions = {
          "10 results": 1,
          "20 results": 2,
          "30 results": 3,
          "40 results": 4,
          "50 results": 5
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
               .then((res: AxiosResponse<ISearchImdb>) => {
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
               setWatchListSearchResults([]);
               setWatchListItemsSearchResults([]);

               alert("Please enter a search term");

               return;
          }

          // Use this to test IMDB search using demo data instead of hitting the API
          //setTimeout(() => {
          //     const demoData = require("../demo/index").demoIMDBSearchResults;

          //     setIMDBSearchResults(demoData[1]);
          //     setSearchLoadingComplete(true);
          //     setSearchLoadingStarted(false);
          //}, 5000);

          axios.get(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`)
               .then((res: AxiosResponse<ISearchImdb>) => {
                    if (res.data[0] === "ERROR") {
                         alert(`The error ${res.data[1]} occurred while searching IMDB`);
                    } else {
                         setIMDBSearchResults(res.data[1]);
                         setSearchLoadingComplete(true);
                         setSearchLoadingStarted(false);
                    }
               }).catch((err: Error) => {
                    alert(`The error ${err} occurred while searching IMDB`);
               });

          /*switch (searchSection) {
               case searchSectionTypes.WatchList:
                    // Search existing WatchList
                    const newWatchList: IWatchList[] = Object.assign([], watchList) as IWatchList[];

                    const currentWatchListResults = newWatchList?.filter((currentWatchList: IWatchList) => {
                         return currentWatchList?.WatchListItemName.toString().toUpperCase().includes(String(searchTerm).toUpperCase());
                    });

                    if (currentWatchListResults.length > 0) {
                         setWatchListSearchResults(currentWatchListResults);
                    }

                    break;
               case searchSectionTypes.WatchListItems:
                    // Search existing WatchList Items
                    const newWatchListItems: IWatchListItem[] = Object.assign([], watchListItems) as IWatchListItem[];

                    const currentWatchListItemsResult = newWatchListItems?.filter((currentWatchListItems: IWatchListItem) => {
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
                    //setTimeout(() => {
                    //     const demoData = require("../demo/index").demoIMDBSearchResults;

                    //     setIMDBSearchResults(demoData[1]);
                    //     setSearchLoadingComplete(true);
                    //     setSearchLoadingStarted(false);
                    //}, 5000);

                    axios.get(`/api/SearchIMDB?SearchTerm=${searchTerm}&SearchCount=${searchCount}`)
                         .then((res: AxiosResponse<ISearchImdb>) => {
                              if (res.data[0] === "ERROR") {
                                   alert(`The error ${res.data[1]} occurred while searching IMDB`);
                              } else {
                                   setIMDBSearchResults(res.data[1]);
                                   setSearchLoadingComplete(true);
                                   setSearchLoadingStarted(false);
                              }
                         }).catch((err: Error) => {
                              alert(`The error ${err} occurred while searching IMDB`);
                         });

                    break;
          }*/
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
                                        {/*{((searchSection === "WatchList" && activeRoute === "WatchList" && filteredWatchList.length > 0) || (searchSection === "Items" && activeRoute === "Items" && filteredWatchListItems.length > 0) || (activeRoute !== "WatchList" && activeRoute !== "Items"))}
                                        <div className="leftMargin searchLabel textLabel">Section</div>

                                        <select className="customBorderRadius leftMargin" value={searchSection} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchSection(event.target.value)}>
                                             {Object.keys(searchSectionTypes)
                                                  .filter((searchSectionType: string) => {
                                                       return searchSectionType !== "IMDB" || (searchSectionType === "IMDB" && imdbSearchEnabled)
                                                  })
                                                  .map((searchSectionType: string, index: number) => {
                                                       return (
                                                            <option key={index} value={searchSectionTypes[searchSectionType]}>
                                                                 {searchSectionTypes[searchSectionType]}
                                                            </option>
                                                       );
                                                  })}
                                        </select>*/}

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
                              {!searchLoadingStarted &&
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

                    {!searchLoadingStarted &&
                         <table className="datagrid">
                              <tbody className="data watchList">
                                   {searchSection === searchSectionTypes.IMDB &&
                                        <>
                                             {!searchLoadingStarted && searchLoadingComplete && imdbSearchResults && imdbSearchResults.length > 0 &&
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
                                        </>
                                   }

                                   {searchSectionTypes.WatchList && watchListSearchResults && watchListSearchResults.length > 0 &&
                                        watchListSearchResults.map(
                                             (currentResult: IWatchList, index: number) => {
                                                  return (
                                                       <WatchListCard key={index} currentWatchList={currentResult} />
                                                  )
                                             })
                                   }

                                   {searchSectionTypes.WatchListItems && watchListItemsSearchResults && watchListItemsSearchResults.length > 0 &&
                                        watchListItemsSearchResults.map(
                                             (currentResult: IWatchListItem, index: number) => {
                                                  return (
                                                       <WatchListItemCard key={index} currentWatchListItem={currentResult} />
                                                  )
                                             })
                                   }
                              </tbody>
                         </table>
                    }

                    {searchLoadingStarted && !searchLoadingComplete &&
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