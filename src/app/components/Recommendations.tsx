const axios = require("axios");
const exact = require("prop-types-exact");
import Image from 'next/image';
const IRecommendation = require("../interfaces/IRecommendation");
const MuiIcon = require("@mui/icons-material").MuiIcon;
const PropTypes = require("prop-types");
const React = require("react");
const useEffect = require("react").useEffect;
const useState = require("react").useState;

const Recommendations = ({ BrokenImageIcon, queryTerm, setRecommendationName, setRecommendationType, setRecommendationsVisible, type }:
     {
          BrokenImageIcon: typeof MuiIcon,
          queryTerm: string,
          setRecommendationName: (arg0: string) => void,
          setRecommendationType: (arg0: string) => void,
          setRecommendationsVisible: (arg0: boolean) => void,
          type: string
     }) => {
     const [recommendations, setRecommendations] = useState([]);
     const [recommendationsError, setRecommendationsError] = useState(false);
     const [recommendationsLoadingStarted, setRecommendationsLoadingStarted] = useState(false);
     const [recommendationsLoadingComplete, setRecommendationsLoadingComplete] = useState(false);

     const closeRecommendations = async () => {
          setRecommendationName("");
          setRecommendationType("");
          setRecommendationsVisible(false);
     }

     const showDefaultSrc = (id: number) => (): void => {
          const newRecommendations = Object.assign([], recommendations);

          newRecommendations.filter((currentRecommendation: typeof IRecommendation) => {
               return String(currentRecommendation.id) === String(id);
          });

          if (newRecommendations.length === 0) {
               console.log("Unable to find recommendation");
               return;
          }

          newRecommendations[0]["Image_Error"] = true;

          setRecommendationName(newRecommendations);
     }

     useEffect(() => {
          if (queryTerm !== "" && type !== "" && !recommendationsLoadingStarted) {
               setRecommendationsLoadingStarted(true);

               const url = `/api/Recommendations?QueryTerm=${encodeURIComponent(queryTerm)}&Type=${type}`;

               axios.get(url).then((res: typeof IRecommendation) => {
                    setRecommendationsLoadingComplete(true);

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
     }, [queryTerm, recommendationsLoadingStarted, type]);

     return (
          <>
               {recommendationsLoadingComplete &&
                    <span className="clickable closeButton" onClick={closeRecommendations}>
                         X
                    </span>
               }

               <ul className="clickable show-list">
                    {!recommendationsLoadingComplete &&
                         <>
                              Loading
                              <div className="loader-container">
                                   <div className="spinner"></div>
                              </div>
                         </>
                    }

                    {recommendationsLoadingComplete && recommendations && recommendations.length > 0 && recommendations.map((recommendation: typeof IRecommendation, index: number) => {
                         return (
                              <li className="show-item" key={index}>
                                   <span>
                                        {typeof recommendation.name !== "undefined"
                                             ? recommendation.name
                                             : typeof recommendation.title !== "undefined"
                                                  ? recommendation.title
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
                                                  {BrokenImageIcon}
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

                    {recommendationsLoadingComplete && recommendations && recommendations.length === 0 &&
                         <li className="show-item no-border no-font">
                              <span>
                                   {!recommendationsError ? "No recommendations" : "Unable to get recommendations"}
                              </span>
                         </li>
                    }
               </ul>
          </>
     );
};

Recommendations.propTypes = exact({
     BrokenImageIcon: PropTypes.object.isRequired,
     queryTerm: PropTypes.string.isRequired,
     setRecommendationName: PropTypes.func.isRequired,
     setRecommendationType: PropTypes.func.isRequired,
     setRecommendationsVisible: PropTypes.func.isRequired,
     type: PropTypes.string.isRequired
});

export default Recommendations;