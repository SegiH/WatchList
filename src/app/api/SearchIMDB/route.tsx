import { NextRequest } from 'next/server';
import { fetchRapidAPIData, isLoggedIn } from '../lib';

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
                    console.log(e)
               }
          }

          return Response.json(["OK", results]);
     } catch (error) {
          return Response.json(["ERROR", error]);
     }
}