import Image from 'next/image';
import ISearchTmdb from "../interfaces/ISearchTmdb";

import { useRouter } from 'next/navigation';
import React, { useContext } from "react";

import { SearchTMDBContext } from "../context";
import { SearchTMDBContextType } from "../contexts/SearchTMDBContextType";

export default function SearchTMDB(props) {
     const {
          autoAdd, BrokenImageIconComponent, imageHeight, imageWidth, modalVisible, searchCount, setIsAdding, setSearchCount, setModalVisible, setSearchTerm
     } = useContext(SearchTMDBContext) as SearchTMDBContextType

     const searchCountOptions = {
          "10 results": 10,
          "20 results": 20,
          "30 results": 30,
          "40 results": 40,
          "50 results": 50
     };

     const router = useRouter();

     const addTMDBSearchResultClickHandler = async (index: number) => {
          let itemType = 0;

          if (props.tmdbSearchResults[index].Type === "movie") {
               itemType = 1;
          } else if (props.tmdbSearchResults[index].Type === "series") {
               itemType = 2;
          } else {
               itemType = 3;
          }

          const confirmAdd = confirm("Add TMDB search result ?");

          if (!confirmAdd) {
               return;
          }

          let paramStr = `/api/AddWatchListItem?WatchListItemName=${props.tmdbSearchResults[index].Title}&WatchListTypeID=${itemType}`;

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${props.tmdbSearchResults[index].imdbID}/`;

          paramStr += `&IMDB_Poster=${props.tmdbSearchResults[index].Poster}`;

          try {
               const searchTMDBResponse = await fetch(paramStr, { method: 'PUT', credentials: 'include' });

               const searchTMDBResult = await searchTMDBResponse.json();

               if (searchTMDBResult[0] === "ERROR") {
                    alert(`The error ${searchTMDBResult[1]} occurred while adding the search result`);
               } else if (searchTMDBResult[0] === "ERROR-ALREADY-EXISTS") {
                    alert(searchTMDBResult[1]);
               } else {
                    setSearchTerm("");
                    props.setTMDBSearchResults([]);

                    if (autoAdd) {
                         setIsAdding(true);

                         setModalVisible(true);

                         router.push(`/WatchList/Dtl?WatchListItemID=${searchTMDBResult[1]}`);
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
                    <span className={`modal TMDBSearchModalContent zIndex`}>
                         <div className={`modal-content TMDBSearchModalContent`}>
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

                                        <span className="clickable TMDBCloseButton" onClick={closeSearch}>
                                             X
                                        </span>
                                   </span>
                              </div>

                              <div className="paddingTop50">
                                   <span className="row">
                                        {typeof props.tmdbSearchResults !== "undefined" && props.tmdbSearchResults !== null && props.tmdbSearchResults.length > 0 &&
                                             props.tmdbSearchResults
                                             .filter((currentResult: ISearchTmdb, index: number) => {
                                                  return index <= searchCount;
                                             }).map((currentResult: ISearchTmdb, index: number) => {
                                                  return (
                                                       <div key={index}>
                                                            {typeof currentResult.Poster !== "undefined" && currentResult.Poster !== null && currentResult.Poster !== "" && currentResult.Poster !== "N/A" &&
                                                                 <div>
                                                                      <div>
                                                                           {typeof (currentResult.Poster !== "undefined" && currentResult.Poster !== null && currentResult.Poster !== "" && currentResult.Poster !== "N/A" && (currentResult.Poster.toString().startsWith("http://") || currentResult.Poster.toString().startsWith("https://"))) &&
                                                                                <Image width={imageWidth} height={imageHeight} className="searchResultPoster" src={currentResult.Poster} onClick={() => addTMDBSearchResultClickHandler(index)} alt={currentResult.Title} />
                                                                           }

                                                                           <div className="textLabel">
                                                                                {currentResult.Title} ({currentResult.Year})
                                                                           </div>

                                                                           {currentResult.Poster === "N/A" && (
                                                                                <>
                                                                                     <span className="textLabel">
                                                                                          {currentResult.Title} ({currentResult.Year})
                                                                                     </span>

                                                                                     <span className="imagePlaceholder searchResultPoster">{BrokenImageIconComponent}</span>
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