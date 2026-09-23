import Image from 'next/image';
import ISearchTmdb from "../interfaces/ISearchTmdb";

import { useRouter } from 'next/navigation';
import React, { useContext } from "react";

import { SearchTMDBContext } from "../context";
import { SearchTMDBContextType } from "../contexts/SearchTMDBContextType";

export default function SearchTMDB(props) {
     const {
          autoAdd, imageHeight, imageWidth, modalVisible, setIsAdding, setModalVisible, setSearchTerm
     } = useContext(SearchTMDBContext) as SearchTMDBContextType

     /*const searchCountOptions = {
          "10 results": 10,
          "20 results": 20,
          "30 results": 30,
          "40 results": 40,
          "50 results": 50
     };*/

     const router = useRouter();

     const addTMDBSearchResultClickHandler = async (currentResult) => {
          let itemType = 0;

          if (currentResult.media_type === "movie") {
               itemType = 1;
          } else if (currentResult.media_type === "tv") {
               itemType = 2;
          } else {
               itemType = 3;
          }

          const confirmAdd = confirm("Add TMDB search result ?");

          if (!confirmAdd) {
               return;
          }

          let paramStr = `/api/AddWatchListItem?WatchListItemName=${currentResult.name ?? currentResult.title}&WatchListTypeID=${itemType}`;

          paramStr += `&IMDB_URL=https://www.imdb.com/title/${currentResult.imdb_id}/`;
          paramStr += `&IMDB_Poster=https://image.tmdb.org/t/p/original${currentResult.poster_path}`;

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

     const getYear = (yearStr?: string) => {
          if (typeof yearStr !== "undefined" && yearStr !== null && yearStr !== "") {
               return `(${yearStr.split("-")[0]})`;
          } else {
               return "";
          }
     }

     return (
          <>
               {modalVisible &&
                    <span className={`modal zIndex TMDBSearchModal`}>
                         <div className={`modal-content TMDBSearchModalContent overflow-y`}>
                              <div className="IMDBSearchHeader">
                                   <span className="flex items-center gap-[12px]">
                                        {/*<span className="ml-[200px]">Count</span>

                                        <select className="customBorderRadius leftMargin60" value={searchCount} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSearchCount(parseInt(event.target.value, 10))}>
                                             {Object.keys(searchCountOptions).map((searchCountName: string, index: number) => {
                                                  return (
                                                       <option key={index} value={searchCountOptions[searchCountName]}>
                                                            {searchCountName}
                                                       </option>
                                                  );
                                             })}
                                        </select>*/}

                                        <span className="clickable TMDBCloseButton" onClick={closeSearch}>
                                             X
                                        </span>
                                   </span>
                              </div>

                              <div className="paddingTop50 rowParent">
                                   <div className="row flex flex-row flex-nowrap items-start gap-[25px] overflow-x-auto">
                                        {typeof props.tmdbSearchResults !== "undefined" && props.tmdbSearchResults !== null && props.tmdbSearchResults.length > 0 &&
                                             props.tmdbSearchResults
                                                  .filter((currentResult: ISearchTmdb, index: number) => {
                                                       return currentResult && typeof currentResult["IMDB_URL"] !== "undefined"
                                                  })
                                                  .map((currentResult: ISearchTmdb, index: number) => {
                                                       return (
                                                            <div key={index}>
                                                                 {typeof currentResult.poster_path !== "undefined" && currentResult.poster_path !== null && currentResult.poster_path !== "" && currentResult.poster_path !== "N/A" &&
                                                                      <div>
                                                                           <div>
                                                                                {typeof (currentResult.poster_path !== "undefined" && currentResult.poster_path !== null && currentResult.poster_path !== "" && currentResult.poster_path !== "N/A" && (currentResult.poster_path.toString().startsWith("http://") || currentResult.poster_path.toString().startsWith("https://"))) &&
                                                                                     <Image width={imageWidth} height={imageHeight} className="clickable searchResultPoster" src={`https://image.tmdb.org/t/p/original${currentResult.poster_path}`} onClick={() => addTMDBSearchResultClickHandler(currentResult)} alt={currentResult.name ?? "Unknown"} />
                                                                                }

                                                                                <div className="textLabel py-[20]">
                                                                                     {currentResult.name ?? currentResult.title} {getYear(currentResult?.first_air_date ?? currentResult?.release_date)}
                                                                                </div>

                                                                                {/*{currentResult.poster_path === "N/A" && (
                                                                                <>
                                                                                     <span className="textLabel">
                                                                                          {currentResult.name} ({currentResult.year})
                                                                                     </span>

                                                                                     <span className="imagePlaceholder searchResultPoster">{BrokenImageIconComponent}</span>
                                                                                </>
                                                                           )}*/}
                                                                           </div>
                                                                      </div>
                                                                 }
                                                            </div>
                                                       );
                                                  })
                                        }
                                   </div>
                              </div>
                         </div>
                    </span>
               }
          </>
     );
}