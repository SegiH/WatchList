import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');
import { getRecommendationsAPIKey, isLoggedIn } from '../lib';
/**
 * @swagger
 * /api/Recommendations:
 *    get:
 *        tags:
 *          - Recommendations
 *        summary: Get recommendations based on the current movie/show
 *        description: Get recommendations based on the current movie/show
 *        parameters:
 *           - name: SearchTerm
 *             in: query
 *             description: Search term
 *             required: true
 *             schema:
 *                  type: string
 *           - name: Type
 *             in: query
 *             description: Type of the search term (movie or show)
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",recommendations] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const recommendationsAPIKey = getRecommendationsAPIKey();

     const searchParams = request.nextUrl.searchParams;

     const queryTerm = searchParams.get("SearchTerm");
     const typeName = searchParams.get("Type");

     const resultPages = 5;

     // Reenable when using local TheMovieDB API key
     /*if (recommendationsAPIKey === null) {
          return Response.json(["ERROR", "Recommendation API key is not set"]);
     }*/

     if (queryTerm === null) {
          return Response.json(["ERROR", "Query term was not provided"]);
     }

     if (typeName === null) {
          return Response.json(["ERROR", "Type was not provided"]);
     }

     if (typeName !== "Movie" && typeName !== "TV") {
          return Response.json(["ERROR", "Type must be TV or Movie"]);
     }

     // Replit code
     const recommendationsURL = `https://nodejs-shovav.replit.app/Recommendations?QueryTerm=${encodeURIComponent(String(queryTerm))}&Type=${typeName}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return axios.get(recommendationsURL, { httpsAgent: agent })
          .then((response: any) => {
               return Response.json(["OK", response.data]);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });

     // Local code
     /*if (typeName === "TV") {
          const results :any = await tvLookup(queryTerm, resultPages);

          if (results && results.length > 0) {
               return Response.json(["OK", results]);
          } //else {
               // try as movie
               //const movieResults = await movieLookup(queryTerm, resultPages);
               //return Response.json(["OK", movieResults]);
          //}
     } else if (typeName === "Movie") {
          const results :any = await movieLookup(queryTerm, resultPages);

          if (results.length > 0) {
               return Response.json(["OK", results]);
          } //else {
               //const tvResults = await tvLookup(queryTerm, resultPages);

               //if (tvResults.length > 0) {
               //     return Response.json(["OK", tvResults]);
               //}
          //}
     }*/
}

async function executeAxios(url) {
     const axios = require("axios");

     const recommendations_api_key = await getRecommendationsAPIKey();

     return axios
          .get(url, {
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${recommendations_api_key}`,
               },
          })
          .then((res) => {
               if (res.data.results.length > 0) {
                    return ["OK", res.data.results];
               } else {
                    return ["OK", null];
               }
          })
          .catch((err) => {
               return ["ERROR", err.message];
          });
}

// Step 1 when looking for TV recommendations
async function tvLookup(queryTerm, pages) {
     const tvLookupResults = await findShow(queryTerm);

     if (typeof tvLookupResults === "undefined") {
          return Response.json(["ERROR", `An error occurred looking up ${queryTerm} because the results of tvLookupResults are undefined`]);
     }

     if (tvLookupResults[0] === "OK" && tvLookupResults[1] !== null) {
          const results = await getPages(tvLookupResults, findSimilarTVShows, pages);
          return results;
     } else {
          return ["ERROR", tvLookupResults[1]];
     }
}

// Step 1 when looking for movie recommendations
async function movieLookup(queryTerm, pages) {
     const movieLookupResults = await findMovie(queryTerm);

     if (typeof movieLookupResults === "undefined") {
          return Response.json(["ERROR", `An error occurred looking up ${queryTerm} because the results of movieLookupResults are undefined`]);
     }

     if (movieLookupResults[0] === "OK" && movieLookupResults[1] !== null) {
          const results = await getPages(movieLookupResults, findSimilarMovies, pages);

          return results;
     } else {
          return ["ERROR", movieLookupResults[1]];
     }
}

// Step 2 when looking for TV recommendations
async function findShow(queryTerm) {
     const tv_url = "https://api.themoviedb.org/3/search/tv?query=*PARAM*&include_adult=false&language=en-US&page=1";

     const url = tv_url.replace("*PARAM*", encodeURIComponent(queryTerm));
     const results = await executeAxios(url);
     return results;
}

// Step 2 when looking for movie recommendations
async function findMovie(queryTerm) {
     const movie_url = "https://api.themoviedb.org/3/search/movie?query=*PARAM*&include_adult=false&language=en-US&page=1";
     const url = movie_url.replace("*PARAM*", encodeURIComponent(queryTerm));
     const results = await executeAxios(url);
     return results;
}

// Step 3 when looking for TV or movie recommendations
async function getPages(results, callback, pages) {
     const id = results[1][0].id;
     const origin_country = results[1][0].origin_country;

     let unfiltered_results = [];

     for (let i = 0; i < pages; i++) {
          const currentResults = await getPage(callback, id, i + 1);

          if (currentResults[0] === "OK") {
               unfiltered_results = unfiltered_results.concat(currentResults[1]);
          }
     }

     const filtered_results = unfiltered_results.filter((currentResult: any) => {
          return currentResult !== null && String(currentResult.origin_country) === String(origin_country);
     });

     const deduplicated_results = filtered_results.filter((value: any, index, self) => index === self.findIndex((t: any) => t.id === value.id));

     return deduplicated_results;
}

// Step 4 when looking for TV or movie recommendations
async function getPage(callback, id, pageNum) {
     const result = await callback(id, pageNum);
     return result;
}

// Step 5 when looking for TV recommendations
async function findSimilarTVShows(id, pageNum) {
     const similar_tv_url = "https://api.themoviedb.org/3/tv/*PARAM*/recommendations?language=en-US&page=";

     const url = similar_tv_url
          .replace("*PARAM*", encodeURIComponent(id))
          .replace("&page=", `&page=${pageNum}`);

     return executeAxios(url);
}

// Step 5 when looking for movie recommendations
async function findSimilarMovies(id, pageNum) {
     const similar_movie_url = "https://api.themoviedb.org/3/movie/*PARAM*/recommendations?language=en-US&page=";

     const url = similar_movie_url
          .replace("*PARAM*", encodeURIComponent(id))
          .replace("&page=", `&page=${pageNum}`);

     return executeAxios(url);
}