import { NextRequest } from 'next/server';
import { getModels } from "../lib";
import WatchListSource from "../../../app/interfaces/IWatchListSource";

export async function GET(request: NextRequest) {
     const models = getModels();
     
     const searchParams = request.nextUrl.searchParams;

     return models.WatchListSources.findAll({
          order: [["WatchListSourceName", "DESC"]],
     }).then((results: WatchListSource) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchListSources: The error ${err.message} occurred getting the WatchList Sources`]);
     });
}