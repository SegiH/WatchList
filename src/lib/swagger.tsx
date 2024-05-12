import { createSwaggerSpec } from "next-swagger-doc"

import "server-only"

export const getApiDocs = async () => {
     const spec = createSwaggerSpec({
          apiFolder: "/src/app/api",
          definition: {
               openapi: "3.0.0",
               info: {
                    title: "WatchList Swagger API",
                    version: "1.0",
               },
               components: {
                    schemas: {
                         Recommendation: {
                              properties: {
                                   Title: {
                                        type: "string",
                                        description: "Title of the recommendation",
                                   },
                                   Year: {
                                        type: "string",
                                        description: "Year of the recommendation",
                                   },
                                   ImdbID: {
                                        type: "string",
                                        description: "ID of the recommendation",
                                   },
                                   Type: {
                                        type: "string",
                                        description: "Type of the recommendation (Movie or TV)",
                                   },
                                   Poster: {
                                        type: "string",
                                        description: "Poster of the recommendation",
                                   },
                              }
                         },
                         Route: {
                              properties: {
                                   Name: {
                                        type: "string",
                                        description: "Name of the route",
                                   },
                                   DisplayName: {
                                        type: "string",
                                        description: "DisplayName of the route",
                                   },
                                   Path: {
                                        type: "string",
                                        description: "Path of the route",
                                   },
                                   Icon: {
                                        type: "object",
                                        description: "Icon of the route",
                                   },
                                   RequiresAuth: {
                                        type: "boolean",
                                        description: "Determines whether the route requires authentication",
                                   },
                              }
                         },
                         SearchIMDB: {
                              properties: {
                                   Title: {
                                        type: "string",
                                        description: "Title of the search result",
                                   },
                                   Year: {
                                        type: "string",
                                        description: "Year of the search result",
                                   },
                                   ImdbID: {
                                        type: "string",
                                        description: "IMDB ID of the search result",
                                   },
                                   Type: {
                                        type: "string",
                                        description: "Type of the search result",
                                   },
                                   Poster: {
                                        type: "string",
                                        description: "Image for the search result",
                                   },
                              }
                         },
                         User: {
                              properties: {
                                   UserID: {
                                        type: "string",
                                        description: "User ID of the user",
                                   },
                                   Username: {
                                        type: "string",
                                        description: "Username of the user",
                                   },
                                   Realname: {
                                        type: "string",
                                        description: "Real name of the user",
                                   },
                                   Password: {
                                        type: "string",
                                        description: "Password of the user",
                                   },
                                   Admin: {
                                        type: "boolean",
                                        description: "Admin status of the user",
                                   },
                                   Enabled: {
                                        type: "boolean",
                                        description: "Enabled status of the user",
                                   },
                              }
                         },
                         WatchList: {
                              properties: {
                                   WatchListID: {
                                        type: "number",
                                        description: "WatchList ID",
                                   },
                                   UserID: {
                                        type: "number",
                                        description: "User ID that logged this entry",
                                   },
                                   WatchListItemID: {
                                        type: "number",
                                        description: "WatchListItem ID that this log relates to",
                                   },
                                   StartDate: {
                                        type: "string",
                                        description: "Start date for this log entry",
                                   },
                                   EndDate: {
                                        type: "string",
                                        description: "End date for this log entry",
                                   },
                                   WatchListSourceID: {
                                        type: "number",
                                        description: "WatchList source ID that this log relates to",
                                   },
                                   Season: {
                                        type: "number",
                                        description: "Season of this log entry",
                                   },
                                   Archived: {
                                        type: "boolean",
                                        description: "Archived status of this log entry",
                                   },
                                   Notes: {
                                        type: "string",
                                        description: "Notes for this log entry",
                                   },
                                   Rating: {
                                        type: "number",
                                        description: "Rating of this log entry",
                                   },
                              }
                         },
                         WatchListItem: {
                              properties: {
                                   WatchListItemID: {
                                        type: "number",
                                        description: "WatchList Item ID",
                                   },
                                   WatchListItemName: {
                                        type: "string",
                                        description: "Name of this item",
                                   },
                                   WatchListTypeID: {
                                        type: "number",
                                        description: "WatchList type",
                                   },
                                   IMDB_URL: {
                                        type: "string",
                                        description: "IMDB URL for this item",
                                   },
                                   IMDB_Poster: {
                                        type: "string",
                                        description: "IMDB image of this item",
                                   },
                                   ItemNotes: {
                                        type: "string",
                                        description: "Notes for this item",
                                   },
                                   Archived: {
                                        type: "boolean",
                                        description: "Archived status of this log entry",
                                   }
                              }
                         },
                         WatchListItemsSortColumn: {
                              properties: {
                                   key: {
                                        type: "string",
                                        description: "",
                                   },
                                   value: {
                                        type: "string",
                                        description: "",
                                   }
                              }
                         },
                         WatchListMovieStat: {
                              properties: {
                                   UserID: {
                                        type: "number",
                                        description: "User ID that logged this entry",
                                   },
                                   WatchListItemName: {
                                        type: "string",
                                        description: "Name of the movie",
                                   },
                                   ItemCount: {
                                        type: "number",
                                        description: "Number of times this movie was watched",
                                   },
                                   IMDB_URL: {
                                        type: "string",
                                        description: "IMDB URL for this movie",
                                   },
                              }
                         },
                         WatchListSortColumn: {
                              properties: {
                                   key: {
                                        type: "string",
                                        description: "",
                                   },
                                   value: {
                                        type: "string",
                                        description: "",
                                   }
                              }
                         },
                         WatchListSource: {
                              properties: {
                                   WatchListSourceID: {
                                        type: "number",
                                        description: "WatchList Source ID",
                                   },
                                   WatchListSourceName: {
                                        type: "string",
                                        description: "WatchList Source name",
                                   }
                              }
                         },
                         WatchListSourceDetailSortOption: {
                              properties: {
                                   key: {
                                        type: "string",
                                        description: "",
                                   },
                                   value: {
                                        type: "string",
                                        description: "",
                                   }
                              }
                         },
                         WatchListSourceDtlStat: {
                              properties: {
                                   WatchListID: {
                                        type: "number",
                                        description: "WatchList ID of the source stat",
                                   },
                                   UserID: {
                                        type: "number",
                                        description: "User ID of the source stat",
                                   },
                                   WatchListItemID: {
                                        type: "number",
                                        description: "WatchListItem of the source stat",
                                   },
                                   StartDate: {
                                        type: "string",
                                        description: "Start date of the source stat",
                                   },
                                   EndDate: {
                                        type: "string",
                                        description: "End date of the source stat",
                                   },
                                   WatchListSourceID: {
                                        type: "number",
                                        description: "WatchList source ID of the source stat",
                                   },
                                   Season: {
                                        type: "number",
                                        description: "Season that this source stat relates to",
                                   },
                                   Archived: {
                                        type: "boolean",
                                        description: "Archived that this source stat relates to",
                                   },
                                   Notes: {
                                        type: "string",
                                        description: "Notes that this source stat relates to",
                                   },
                                   Rating: {
                                        type: "number",
                                        description: "Rating that this source stat relates to",
                                   },
                                   WatchListItemName: {
                                        type: "string",
                                        description: "Name that this source stat relates to",
                                   },
                                   WatchListTypeID: {
                                        type: "number",
                                        description: "WatchList type that this source stat relates to",
                                   },
                                   IMDB_URL: {
                                        type: "string",
                                        description: "IMDB URL that this source stat relates to",
                                   },
                                   IMDB_Poster: {
                                        type: "string",
                                        description: "IMDB image that this source stat relates to",
                                   },
                                   ItemNotes: {
                                        type: "string",
                                        description: "Notes that this source stat relates to",
                                   },
                                   WatchListSourceName: {
                                        type: "string",
                                        description: "WatchList Source name that this source stat relates to",
                                   }
                              }
                         },
                         WatchListSourceStat: {
                              properties: {
                                   WatchListSourceID: {
                                        type: "number",
                                        description: "WatchList of the source stat",
                                   },
                                   WatchListSourceName: {
                                        type: "string",
                                        description: "WatchList Source name of the source stat",
                                   },
                                   SourceCount: {
                                        type: "number",
                                        description: "Number of the times this source has been used",
                                   }
                              }
                         },
                         WatchListTopRatedStat: {
                              properties: {
                                   WatchListItemName: {
                                        type: "string",
                                        description: "Name of this item for the top rated stat",
                                   },
                                   Season: {
                                        type: "number",
                                        description: "Season for the top rated stat",
                                   },
                                   Rating: {
                                        type: "number",
                                        description: "Rating for the top rated stat",
                                   },
                                   IMDB_URL: {
                                        type: "string",
                                        description: "IMDB URL for the top rated stat",
                                   },
                              }
                         },
                         WatchListTVStat: {
                              properties: {
                                   UserID: {
                                        type: "number",
                                        description: "User ID that watched this show",
                                   },
                                   WatchListItemName: {
                                        type: "string",
                                        description: "Name of the show",
                                   },
                                   StartDate: {
                                        type: "string",
                                        description: "Start date that this show was watched",
                                   },
                                   EndDate: {
                                        type: "string",
                                        description: "End date that this show was watched",
                                   },
                                   ItemCount: {
                                        type: "number",
                                        description: "Number of times this show was watched",
                                   },
                                   IMDB_URL: {
                                        type: "string",
                                        description: "IMDB URL for this show",
                                   },
                              }
                         },
                         WatchListType: {
                              properties: {
                                   WatchListTypeID: {
                                        type: "number",
                                        description: "WatchList Type ID",
                                   },
                                   WatchListTypeName: {
                                        type: "string",
                                        description: "WatchList Type name",
                                   }
                              }
                         },
                    },
                    /*securitySchemes: {
                         BearerAuth: {
                              type: "http",
                              scheme: "bearer",
                              bearerFormat: "JWT",
                         },
                    },*/
               },               
               security: [],
          },
     })
     return spec
}
