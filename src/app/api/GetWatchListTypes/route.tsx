import { NextRequest } from 'next/server';
import { getModels } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTypes:
 *    get:
 *        tags:
 *          - WatchListTypes
 *        summary: Get the WatchList Types
 *        description: Get the WatchList types that indicate whether the WatchList is a movie or show
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const models = getModels();
     
     return models.WatchListTypes.findAll({
          order: [["WatchListTypeName", "DESC"]],
     }).then((results: any) => {
          return Response.json(["OK", results]);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchListTypes: The error ${err.message} occurred getting the WatchList Types`]);
     });
}