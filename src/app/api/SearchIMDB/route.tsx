import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');

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
     const searchParams = request.nextUrl.searchParams;

     const searchCount = searchParams.get("SearchCount") !== null ? searchParams.get("SearchCount") : 10;
     const searchTerm = searchParams.get("SearchTerm");

     if (searchTerm === null) {
          return Response.json(["ERROR", "Search term not provided 1"]);
     } else {
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
     }
}