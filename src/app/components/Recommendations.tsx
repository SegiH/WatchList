import axios, { AxiosResponse } from "axios";
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import { APIStatus, DataContext, DataContextType } from "../data-context";
import IRecommendation from "../interfaces/IRecommendation";

const Recommendations = ({ queryTerm, setRecommendationName, setRecommendationType, setRecommendationsVisible, type }:
     {
          queryTerm: string,
          setRecommendationName: (arg0: string) => void,
          setRecommendationType: (arg0: string) => void,
          setRecommendationsVisible: (arg0: boolean) => void,
          type: string
     }) => {
     const {
          BrokenImageIconComponent,
          darkMode
     } = useContext(DataContext) as DataContextType

     const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
     const [recommendationsError, setRecommendationsError] = useState(false);
     const [recommendationsLoadingCheck, setRecommendationsLoadingCheck] = useState(APIStatus.Idle);

     const closeRecommendations = async () => {
          setRecommendationName("");
          setRecommendationType("");
          setRecommendationsVisible(false);
     }

     const showDefaultSrc = (id: number): void => {
          const newRecommendations: IRecommendation[] = Object.assign([], recommendations);

          newRecommendations.filter((currentRecommendation: IRecommendation) => {
               return String(currentRecommendation.id) === String(id);
          });

          if (newRecommendations.length === 0) {
               console.log("Unable to find recommendation");
               return;
          }

          newRecommendations[0]["Image_Error"] = true;

          setRecommendations(newRecommendations);
     }

     useEffect(() => {
          if (queryTerm !== "" && type !== "" && recommendationsLoadingCheck === APIStatus.Loading) {
               setRecommendationsLoadingCheck(APIStatus.Loading)

               const url = `/api/Recommendations?SearchTerm=${encodeURIComponent(queryTerm)}&Type=${type}`;

               axios.get(url).then((res: AxiosResponse<IRecommendation>) => {
                    setRecommendationsLoadingCheck(APIStatus.Success);

                    if (res.data[0] === "OK") {
                         setRecommendations(res.data[1]);
                    } else { // I do not want to display an alert if the recommendations returns an error
                         console.log(`The error ${res.data[1].length} occurred while searching for recommendations`);

                         setRecommendationsError(true);
                    }
               }).catch((err: Error) => {
                    console.log(err.message);
                    setRecommendationsError(true);
               });
          }
     }, [queryTerm, recommendationsLoadingCheck, type]);

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

                                   <span className="image-crop">
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