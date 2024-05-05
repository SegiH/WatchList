import { NextRequest } from 'next/server';
import { getModels } from "../lib";

export async function GET(request: NextRequest) {
     const models = getModels();
     
     return models.WatchListTypes.findAll({
          order: [["WatchListTypeName", "DESC"]],
     }).then((results: any) => {
          return Response.json(results);
     }).catch(function (err: Error) {
          return Response.json(["ERROR", `/GetWatchListTypes: The error ${err.message} occurred getting the WatchList Types`]);
     });
}