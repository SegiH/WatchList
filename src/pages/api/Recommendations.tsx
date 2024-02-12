import { NextApiRequest, NextApiResponse } from 'next';
const axios = require("axios");
const https = require('https');

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     const queryTerm = typeof req.query.QueryTerm !== "undefined" ? req.query.QueryTerm : null;
     const typeName = typeof req.query.Type !== "undefined" ? req.query.Type : null;

     const recommendationsURL = `https://nodejs-shovav.replit.app/Recommendations?QueryTerm=${encodeURIComponent(String(queryTerm))}&Type=${typeName}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     axios.get(recommendationsURL, { httpsAgent: agent })
          .then((response: any) => {
               res.send(["OK", response.data]);
          })
          .catch((err: Error) => {
               res.send(["ERROR", err.message]);
          });
}