import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');
import { isLoggedIn } from '../lib';
/**
 * @swagger
 * /api/Recommendations:
 *    get:
 *        tags:
 *          - Recommendations
 *        summary: Get recommendations based on the current movie/show
 *        description: Get recommendations based on the current movie/show
 *        parameters:
 *           - name: QueryTerm
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

     const searchParams = request.nextUrl.searchParams;

     const queryTerm = searchParams.get("QueryTerm");
     const typeName = searchParams.get("Type");

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
}