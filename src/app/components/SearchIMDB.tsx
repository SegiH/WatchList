import Image from 'next/image';
import ISearchImdb from "../interfaces/ISearchImdb";

import { useRouter } from 'next/navigation';
import React, { useContext } from "react";

import { SearchIMDBContext } from "../context";
import { SearchIMDBContextType } from "../contexts/SearchIMDBContextType";

export default function SearchIMDB(props) {
     const {
          AddIconComponent, autoAdd, BrokenImageIconComponent, modalVisible, searchCount, setIsAdding, setSearchCount, setModalVisible, setSearchTerm
     } = useContext(SearchIMDBContext) as SearchIMDBContextType

     const searchCountOptions = {
          "10 results": 1,
          "20 results": 2,
          "30 results": 3,
          "40 results": 4,
          "50 results": 5
     };

     const router = useRouter();

     const addIMDBSearchResultClickHandler = async (index: number) => {
          let itemType = 0;

          if (props.imdbSearchResults[index].Type === "movie") {
               itemType = 1;
          } else if (props.imdbSearchResults[index].Type === "series") {
               itemType = 2;
          } else {
               itemType = 3;
          }

          const confirmAdd = confirm("Add IMDB search result ?");

          if (!confirmAdd) {
               return;
          }

          let paramStr = `/api/AddWatchListItem?WatchListItemName=${props.imdbSearchResults[index].Title}&WatchListTypeID=${itemType}`;

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${props.imdbSearchResults[index].imdbID}/`;

          paramStr += `&IMDB_Poster=${props.imdbSearchResults[index].Poster}`;

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

                    setSearchTerm("");

                    setModalVisible(false);
               }
          } catch (e: any) {
               alert(e.message);
          }
     };

     const closeSearch = async () => {
          setSearchTerm("");

          setModalVisible(false);
     };

     return (
          <>
               {modalVisible &&
                    <div className={`modal zIndex`}>
                         <div className={`modal-content`}>
                              <div className="card rightAligned customCloseButton">
                                                  <span className="clickable closeButton" onClick={closeSearch}>
                                                       X
                                                  </span>
                                             </div>
                              <div className="container searchHeader sticky">
                                   <div>
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
                              </div>

                              <table className="datagrid">
                                   <tbody className="data watchList">
                                        {typeof props.imdbSearchResults !== "undefined" && props.imdbSearchResults !== null && props.imdbSearchResults.length > 0 &&
                                             props.imdbSearchResults.map((currentResult: ISearchImdb, index: number) => {
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
                         </div>
                    </div >
               }
          </>
     );
}