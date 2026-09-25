import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import { APIStatus, RecommendationsContext } from "../context";
import IRecommendation from "../interfaces/IRecommendation";
import { RecommendationsContextType } from "../contexts/RecommendationsContextType";

import "./Recommendations.css";
import Loader from './Loader';

const Recommendations = ({ queryTerm, setRecommendationName, setRecommendationType, setRecommendationsVisible, type }:
     {
          queryTerm: string,
          setRecommendationName: (arg0: string) => void,
          setRecommendationType: (arg0: string) => void,
          setRecommendationsVisible: (arg0: boolean) => void,
          type: string
     }) => {
     const {
          BrokenImageIconComponent, imageHeight, imageWidth, writeLog
     } = useContext(RecommendationsContext) as RecommendationsContextType

     const [expandedRecommendations, setExpandedRecommendations] = useState<number[]>([]);
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
          } catch (e: any) {
               alert(e.message);
          }
     }

     const showDefaultSrc = (id: number): void => {
          const newRecommendations: IRecommendation[] = { ...recommendations };

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

     const toggleRecommendation = (id: number) => {
          setExpandedRecommendations(prev =>
               prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
          );
     };

     useEffect(() => {
          if (queryTerm !== "" && type !== "" && recommendationsLoadingCheck === APIStatus.Idle) {
               setRecommendationsLoadingCheck(APIStatus.Loading)

               getRecommendations();
          }
     }, [queryTerm, recommendationsLoadingCheck, type, writeLog]);

     return (
          <div>
               {recommendationsLoadingCheck === APIStatus.Success &&
                    <span className="clickable" onClick={closeRecommendations}>
                         X
                    </span>
               }

               <ul className="clickable show-list overflow-y">
                    {recommendationsLoadingCheck !== APIStatus.Success &&
                         <Loader />
                    }

                    {recommendationsLoadingCheck === APIStatus.Success && recommendations && recommendations.length > 0 && recommendations.map((recommendation: IRecommendation, index: number) => {
                         return (
                              <li className="show-item" key={recommendation.id}>
                                   <div className="recommendation-card">
                                        <div className="recommendation-poster">
                                             {!recommendation.Image_Error && recommendation.poster_path !== null ? (
                                                  <Image
                                                       width={80}
                                                       height={120}
                                                       alt={recommendation.name || recommendation.Title || "Poster"}
                                                       src={`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`}
                                                       onError={() => showDefaultSrc(recommendation.id)}
                                                  />
                                             ) : (
                                                  <div className="imagePlaceholder">
                                                       {BrokenImageIconComponent}
                                                  </div>
                                             )}
                                        </div>

                                        <div className="recommendation-content">
                                             <div
                                                  className={
                                                       expandedRecommendations.includes(recommendation.id)
                                                            ? "recommendation-overview expanded"
                                                            : "recommendation-overview"
                                                  }
                                             >
                                                  {recommendation.overview}
                                             </div>

                                             {recommendation.overview && (
                                                  <div className="recommendation-content">
                                                       <div className="recommendation-title">
                                                            {recommendation.name || recommendation.Title || ""}
                                                       </div>

                                                       {recommendation.overview && (
                                                            <>
                                                                 <div
                                                                      className={
                                                                           expandedRecommendations.includes(recommendation.id)
                                                                                ? "recommendation-overview expanded"
                                                                                : "recommendation-overview"
                                                                      }
                                                                 >
                                                                      {recommendation.overview}
                                                                 </div>

                                                                 <button
                                                                      className="read-more"
                                                                      onClick={() => toggleRecommendation(recommendation.id)}
                                                                 >
                                                                      {expandedRecommendations.includes(recommendation.id)
                                                                           ? "Show less"
                                                                           : "Show more"}
                                                                 </button>
                                                            </>
                                                       )}
                                                  </div>
                                             )}
                                        </div>
                                   </div>
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