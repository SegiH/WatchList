import { NextApiRequest, NextApiResponse } from 'next';
const axios = require("axios");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.send("");
  /*models.WatchListItems.findAll({
      //logging: console.log,
      limit: 50,
      //include: [{ model: models.WatchListTypes, required: true }],
      where: {
        IMDB_Poster: null
      },
      order: [
          [sortColumn, sortDirection]
      ]
    })*/
  /*const SQL=`SELECT TOP(50) WatchListItems.WatchListItemID,WatchListItems.WatchListItemName,WatchListItems.IMDB_URL FROM WatchListItems LEFT JOIN IMDBPosters on IMDBPosters.WatchListItemID=WatchListItems.WatchListItemID WHERE IMDBPosters.PosterURL IS NULL*/
}