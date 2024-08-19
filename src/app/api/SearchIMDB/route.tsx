import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');
import { fetchData, getRapidAPIKey, isLoggedIn } from '../lib';
/**
 * @swagger
 * /api/SearchIMDB:
 *    get:
 *        tags:
 *          - Search
 *        summary: Search IMDB
 *        description: Search IMDB for the specified movie/show
 *        parameters:
 *           - name: SearchTerm
 *             in: query
 *             description: Search term
 *             required: true
 *             schema:
 *                  type: string
 *           - name: SearchCount
 *             in: query
 *             description: how many search results to return
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",search results] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const searchCount = searchParams.get("SearchCount") !== null ? searchParams.get("SearchCount") : "10";

     const searchTerm = searchParams.get("SearchTerm");

     if (searchTerm === null) {
          return Response.json(["ERROR", "Search term not provided"]);
     }

     // Replit code
     const searchURL = `https://nodejs-shovav.replit.app/SearchIMDB?SearchTerm=${encodeURIComponent(String(searchTerm))}&SearchCount=${searchCount}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return axios.get(searchURL, { httpsAgent: agent })
          .then((response: any) => {
               return Response.json(response.data);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });

     // Local code
     /*const rapidapi_key = await getRapidAPIKey();

     if (rapidapi_key === null) {
          return Response.json(["ERROR", "API key is not set"]);
     }

     const results :any = [];

     try {
          for (let i = 0; i < parseInt(searchCount !== null ? searchCount : "10",10); i++) {
               let options = {
                    method: "GET",
                    url: "https://imdb107.p.rapidapi.com/",
                    qs: { s: searchTerm, page: i + 1, r: "json" },
                    headers: {
                         "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
                         "x-rapidapi-key": rapidapi_key,
                         useQueryString: true,
                    },
               };

               const result :any = await fetchData(options);

               const jsonResult :any = JSON.parse(result);

               if (typeof jsonResult.Search !== "undefined") {
                    results.push(...jsonResult.Search);
               }
          }

          return Response.json(["OK", results]);
     } catch (error) {
          console.error('Error during requests:', error);
          throw error;
     }*/
}