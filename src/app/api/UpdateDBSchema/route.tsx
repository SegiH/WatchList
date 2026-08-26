import { getDB, writeDB } from "../lib";

export async function GET() {
    const db: any = await getDB();
    const watchListItemsDB = db.WatchListItems;

    const imdb_json_fields = [
        {
            fieldName: "Year",
            name: "Year",
            type: "string",
            newType: "number"
        },
        {
            fieldName: "Rated",
            name: "Rated",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Released",
            name: "Released",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Runtime",
            name: "Runtime",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Genre",
            name: "Genre",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Director",
            name: "Director",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Writer",
            name: "Writer",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Actors",
            name: "Actors",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Plot",
            name: "Plot",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Language",
            name: "Language",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Country",
            name: "Country",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "Ratings",
            name: "Ratings",
            type: "object",
            newType: "array"
        },
        {
            fieldName: "imdbRating",
            name: "IMDBRating",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "imdbID",
            name: "IMDBId",
            type: "string",
            newType: "string"
        },
        {
            fieldName: "BoxOffice",
            name: "BoxOffice",
            type: "string",
            newType: "string"
        },

    ]

    for (var i = 0; i < watchListItemsDB.length; i++) {
        if (typeof watchListItemsDB[i].IMDB_JSON === "string") {
            const imdb = JSON.parse(watchListItemsDB[i].IMDB_JSON);

            for (let f = 0; f < Object.keys(imdb_json_fields).length; f++) {
                try {
                    if (typeof imdb[imdb_json_fields[f].fieldName] === imdb_json_fields[f].type && typeof watchListItemsDB[i][imdb_json_fields[f].name] === "undefined") {
                        switch (imdb_json_fields[f].newType) {
                            case "number":
                                watchListItemsDB[i][imdb_json_fields[f].name] = parseInt(imdb[imdb_json_fields[f].fieldName]);
                                break;
                            case "string":
                                watchListItemsDB[i][imdb_json_fields[f].name] = imdb[imdb_json_fields[f].fieldName];
                                break;
                            case "array":
                                watchListItemsDB[i][imdb_json_fields[f].name] = imdb[imdb_json_fields[f].fieldName];
                                break;
                            default:
                                console.log("unknown type" + imdb_json_fields[f].type + " for " + imdb_json_fields[f].name)
                        }

                        watchListItemsDB[i].DBUpdated = true;
                    }
                } catch (e) { }
            }
        }
    }

    writeDB(db);

    return Response.json(["OK"]);
}