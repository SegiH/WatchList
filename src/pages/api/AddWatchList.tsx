import { NextApiRequest, NextApiResponse } from 'next';
import { getModels } from "./default";
import { getUserID } from './default';
import WatchList from "../../app/interfaces/IWatchList";

const models = getModels();

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     const userID = await getUserID(req, res);
     const watchListItemID = typeof req.query.WatchListItemID !== "undefined" ? req.query.WatchListItemID : null;
     const startDate = typeof req.query.StartDate !== "undefined" ? req.query.StartDate : null;
     const endDate = typeof req.query.EndDate !== "undefined" ? req.query.EndDate : null; // Optional
     const sourceID = typeof req.query.WatchListSourceID !== "undefined" ? req.query.WatchListSourceID : null;
     const season = typeof req.query.Season !== "undefined" ? req.query.Season : null;
     const rating = typeof req.query.Rating !== "undefined" ? req.query.Rating : null;
     const notes = typeof req.query.Notes !== "undefined" ? req.query.Notes : null;

     if (userID === null) {
          res.status(200).json({ "ERROR": "User ID is not set" });
          return;
     } else if (watchListItemID === null) {
          res.status(200).json(["Item ID was not provided"]);
          return;
     } else if (startDate === null) {
          res.status(200).json(["Start Date was not provided"]);
          return;
     } else {
          await models.WatchList.create({
               UserID: userID,
               WatchListItemID: watchListItemID,
               StartDate: startDate,
               EndDate: endDate,
               WatchListSourceID: sourceID,
               Season: season,
               Archived: 0,
               Rating: rating,
               Notes: notes,
          })
               .then((result: WatchList) => {
                    // Return ID of newly inserted row
                    res.status(200).json(["OK", result.WatchListID]);
               })
               .catch(function (e: Error) {
                    const errorMsg = `/AddWatchList: The error ${e.message} occurred while adding the WatchList record`;
                    console.error(errorMsg);
                    res.status(404).json(errorMsg);
               });
     }
}