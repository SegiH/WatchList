import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import { APIStatus, RecommendationsContext } from "../data-context";
import IRecommendation from "../interfaces/IRecommendation";
import { RecommendationsContextType } from "../interfaces/contexts/RecommendationsContextType";

const Recommendations = ({ queryTerm, setRecommendationName, setRecommendationType, setRecommendationsVisible, type }:
     {
          queryTerm: string,
          setRecommendationName: (arg0: string) => void,
          setRecommendationType: (arg0: string) => void,
          setRecommendationsVisible: (arg0: boolean) => void,
          type: string
     }) => {
     const {
          BrokenImageIconComponent, darkMode, writeLog
     } = useContext(RecommendationsContext) as RecommendationsContextType

     const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
     const [recommendationsError, setRecommendationsError] = useState(false);
     const [recommendationsLoadingCheck, setRecommendationsLoadingCheck] = useState(APIStatus.Idle);

     const closeRecommendations = async () => {
          setRecommendationName("");
          setRecommendationType("");
          setRecommendationsVisible(false);
     }

     const getRecommendations = async () => {
          try {
               const getRecommendationsResponse = await fetch(`/api/Recommendations?SearchTerm=${encodeURIComponent(queryTerm)}&Type=${type}`, { credentials: 'include' });

               const getRecommendationsResult = await getRecommendationsResponse.json();

               setRecommendationsLoadingCheck(APIStatus.Success);

               if (getRecommendationsResult[0] === "OK") {
                    setRecommendations(getRecommendationsResult[1]);
               } else { // I do not want to display an alert if the recommendations returns an error
                    writeLog(`The error ${getRecommendationsResult[1].length} occurred while searching for recommendations`);

                    setRecommendationsError(true);
               }
          } catch (e) {
               alert(e.errorMessage);
          }
     }

     const showDefaultSrc = (id: number): void => {
          const newRecommendations: IRecommendation[] = Object.assign([], recommendations);

          newRecommendations.filter((currentRecommendation: IRecommendation) => {
               return String(currentRecommendation.id) === String(id);
          });

          if (newRecommendations.length === 0) {
               writeLog("Unable to find recommendation");
               return;
          }

          newRecommendations[0]["Image_Error"] = true;

          setRecommendations(newRecommendations);
     }

     useEffect(() => {
          if (queryTerm !== "" && type !== "" && recommendationsLoadingCheck === APIStatus.Idle) {
               setRecommendationsLoadingCheck(APIStatus.Loading)

               getRecommendations();
          }
     }, [queryTerm, recommendationsLoadingCheck, type, writeLog]);

     return (
          <div className={`flex-container${!darkMode ? " lightMode" : " darkMode"}`}>
               {recommendationsLoadingCheck === APIStatus.Success &&
                    <span className="clickable closeButton" onClick={closeRecommendations}>
                         X
                    </span>
               }

               <ul className="clickable show-list">
                    {recommendationsLoadingCheck !== APIStatus.Success &&
                         <>
                              Loading
                              <div className="loader-container">
                                   <div className="spinner"></div>
                              </div>
                         </>
                    }

                    {recommendationsLoadingCheck === APIStatus.Success && recommendations && recommendations.length > 0 && recommendations.map((recommendation: IRecommendation, index: number) => {
                         return (
                              <li className="show-item" key={index}>
                                   <span>
                                        {typeof recommendation.name !== "undefined"
                                             ? recommendation.name
                                             : typeof recommendation.Title !== "undefined"
                                                  ? recommendation.Title
                                                  : ""
                                        }
                                   </span>

                                   <br />

                                   <span>
                                        {!recommendation.Image_Error && recommendation.poster_path !== null &&
                                             <Image width="128" height="187" alt="image not available" src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`} onError={() => showDefaultSrc(recommendation.id)} />
                                        }

                                        {(recommendation.Image_Error || recommendation.poster_path === null) &&
                                             <>
                                                  {BrokenImageIconComponent}
                                             </>
                                        }
                                   </span>

                                   <br />

                                   <span className="no-font">
                                        {recommendation.overview}
                                   </span>
                              </li>
                         )
                    })}

                    {recommendationsLoadingCheck === APIStatus.Success && recommendations && recommendations.length === 0 &&
                         <li className="show-item no-border no-font">
                              <span>
                                   {!recommendationsError ? "No recommendations" : "Unable to get recommendations"}
                              </span>
                         </li>
                    }
               </ul>
          </div>
     );
};

export default Recommendations;