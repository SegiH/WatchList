import { NextApiRequest, NextApiResponse } from 'next';
const axios = require("axios");
const https = require('https');

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     const searchCount: number = typeof req.query.SearchCount !== "undefined" ? Number(req.query.SearchCount) : 5;
     const searchTerm = typeof req.query.SearchTerm !== "undefined" ? req.query.SearchTerm : null;

     if (searchTerm === null) {
          res.send(["ERROR", "Search term not provided 1"]);
     } else {
          const searchURL = `https://nodejs-shovav.replit.app/SearchIMDB?SearchTerm=${encodeURIComponent(String(searchTerm))}&SearchCount=${searchCount}`;

          const agent = new https.Agent({
               rejectUnauthorized: false
          });
     
          axios.get(searchURL, { httpsAgent: agent })
               .then((response: any) => {
                    res.send(response.data);
               })
               .catch((err: Error) => {
                    res.send(["ERROR", err.message]);
               });
     }
}