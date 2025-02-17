import { NextRequest } from 'next/server';
import { fetchData, getRapidAPIKey, isLoggedIn } from '../lib';

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

     const rapidapi_key = await getRapidAPIKey();

     if (rapidapi_key === null) {
          return Response.json(["ERROR", "API key is not set"]);
     }

     const results: [{}] = [{}];

     try {
          for (let i = 0; i < parseInt(searchCount !== null ? searchCount : "10", 10); i++) {
               let options = {
                    method: "GET",
                    url: "https://imdb107.p.rapidapi.com/",
                    params: { s: searchTerm, page: i + 1, r: "json" },
                    headers: {
                         "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
                         "x-rapidapi-key": rapidapi_key,
                         useQueryString: true,
                    },
               };

               const result = await fetchData(options);

               if (typeof result.Search !== "undefined") {
                    try {
                         results.push(...result.Search);
                    } catch (e) { }
               }
          }

          return Response.json(["OK", results]);
     } catch (error) {
          return Response.json(["ERROR", error]);
     }
}