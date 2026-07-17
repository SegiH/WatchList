import Image from 'next/image';
import ISearchImdb from "../interfaces/ISearchImdb";

import { useRouter } from 'next/navigation';
import React, { useContext } from "react";

import { SearchIMDBContext } from "../context";
import { SearchIMDBContextType } from "../contexts/SearchIMDBContextType";

export default function SearchIMDB(props) {
     const {
          autoAdd, BrokenImageIconComponent, modalVisible, searchCount, setIsAdding, setSearchCount, setModalVisible, setSearchTerm
     } = useContext(SearchIMDBContext) as SearchIMDBContextType

     const searchCountOptions = {
          "10 results": 10,
          "20 results": 20,
          "30 results": 30,
          "40 results": 40,
          "50 results": 50
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
                    setSearchTerm("");
                    props.setIMDBSearchResults([]);

                    if (autoAdd) {
                         setIsAdding(true);

                         setModalVisible(true);

                         router.push(`/WatchList/Dtl?WatchListItemID=${searchIMDBResult[1]}`);
                    } else {
                         setModalVisible(false);
                    }
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
                    <span className={`modal IMDBSearchModalContent zIndex`}>
                         <div className={`modal-content IMDBSearchModalContent`}>
                              <div className="IMDBSearchHeader">
                                   <span className="flex items-center gap-[12px]">
                                        <span className="ml-[200px]">Count</span>

                                        <select className="customBorderRadius leftMargin60" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value, 10))}>
                                             {Object.keys(searchCountOptions).map((searchCountName: string, index: number) => {
                                                  return (
                                                       <option key={index} value={searchCountOptions[searchCountName]}>
                                                            {searchCountName}
                                                       </option>
                                                  );
                                             })}
                                        </select>

                                        <span className="clickable IMDBCloseButton" onClick={closeSearch}>
                                             X
                                        </span>
                                   </span>
                              </div>

                              <div className="paddingTop50">
                                   <span className="row">
                                        {typeof props.imdbSearchResults !== "undefined" && props.imdbSearchResults !== null && props.imdbSearchResults.length > 0 &&
                                             props.imdbSearchResults
                                             .filter((currentResult: ISearchImdb, index: number) => {
                                                  return index <= searchCount;
                                             }).map((currentResult: ISearchImdb, index: number) => {
                                                  return (
                                                       <div key={index}>
                                                            {typeof currentResult.Poster !== "undefined" && currentResult.Poster !== null && currentResult.Poster !== "" && currentResult.Poster !== "N/A" &&
                                                                 <div>
                                                                      <div>
                                                                           {typeof (currentResult.Poster !== "undefined" && currentResult.Poster !== null && currentResult.Poster !== "" && currentResult.Poster !== "N/A" && (currentResult.Poster.toString().startsWith("http://") || currentResult.Poster.toString().startsWith("https://"))) &&
                                                                                <Image width="100" height="125" className="searchResultPoster" src={currentResult.Poster} onClick={() => addIMDBSearchResultClickHandler(index)} alt={currentResult.Title} />
                                                                           }

                                                                           <div className="textLabel">
                                                                                {currentResult.Title} ({currentResult.Year})
                                                                           </div>

                                                                           {currentResult.Poster === "N/A" && (
                                                                                <>
                                                                                     <span className="textLabel">
                                                                                          {currentResult.Title} ({currentResult.Year})
                                                                                     </span>

                                                                                     <span className="searchResultPoster">{BrokenImageIconComponent}</span>
                                                                                </>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            }
                                                       </div>
                                                  );
                                             })
                                        }
                                   </span>
                              </div>
                         </div>
                    </span>
               }
          </>
     );
}