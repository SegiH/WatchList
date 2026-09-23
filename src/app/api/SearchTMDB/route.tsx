import { NextRequest } from 'next/server';
import { addWatchListItem, searchTMDB, searchTMDBByTT, isLoggedIn, writeLog, getTMDBAPIKey } from '../lib';

export async function GET(request: NextRequest) {
     const tmdb_key = await getTMDBAPIKey();

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const searchTerm = searchParams.get("SearchTerm");

     if (searchTerm === null) {
          return Response.json(["ERROR", "Search term not provided"]);
     }

     // Check if searchTerm starts with tt and is followed by 7 or more numbers
     if (/^tt\d{7,}$/.test(searchTerm)) {
          const result: any = await searchTMDBByTT(searchTerm);

          if (result === null) {
               return Response.json(["ERROR", "Not Found"]);
          }

          let itemType = "0";

          if (result.Type === "movie") {
               itemType = "1";
          } else if (result.Type === "series") {
               itemType = "2";
          } else {
               itemType = "3";
          }

          const imdb_url = "https://www.imdb.com/title/" + result.IMDBId + "/";
          const imdb_poster = result.IMDB_Poster;

          const addResultResponse = await addWatchListItem(result.Title, itemType, imdb_url, imdb_poster, "", "0");
          const addResult = await addResultResponse.json();

          if (addResult[0] === "ERROR-ALREADY-EXISTS") {
               return Response.json([addResult[0], addResult[1], addResult[2]]);
          } else {
               return Response.json(["OK", searchTerm, addResult[1]]);
          }
     }

     //const results: [] = [];

     const headers = {
          Authorization: `Bearer ${tmdb_key}`
     };

     const result = await searchTMDB(searchTerm);

     await Promise.all(result.results.map(async (currentResult) => {
          let media_type = 0;

          if (currentResult["media_type"] === "movie") {
               media_type = 1;
          } else if (currentResult["media_type"] === "tv") {
               media_type = 2;
          }
          const apiUrl = media_type == 1 ? `https://api.themoviedb.org/3/movie/${currentResult["id"]}/external_ids`
               :
               media_type == 2 ?
                    `https://api.themoviedb.org/3/tv/${currentResult["id"]}/external_ids`
                    : null;

          if (apiUrl !== null) {
               try {
                    const ttResponse = await fetch(apiUrl, { headers });
                    const jsonTTResponse = await ttResponse.json();

                    if (typeof jsonTTResponse.imdb_id !== "undefined") {
                         currentResult["IMDB_URL"] = `https://www.imdb.com/title/${jsonTTResponse.imdb_id}/`;
                    }

                    if (typeof result.poster_path !== "undefined") {
                         currentResult["IMDB_Poster"] = `https://image.tmdb.org/t/p/original${result.poster_path}`;
                    }

                    if (jsonTTResponse["success"] !== "false" && typeof jsonTTResponse.imdb_id !== "undefined") {
                         currentResult.imdb_id = jsonTTResponse.imdb_id;
                    }
               } catch (e) {
               }
          }
     }));

     //results.push(result);

     try {
          return Response.json(["OK", result.results]);
     } catch (error) {
          return Response.json(["ERROR", error]);
     }
}