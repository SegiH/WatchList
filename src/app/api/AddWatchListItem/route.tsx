import { NextRequest } from 'next/server';
import { addWatchListItem, isLoggedIn } from "../lib";

export async function PUT(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const name = searchParams.get("WatchListItemName");
     const type = searchParams.get("WatchListTypeID");
     const imdb_url = searchParams.get("IMDB_URL");
     const imdb_poster = searchParams.get("IMDB_Poster");
     const notes = searchParams.get("Notes");
     const archived = searchParams.get("Archived") !== null ? parseInt(searchParams.get("Archived"), 10) : 0;
     const year = searchParams.get("Year");
     const genre = searchParams.get("Genre");
     const rated = searchParams.get("Rated");

     if (name === null) {
          return Response.json(["ERROR", "Name was not provided"]);
     } else if (type === null) {
          return Response.json(["ERROR", "Type was not provided"]);
     } else {
          return addWatchListItem(name, type, imdb_url, imdb_poster, year !== null ? parseInt(year, 10) : 0, genre, rated, notes, archived);
     }
}