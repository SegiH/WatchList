import { NextRequest } from 'next/server';
import { addWatchListItem, fetchRapidAPIData, getIMDBDetails, isLoggedIn, writeLog } from '../lib';

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

     // Check if searchTerm starts with tt and is followed by 7 or more numbers
     if (/^tt\d{7,}$/.test(searchTerm)) {
          const result = await getIMDBDetails(searchTerm);

          let itemType = "0";

          if (result.Type === "movie") {
               itemType = "1";
          } else if (result.Type === "series") {
               itemType = "2";
          } else {
               itemType = "3";
          }

          const imdb_url = "https://www.imdb.com/title/" + result.imdbID + "/";
          const imdb_poster = result.Poster;

          const addResultResponse = await addWatchListItem(result.Title, itemType, imdb_url, imdb_poster, "", "0");
          const addResult = await addResultResponse.json();

          if (addResult[0] === "ERROR-ALREADY-EXISTS") {
               return Response.json([addResult[0], addResult[1], addResult[2]]);
          } else {
               return Response.json(["OK", searchTerm, addResult[1]]);
          }
     }

     const results: [{}] = [{}];

     try {
          for (let i = 0; i < parseInt(searchCount !== null ? searchCount : "10", 10); i++) {
               try {
                    const url = `https://movie-database-alternative.p.rapidapi.com/?s=${searchTerm}&r=json&page=${i + 1}`;

                    const result = await fetchRapidAPIData(url);

                    if (typeof result.Search !== "undefined") {
                         try {
                              results.push(...result.Search);
                         } catch (e) { }
                    }
               } catch (e) {
                    writeLog(e)
               }
          }

          return Response.json(["OK", results]);
     } catch (error) {
          return Response.json(["ERROR", error]);
     }
}