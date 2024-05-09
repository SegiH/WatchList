import { getModels } from "../lib";
import WatchListSource from "../../../app/interfaces/IWatchListSource";

/**
 * @swagger
 * /api/GetWatchListSources:
 *    get:
 *        tags:
 *          - WatchListSources
 *        summary: Get the WatchList sources
 *        description: Get the WatchList sources that indicate where a movie/show was watched (I.E Netflix)
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET() {
     const models = getModels();
     
     return models.WatchListSources.findAll({
          order: [["WatchListSourceName", "DESC"]],
     }).then((results: WatchListSource) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchListSources: The error ${err.message} occurred getting the WatchList Sources`]);
     });
}