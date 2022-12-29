//use 'strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const session = require('express-session');
const sql = require('mssql');
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const request = require('request');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const util = require('util');

if (process.env.Public_URL === "") {
     console.log("Public_URL environment variable is not set");
     process.exit(1);
}

if (process.env.WatchList_User === "") {
     console.log("WatchList_User environment variable is not set");
     process.exit(1);
}

if (process.env.WatchList_Host === "") {
     console.log("WatchList_Host environment variable is not set");
     process.exit(1);
}

if (process.env.WatchList_Password === "") {
     console.log("WatchList_Password environment variable is not set");
     process.exit(1);
}

if (process.env.WatchList_DB === "") {
     console.log("WatchList_DB environment variable is not set");
     process.exit(1);
}

if (process.env.Secret === "") {
     console.log("Secret environment variable is not set");
     process.exit(1);
}

const RAPIDAPI_KEY=process.env.RAPIDAPI_KEY;
const Public_URL=process.env.Public_URL;
const app = express();

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

const config = {
     user: process.env.WatchList_User,
     password: process.env.WatchList_Password,
     server: process.env.WatchList_Host,
     database: process.env.WatchList_DB,
     trustServerCertificate: true
};

/*var corsOptions = {
  origin: 'http://localhost:8100',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/

// Date prototype to return date in format yyyymmdd. Used to convert date field for database queries
Date.prototype.yyyymmdd = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     
     return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

const memoryStore = new session.MemoryStore();

const sessionConfig = {
     secret: process.env.Secret,
     resave: true,
     saveUninitialized: false,
     store: memoryStore,
     cookie: {
          sameSite: 'none',
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
     }
}

const swaggerOptions = {  
     swaggerDefinition: {
          openapi: '3.0.1',
          info: {  
               title:'WatchList API',
               description: 'WatchList API',
               version:'2.0.0',
           displayRequestDuration: true
          },
          components: {
               schemas: {
                    WatchList: {
                         properties: {
                              WatchListID: {
                                   type: "integer",
                                   description: "WatchList ID"
                              },
                              WatchListItemID: {
                                   type: "integer",
                                   description: "WatchList Item ID"
                              },
                              StartDate: {
                                   type: "string",
                                   format: "date",
                                   description: "WatchList Start Date"
                              },
                              EndDate: {
                                   type: "string",
                                   format: "date",
                                   description: "WatchList End Date"
                              },
                              WatchListSourceID: {
                                   type: "integer",
                                   description: "WatchList Source"
                              },
                              Season: {
                                   type: "integer",
                                   description: "WatchList Season"
                              },
                              Rating: {
                                   type: "integer",
                                   description: "Movie/Show Rating"
                              },
                              Notes: {
                                   type: "string",
                                   description: "WatchList Notes"
                              },
                         }
                    },
                    WatchListItem: {
                         properties: {
                              WatchListItemID: {
                                   type: "integer",
                                   description: "WatchList Item ID"
                              },
                              WatchListItemName: {
                                   type: "string",
                                   format: "date",
                                   description: "WatchList Item Name"
                              },
                              WatchListTypeID: {
                                   type: "integer",
                                   description: "WatchList Type"
                              },
                              IMDB_URL: {
                                   type: "string",
                                   description: "WatchList Item IMDB URL"
                              },
                              ItemNotes: {
                                   type: "string",
                                   description: "WatchList Item Notes"
                              },
                         }
                    },
                    WatchListQueueItems: {
                         properties: {
                              WatchListQueueItemID: {
                                   type: "integer",
                                   description: "WatchList Queue Item ID"
                              },
                              WatchListItemID: {
                                   type: "integer",
                                   description: "WatchList Item ID"
                              },
                              Notes: {
                                   type: "string",
                                   description: "WatchList Item Notes"
                              },
                         }
                    },
                    WatchListSources: {
                         properties: {
                              WatchListSourceID: {
                                   type: "integer",
                                   description: "WatchList Source ID"
                              },
                              WatchListSourceName: {
                                   type: "string",
                                   description: "WatchList Source Name"
                              }
                         }
                    },
                    WatchListTypes: {
                         properties: {
                              WatchListTypeID: {
                                   type: "integer",
                                   description: "WatchList Type ID"
                              },
                              WatchListTypeName: {
                                   type: "string",
                                   description: "WatchList Type Name"
                              }
                         }
                    }
               },
               securitySchemes: {
                    bearerAuth: {
                         type: 'http',
                         scheme: 'bearer',
                         bearerFormat: 'JWT',
                    }
               }
          },
          security: [{
               bearerAuth: []
          }],
          servers: [{
               url: 'http://localhost:8000',
               description: 'Development server',
          },
          {
               url: Public_URL,
               description: 'Production Server',
          }],
          tags: [{
               name: 'WatchList',
               description: 'WatchList'
          },
          {
               name: 'WatchListItems',
               description: 'WatchListItems'
          },
          {
               name: 'WatchListQueue',
               description: 'WatchListQueue'
          },
          {
               name: 'WatchListSources',
               description: 'WatchListSources'
          },
          {
               name: 'WatchListTypes',
               description: 'WatchListTypes'
          }],
     },  
     apis:['watchlistbackend.js']
}
app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static('Web/css'));
app.use(express.static('Web/js'));
app.use(express.static('swagger'));
app.set("trust proxy", 1);
app.use(session(sessionConfig));

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

// Middleware that is called before any endpoint is reached
app.use(function (req, res, next) {
     if (req.url !== "/" && !req.url.endsWith(".css") && !req.url.endsWith(".js") && !req.url.startsWith("/IsLoggedIn")){
         if (req.session.page_views) {
              req.session.page_views++;

              if (req.url.startsWith("/Login")) {
                   res.send(["OK",req.session.userPayload]);
              } else {
                   next();
              }
         } else if (req.url.startsWith("/Login")){
              next();
         } else {
              res.sendStatus("403");
         }
     } else {
         next();
     }
});

app.get('/IsLoggedIn', (req, res) => {
	res.send(["OK",req.session.page_views]);
});

//Default route doesn't need to return anything 
app.get('/', (req, res) => {
     //res.send("");
	 app.use(express.static('Web'))
	 res.setHeader('Content-Type', 'text/html')
	 res.sendFile(path.join(__dirname, 'Web/index.html'));
});

/*
app.get('/GetPosters', async (req, res) => {
     const SQL=`SELECT TOP(50) WatchListItems.WatchListItemID,CASE WHEN WatchListItems.WatchListItemAltName IS NOT NULL THEN WatchListItems.WatchListItemAltName ELSE WatchListItems.WatchListItemName END AS WatchListItemName,WatchListItems.IMDB_URL FROM WatchListItems LEFT JOIN IMDBPosters on IMDBPosters.WatchListItemID=WatchListItems.WatchListItemID WHERE IMDBPosters.PosterURL IS NULL
     AND imdb_url is not null
     AND WatchListItems.WatchListItemID NOT IN(10,28,84,92,163,170,178,260,261,344)
     ORDER BY WatchListItemID`;
     const result=await execSQL(res,SQL,null,true,true);
     let posterResults=[];

     if (result[0] !== "OK") {
         res.send("Oh shit" + result[1]);
         return;
     }

     const items=result[1];

     for (let i=0;i<items.length;i++) {
         console.log(`Starting ${items[i]["WatchListItemName"]}`);
         const options = {
               method: 'GET',
               url: 'https://imdb107.p.rapidapi.com/',
               qs: {s: items[i]["WatchListItemName"], page: '1', r: 'json'},
               headers: {
                    'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    useQueryString: true
               }
          };

          await new Promise(resolve => setTimeout(resolve, 1000));

          request(options, async function (error, response, body) {
	           if (error) {
                   console.log(error)
                   throw new Error(error);
               }

               const searchResults=JSON.parse(body);
               //console.log(searchResults);
               if ((typeof searchResults["Response"] !== 'undefined' && searchResults["Response"] == "False") || typeof searchResults["Search"] === 'undefined') {
                   //posterResults.push([items[i]["WatchListItemID"],searchResults["Error"]]);
                   console.log(`Not adding ${items[i]["WatchListItemName"]} because ${body}`);
                   return;
               }

               for (let j=0;j<searchResults["Search"].length;j++) {
                    const imdbURL=`https://www.imdb.com/title/${searchResults["Search"][j].imdbID}`;

                    try {
                        const itemIMDBURL=items[i]["IMDB_URL"].slice(0,items[i]["IMDB_URL"].length-1);
//console.log(`itemIMDBURL=${itemIMDBURL} imdbURL=${imdbURL}`);
                        if (itemIMDBURL === imdbURL) {
                            const params=[['WatchListItemID',sql.Int,items[i]["WatchListItemID"]],['PosterURL',sql.VarChar,searchResults["Search"][j]["Poster"]]];
                            const SQL="IF (SELECT COUNT(*) FROM IMDBPosters WHERE WatchListItemID=@WatchListItemID) = 0 INSERT INTO IMDBPosters(WatchListItemID,PosterURL) VALUES(@WatchListItemID,@PosterURL) ELSE UPDATE IMDBPosters SET PosterURL=@PosterURL WHERE WatchListItemID=@WatchListItemID";

                            //posterResults.push([items[i]["WatchListItemID"],"OK"]);
                            console.log(`Adding ${items[i]["WatchListItemName"]}`);
                            execSQL(res,SQL,params,true,true);

                            continue;
                        }
                    } catch(e) {
                        console.log(`Not adding ${items[i]["WatchListItemID"]} because error ${e}`);
                        break;
                    }
               }
          });

          if (i==items.length-1) {
              return res.send("");
          }
     }
});*/

/** 
 * @swagger 
 * /AddWatchList: 
 *    put:
 *        tags: 
 *          - WatchList
 *        summary: Add new WatchList item
 *        description: Add WatchList item
 *        parameters:
 *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: StartDate
 *             in: query
 *             description: Start Date
 *             required: true
 *             schema:
 *                  type: string
 *           - name: EndDate
 *             in: query
 *             description: End Date
 *             required: false
 *             schema:
 *                  type: string
 *           - name: WatchListSourceID
 *             in: query
 *             description: WatchList Source ID
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Season
 *             in: query
 *             description: Season
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Rating
 *             in: query
 *             description: Rating
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/AddWatchList', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     const startDate=(typeof req.query.StartDate !== 'undefined' ? req.query.StartDate : null);
     const endDate=(typeof req.query.EndDate !== 'undefined' ? req.query.EndDate : null); // Optional
     const sourceID=(typeof req.query.WatchListSourceID !== 'undefined' ? req.query.WatchListSourceID : null);
     const season=(typeof req.query.Season !== 'undefined' ? req.query.Season : null);
     const rating=(typeof req.query.Rating !== 'undefined' ? req.query.Rating : null);
     const notes=(typeof req.query.Notes !== 'undefined' ? req.query.Notes : null);
    
     if (userID === null) {
          res.send(["User ID was not provided"]);
          return;
     } else if (watchListItemID === null) {
          res.send(["Item ID was not provided"]);
          return;
     } else if (startDate === null) {
          res.send(["Start Date was not provided"]);
          return;
     } else {
          let params = [['UserID',sql.Int,userID],['WatchListItemID',sql.Int,watchListItemID],['StartDate',sql.VarChar,startDate]];

          let columns=`UserID,WatchListItemID,StartDate`;
          let values = `@UserID,@WatchListItemID,@StartDate`;

          columns+=`,EndDate`;

          if (endDate != null) {
               params.push(['EndDate',sql.VarChar,endDate]);
               values+=`,@EndDate`;
          } else {
               values+=`,NULL`;
          }

          columns+=`,WatchListSourceID`;

          if (sourceID != null) {
               params.push(['WatchListSourceID',sql.Int,sourceID]);
               values+=`,@WatchListSourceID`;
          } else {
               values+=`,NULL`;
          } 

          columns+=`,Season`;

          if (season != null) {
               params.push(['Season',sql.Int,season]);
               values+=`,@Season`;
          } else {
               values+=`,NULL`;
          } 

          columns+=`,Rating`;

          if (rating != null) {
               params.push(['Rating',sql.Int,rating]);
               values+=`,@Rating`;
          } else {
               values+=`,NULL`;
          } 

          columns+=`,Notes`;

          if (notes != null && notes != 'null') {
               params.push(['Notes',sql.VarChar,notes]);
               values+=`,@Notes`;
          } else {
               values+=`,NULL`;
          } 

          const SQL=`INSERT INTO WatchList(${columns}) VALUES (${values});`;

          execSQL(res,SQL,params,true);
     }
});

/** 
 * @swagger 
 * /AddWatchListItem: 
 *    put:
 *        tags: 
 *          - WatchListItems
 *        summary: Add new WatchList item
 *        description: Add WatchList item
 *        parameters:
 *           - name: WatchListItemName
 *             in: query
 *             description: Name
 *             required: true
 *             schema:
 *                  type: string
 *           - name: Type
 *             in: query
 *             description: Type
 *             required: true
 *             schema:
 *                  type: string
 *           - name: IMDB_URL
 *             in: query
 *             description: IMDB URL
 *             required: false
 *             schema:
 *                  type: string
 *           - name: IMDB_Poster
 *             in: query
 *             description: IMDB image
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/AddWatchListItem', (req, res) => {
     const name=(typeof req.query.WatchListItemName !== 'undefined' ? req.query.WatchListItemName : null);
     const type=(typeof req.query.WatchListTypeID !== 'undefined' ? req.query.WatchListTypeID : null);
     const imdb_url=(typeof req.query.IMDB_URL !== 'undefined' ? req.query.IMDB_URL : null);
     const imdb_poster=(typeof req.query.IMDB_Poster !== 'undefined' ? req.query.IMDB_Poster : null);
     const notes=(typeof req.query.Notes !== 'undefined' ? req.query.Notes : null);
    
     if (name === null) {
          res.send(["ERROR","Name was not provided"]);
          return;
     } else if (type === null) {
          res.send(["ERROR","Type was not provided"]);
          return;
     } else {
          const params = [['WatchListItemName',sql.VarChar,name],['WatchListTypeID',sql.VarChar,type]];

          let columns=`WatchListItemName,WatchListTypeID`;
          let values = `@WatchListItemName,@WatchListTypeID`;

          columns+=`,IMDB_URL`;

          if (imdb_url != null) {
               params.push(['IMDB_URL',sql.VarChar,imdb_url]);
               values+=`,@IMDB_URL`;
          } else {
               values+=`,NULL`;
          }

          columns+=`,IMDB_Poster`;

          if (imdb_poster != null) {
               params.push(['IMDB_Poster',sql.VarChar,imdb_poster]);
               values+=`,@IMDB_Poster`;
          } else {
               values+=`,NULL`;
          }

          columns+=`,ItemNotes`;

          if (notes != null && notes != 'null' && typeof notes != 'undefined') {
               params.push(['ItemNotes',sql.VarChar,notes]);
               values+=`,@ItemNotes`;
          } else {
               values+=`,NULL`;
          } 
          
          const SQL=`IF (SELECT COUNT(*) FROM WatchListItems WHERE IMDB_URL=@IMDB_URL) = 0 INSERT INTO WatchListItems(${columns}) VALUES (${values});`;

          execSQL(res,SQL,params,true);
     }
});

/** 
 * @swagger 
 * /AddWatchListQueueItem: 
 *    put:
 *        tags: 
 *          - WatchListQueue
 *        summary: Add new WatchList Queue item
 *        description: Add WatchList Queue item
 *        parameters:
  *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/AddWatchListQueueItem', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     const notes=(typeof req.query.Notes !== 'undefined' ? req.query.Notes : null);
 
     if (userID === null) {
          res.send(["User ID was not provided"]);
          return;
     } else if (watchListItemID === null) {
          res.send(["Queue Item ID was not provided"]);
          return;
     } else {
          let params = [['UserID',sql.Int,userID],['WatchListItemID',sql.Int,watchListItemID]];

          let columns=`UserID,WatchListItemID`;
          let values = `@UserID,@WatchListItemID`;

          columns+=`,Notes`;

          if (notes != null && notes != 'null') {
               params.push(['Notes',sql.VarChar,notes]);
               values+=`,@Notes`;
          } else {
               values+=`,NULL`;
          } 
  
          const SQL=`INSERT INTO WatchListQueueItems(${columns}) VALUES (${values});`;

          execSQL(res,SQL,params,true,true);
     }
});

/** 
 * @swagger 
 * /DeleteWatchList: 
 *    put:
 *        tags: 
 *          - WatchList
 *        summary: Delete WatchList
 *        description: Delete WatchList
 *        parameters:
 *           - name: WatchListID
 *             in: query
 *             description: WatchList ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/DeleteWatchList', (req, res) => {
     const watchListID=(typeof req.query.WatchListID !== 'undefined' ? req.query.WatchListID : null);

     if (watchListID === null) {
          res.send(["ID was not provided"]);
          return;
     } else {
          const params = [['WatchListID',sql.Int,watchListID]];
          
          const SQL=`DELETE TOP(1) FROM WatchList WHERE WatchListID=@WatchListID`;

          execSQL(res,SQL,params,false);
     }
});

/** 
 * @swagger 
 * /DeleteWatchListItem: 
 *    put:
 *        tags: 
 *          - WatchListItems
 *        summary: Delete WatchList Item
 *        description: Delete WatchList Item
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/DeleteWatchListItem', (req, res) => {
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     
     if (watchListItemID === null) {
          res.send(["Item ID was not provided"]);
          return;
     } else {
          const params =[['WatchListItemID',sql.Int,watchListItemID]];

          const SQL=`DELETE TOP(1) FROM WatchListItems WHERE WatchListItemID=@WatchListItemID`;

          execSQL(res,SQL,params,false);
     }
});

/** 
 * @swagger 
 * /DeleteWatchListQueueItem: 
 *    put:
 *        tags: 
 *          - WatchListQueue
 *        summary: Delete WatchList Queue Item
 *        description: Delete WatchList  QueueItem
 *        parameters:
 *           - name: WatchListQueueItemID
 *             in: query
 *             description: WatchList Queue Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/DeleteWatchListQueueItem', (req, res) => {
     const watchListQueueItemID=(typeof req.query.WatchListQueueItemID !== 'undefined' ? req.query.WatchListQueueItemID : null);

     if (watchListQueueItemID === null) {
          res.send(["Queue Item ID was not provided"]);
          return;
     } else {
          const params =[['WatchListQueueItemID',sql.Int,watchListQueueItemID]];

          const SQL=`DELETE TOP(1) FROM WatchListQueueItems WHERE WatchListQueueItemID=@WatchListQueueItemID`;

          execSQL(res,SQL,params,false);
     }
});

/** 
 * @swagger 
 * /GetWatchList: 
 *    get:
 *        tags: 
 *          - WatchList
 *        summary: Get WatchList records
 *        description: Get WatchList records
 *        parameters:
 *           - name: RecordLimit
 *             in: query
 *             description: Record Limit
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: SearchTerm
 *             in: query
 *             description: Search Term
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SortColumn
 *             in: query
 *             description: Sort Column
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SortDirection
 *             in: query
 *             description: Sort Direction
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SourceFilter
 *             in: query
 *             description: SourceFilter
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: TypeFilter
 *             in: query
 *             description: TypeFilter
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: IncompleteFilter
 *             in: query
 *             description: IncompleteFilter
 *             required: false
 *             schema:
 *                  type: boolean
 *        responses:  
 *          200: 
 *            description: "WatchList records on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchList', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);
     const searchTerm=(typeof req.query.SearchTerm !== 'undefined' ? req.query.SearchTerm : null); 
     let sortColumn=(typeof req.query.SortColumn !== 'undefined' ? req.query.SortColumn : null);
     let sortDirection=(typeof req.query.SortDirection !== 'undefined' ? req.query.SortDirection : null);
     let recordLimit=(typeof req.query.RecordLimit !== 'undefined' ? req.query.RecordLimit : null);
     let sourceFilter=(typeof req.query.SourceFilter !== 'undefined' ? req.query.SourceFilter : null);
     let typeFilter=(typeof req.query.TypeFilter !== 'undefined' ? req.query.TypeFilter : null);
     let incompleteFilter=(req.query.IncompleteFilter === "true" ? true : false);

     if (userID === null) {
          res.send(["User ID was not provided"]);
          return;
     }

     if (sortColumn === null || typeof sortColumn == 'undefined')
          sortColumn="WatchListItemName";
     else if (sortColumn === "ID")
          sortColumn="WatchListID";
     else if (sortColumn === "Name") 
          sortColumn="WatchListItemName";
     else if (sortColumn === "StartDate" || sortColumn === "EndDate") {} // Nothing to do for these columns

     if (sortDirection === null || typeof sortDirection == 'undefined' ||(sortDirection !== "ASC" && sortDirection != "DESC"))
          sortDirection="ASC";

     let params  = [['UserID',sql.Int,userID]];
     let whereClause = ` WHERE UserID=@UserID`;

     if (searchTerm != null) {
          params.push(['SearchTerm',sql.VarChar,searchTerm]);
          whereClause+=` AND (WatchListItemName LIKE '%' + @SearchTerm + '%' OR Notes LIKE '%' + @SearchTerm + '%')`;
     }

     if (sourceFilter != null) {
          whereClause+=` AND WatchList.WatchListSourceID=${sourceFilter}`;
     }

     if (typeFilter != null) {
          whereClause+=` AND WatchListItems.WatchListTypeID=${typeFilter}`;
     }

     if (incompleteFilter == true) {
          whereClause+=` AND WatchList.EndDate IS NULL`;
     }
       
     const orderBy=` ORDER BY ${(sortColumn == "WatchListItemName" ? `WatchListItems` : `WatchList`)}.${sortColumn} ${sortDirection}`;
 
     const SQL=`SELECT ` + (recordLimit != null ? `TOP(${recordLimit})` : ``) + ` WatchListID,WatchList.WatchListItemID,WatchListTypes.WatchListTypeID,CONVERT(VARCHAR(10),StartDate,126) AS StartDate,CONVERT(VARCHAR(10),EndDate,126) AS EndDate,WatchList.WatchListSourceID,Season,Rating,Notes,IMDB_URL,IMDB_Poster FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID` + whereClause + orderBy;

     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListItems: 
 *    get:
 *        tags: 
 *          - WatchListItems
 *        summary: Get WatchList Items records
 *        description: Get WatchList Items records
 *        parameters:
 *           - name: RecordLimit
 *             description: Record Limit
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: SearchTerm
 *             in: query
 *             description: Search Term
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SortColumn
 *             in: query
 *             description: Sort Column
 *             required: false
 *             schema:
 *                  type: string
 *           - name: SortDirection
 *             in: query
 *             description: Sort Direction
 *             required: false
 *             schema:
 *                  type: string
 *           - name: IMDBURLMissing
 *             in: query
 *             description: IMDBURLMissing
 *             required: false
 *             schema:
 *                  type: boolean
 *        responses:  
 *          200: 
 *            description: "WatchList item records on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListItems', (req, res) => {
     // WatchListItems applies to all users so no need to provide user ID
     const searchTerm=(typeof req.query.SearchTerm !== 'undefined' ? req.query.SearchTerm : null); 
     const IMDBURLMissing=(req.query.IMDBURLMissing == "true" ? true : false);
     let recordLimit=(typeof req.query.RecordLimit !== 'undefined' ? req.query.RecordLimit : null);
     let sortColumn=(typeof req.query.SortColumn !== 'undefined' ? req.query.SortColumn : null);
     let sortDirection=(typeof req.query.SortDirection !== 'undefined' ? req.query.SortDirection : null);

     if (sortColumn === null || typeof sortColumn == 'undefined')
          sortColumn="WatchListItemName";
     else if (sortColumn === "ID")
          sortColumn="WatchListItemID";
     else if (sortColumn === "Name")
          sortColumn="WatchListItemName";
     else if (sortColumn === "Type")
          sortColumn="WatchListTypeID";
     else if (sortColumn === "IMDB_URL") {} // Nothing to do for this columns

     if (sortDirection === null || typeof sortDirection == 'undefined' ||(sortDirection !== "ASC" && sortDirection != "DESC"))
          sortDirection="ASC";
     
     let params = [['SortColumn',null,sortColumn],['SortDirection',null,sortDirection]];
     let whereClause=``;

     if (searchTerm != null) {
          params.push(['SearchTerm',sql.VarChar,searchTerm]);
          whereClause+=(whereClause === '' ? ` WHERE ` : ` AND `) + `(WatchListItemName LIKE '%' + @SearchTerm + '%' OR IMDB_URL LIKE '%' + @SearchTerm + '%' OR ItemNotes LIKE '%' + @SearchTerm + '%')`;
     }

     if (IMDBURLMissing == true) {
          whereClause+=` AND IMDB_URL IS NULL OR IMDB_URL=''`;
     }
     
     const SQL=`SELECT ` + (recordLimit != null ? `TOP(${recordLimit})` : ``) + ` * FROM WatchListItems ${whereClause} ORDER BY @SortColumn @SortDirection`;
 
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListQueue: 
 *    get:
 *        tags: 
 *          - WatchListQueue
 *        summary: Get WatchList Queue Items records
 *        description: Get WatchList Queue Items records
 *        parameters:
 *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: SearchTerm
 *             in: query
 *             description: Search Term
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "WatchList Queue records on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListQueue', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);
     const searchTerm=(typeof req.query.SearchTerm !== 'undefined' ? req.query.SearchTerm : null); 

     if (userID === null) {
          res.send(["User ID was not provided"]);
          return;
     }

     let params  = [['UserID',sql.Int,userID]];
     let whereClause = ` WHERE UserID=@UserID`;

     if (searchTerm != null) {
          params.push(['SearchTerm',sql.VarChar,searchTerm]);
          whereClause=+` AND (WatchListItemName LIKE '%' + @SearchTerm + '%' OR Notes LIKE '%' + @SearchTerm + '%')`;
     }
 
     const SQL=`SELECT WatchListQueueItemID, WatchListItems.WatchListItemID, WatchListItems.WatchListItemName, WatchListTypes.WatchListTypeID, Notes, IMDB_Poster FROM WatchListQueueItems LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchListQueueItems.WatchListItemID LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID ` + whereClause;
 
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListSources: 
 *    get:
 *        tags: 
 *          - WatchListSources
 *        summary: Get WatchList Sources
 *        description: Get WatchList Sources
 *        responses:  
 *          200: 
 *            description: "WatchList source on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListSources', (req, res) => {
     const SQL="SELECT * FROM WatchListSources ORDER BY WatchListSourceName";
  
     execSQL(res,SQL,null,true)
});

/** 
 * @swagger 
 * /GetWatchListTypes: 
 *    get:
 *        tags: 
 *          - WatchListTypes
 *        summary: Get WatchList Types
 *        description: Get WatchList Types
 *        responses:  
 *          200: 
 *            description: "WatchList types on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListTypes', (req, res) => {
     const SQL="SELECT * FROM WatchListTypes ORDER BY WatchListTypeName";
  
     execSQL(res,SQL,null,true);
});

/** 
 * @swagger 
 * /GetWatchListMovieStats: 
 *    get:
 *        tags: 
 *          - WatchList
 *        summary: Get WatchList Movie Stats
 *        description: Get WatchList Movie Stats
 *        parameters:
 *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "WatchList movie stats on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListMovieStats', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);

     if (userID === null) {
          res.send(["ERROR","User ID was not provided"]);
          return;
     }
     
     const params=[['UserID',sql.Int,userID]];

     const SQL="WITH GetFrequentItems AS (SELECT UserID,WatchListItemName,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID WHERE WLI.WatchListTypeID=1 GROUP BY UserID,WatchListItemName) SELECT TOP(10) *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=@UserID AND ItemCount > 1 ORDER BY ItemCount DESC";
  
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListSourceStats: 
 *    get:
 *        tags: 
 *          - WatchListSources
 *        summary: Get WatchList Source Stats
 *        description: Get WatchList Sources Stats
 *        responses:  
 *          200: 
 *            description: "WatchList Sources stats on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListSourceStats', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);

     if (userID === null) {
          res.send(["ERROR","User ID was not provided"]);
          return;
     }
     
     const params=[['UserID',sql.Int,userID]];

     const SQL="SELECT WatchList.WatchListSourceID, WatchListSources.WatchListSourceName, COUNT(WatchList.WatchListSourceID) AS SourceCount FROM WatchList LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID WHERE UserID=@UserID GROUP BY WatchList.WatchListSourceID,WatchListSources.WatchListSourceName ORDER BY SourceCount DESC";
  
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListTopRated: 
 *    get:
 *        tags: 
 *          - WatchList
 *        summary: Get WatchList Top Rated 
 *        description: Get WatchList Top Rated
 *        parameters:
 *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "WatchList Top Rated stats on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListTopRatedStats', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);

     if (userID === null) {
          res.send(["ERROR","User ID was not provided"]);
          return;
     }
     
     const params=[['UserID',sql.Int,userID]];

     const SQL="SELECT TOP(10) WatchListItemName,Season,Rating FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID WHERE Rating IS NOT NULL AND UserID=@UserID ORDER BY Rating DESC";
  
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /GetWatchListTVStats: 
 *    get:
 *        tags: 
 *          - WatchList
 *        summary: Get WatchList TV Stats
 *        description: Get WatchList TV Stats
 *        parameters:
 *           - name: UserID
 *             in: query
 *             description: User ID
 *             required: true
 *             schema:
 *                  type: integer
 *        responses:  
 *          200: 
 *            description: "WatchList TV stats on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.get('/GetWatchListTVStats', (req, res) => {
     const userID=(typeof req.session.userPayload !== 'undefined' ? req.session.userPayload[0].UserID : null);

     if (userID === null) {
          res.send(["ERROR","User ID was not provided"]);
          return;
     }
     
     const params=[['UserID',sql.Int,userID]];

     const SQL="WITH GetFrequentItems AS (SELECT UserID,WLI.WatchListItemName,MIN(StartDate) AS StartDate,MAX(StartDate) AS EndDate,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE WLI.WatchListTypeID=2 AND WL.EndDate IS NOT NULL GROUP BY UserID,WatchListItemName) SELECT TOP(10) *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=@UserID AND ItemCount > 1 ORDER BY ItemCount DESC";
  
     execSQL(res,SQL,params,true);
});

/** 
 * @swagger 
 * /IsIMDBSearchEnabled: 
 *    get:
 *        tags: 
 *          - IMDB
 *        summary: Get flag that returns true if RapidAPI key is set to allow IMDB search
 *        description: Get flag that returns true if RapidAPI key is set to allow IMDB search
 *        responses:  
 *          200: 
 *            description: "Returns true or false"
 *   
 */
app.get('/IsIMDBSearchEnabled', (req, res) => {
     if (RAPIDAPI_KEY == null) {
          res.send(false);
     } else {
          res.send(true);
     }
});

/** 
 * @swagger 
 * /Login: 
 *    put:
 *        tags: 
 *          - Login
 *        summary: Login endpoint
 *        description: Login endpoint
 *        parameters:
 *           - name: wl_username
 *             in: header
 *             description: User name
 *             required: true
 *             schema:
 *                  type: string 
 *           - name: wl_password
 *             in: header
 *             description: Password
 *             required: true
 *             schema:
 *                  type: string
 *                  format: password
 *        responses:  
 *          200: 
 *            description: "Returns ['OK',USERPAYLOADOBJECT] on success or 403 error if login failed" 
 *   
 */
app.put('/Login', async (req, res) => {
     const username=(typeof req.headers["wl_username"] !== 'undefined' ? req.headers["wl_username"] : null);
     const password=(typeof req.headers["wl_password"] !== 'undefined' ? req.headers["wl_password"] : null);

     if (username === null || password === null) {
          return res.status(403).send('Unauthorized 2');
     } else {
          const sanitizedUsername=(typeof username === 'string' && username !== "" && username.length < 50 ? username : null);
          const sanitizedPassword=(typeof password === 'string' && password !== "" && password.length < 50 ? password : null);

          if (sanitizedUsername === null) {
               return res.status(403).send('Unauthorized 3');
          }

          if (sanitizedPassword === null) {
               return res.status(403).send('Unauthorized 4');
          }

          try {
               const params = [['Username',sql.VarChar,username],['Password',sql.VarChar,password]]; 
               const loginResult=await execSQL(res,"OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;SELECT TOP(1) UserID,CONVERT(VARCHAR(50),DECRYPTBYKEY(Username)) AS Username,CONVERT(VARCHAR(50),DECRYPTBYKEY(Realname)) AS Realname FROM Users WHERE @Username = CONVERT(VARCHAR(50),DECRYPTBYKEY(Username))AND @Password = CONVERT(VARCHAR(50),DECRYPTBYKEY(Password));CLOSE SYMMETRIC KEY WatchListKey",params,true, true);

               if (loginResult[0] === "OK" && loginResult[1].length === 1) {
                    req.session.page_views = 1
                    req.session.userPayload=loginResult[1];

                    res.send(["OK",loginResult[1]]);
               } else {
                    return res.status(403).send('Unauthorized 5');
               }
          } catch (err) {
               return res.status(403).send('Unauthorized 6');
          }
     }
});

/** 
 * @swagger 
 * /SignOut: 
 *    get:
 *        tags: 
 *          - Login
 *        summary: Logout endpoint
 *        description: Logout endpoint
 *        responses:  
 *          200: 
 *            description: "Returns ['OK']"
 *   
 */
app.get('/SignOut', (req, res) => {
     req.session.destroy();
     
     res.send(["OK"]);
});

/** 
 * @swagger 
 * /SearchIMDB: 
 *    get:
 *        tags: 
 *          - IMDB
 *        summary: Search IMDB
 *        description: Search IMDB
 *        parameters:
 *           - name: SearchTerm
 *             in: query
 *             description: SearchTerm
 *             required: true
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "Returns search results on success or error message"
 *   
 */
app.get('/SearchIMDB', (req, res) => {
     const searchTerm=(typeof req.query.SearchTerm !== 'undefined' ? req.query.SearchTerm : null); 
    
     if (searchTerm === null) {
          res.send("Search term not provided");
     } else if (RAPIDAPI_KEY == null) {
          res.send("IMDB search is not enabled");
     } else {
          const options = {
               method: 'GET',
               url: 'https://imdb107.p.rapidapi.com/',
               qs: {s: searchTerm, page: '1', r: 'json'},
               headers: {
                    'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    useQueryString: true
               }
          };

          request(options, function (error, response, body) {
	       if (error) throw new Error(error);
               res.send(body);
          });
     }
});

/** 
 * @swagger 
 * /UpdateWatchList: 
 *    put:
 *        tags: 
 *          - WatchList
 *        summary: Update WatchList item
 *        description: Update WatchList item
 *        parameters:
 *           - name: WatchListID
 *             in: query
 *             description: WatchList ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: StartDate
 *             in: query
 *             description: Start Date
 *             required: false
 *             schema:
 *                  type: string
 *           - name: EndDate
 *             in: query
 *             description: End Date
 *             required: false
 *             schema:
 *                  type: string
 *           - name: WatchListSourceID
 *             in: query
 *             description: WatchList Source ID
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Season
 *             in: query
 *             description: Season
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Rating
 *             in: query
 *             description: Rating
 *             required: false
 *             schema:
 *                  type: integer
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/UpdateWatchList', (req, res) => {
     const watchListID=(typeof req.query.WatchListID !== 'undefined' ? req.query.WatchListID : null);
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     const startDate=(typeof req.query.StartDate !== 'undefined' ? req.query.StartDate : null);
     const endDate=(typeof req.query.EndDate !== 'undefined' ? req.query.EndDate : null); // Optional
     const sourceID=(typeof req.query.WatchListSourceID !== 'undefined' ? req.query.WatchListSourceID : null);
     const season=(typeof req.query.Season !== 'undefined' ? req.query.Season : null);
     const rating=(typeof req.query.Rating !== 'undefined' ? req.query.Rating : null);
     const notes=(typeof req.query.Notes !== 'undefined' ? req.query.Notes : null);
 
     if (watchListID === null) {
          res.send(["ERROR","WatchList ID was not provided"]);
          return;
     } else {
          let params = [['WatchListID',sql.Int,watchListID]];
          let updateStr='';
          
          if (watchListItemID !== null) {
               params.push(['WatchListItemID',sql.Int,watchListItemID]);
               updateStr+=`WatchListItemID=@WatchListItemID`;
          }
          
          if (startDate !== null) {
               params.push(['StartDate',sql.VarChar,new Date(startDate).yyyymmdd()]);
               updateStr+=(updateStr == '' ? '' : ',') + `StartDate=@StartDate`;
          }
           
          if (endDate !== null) {
               params.push(['EndDate',sql.VarChar,new Date(endDate).yyyymmdd()]);
               updateStr+=(updateStr == '' ? '' : ',') + `EndDate=@EndDate`;
          } else {
               updateStr+=(updateStr == '' ? '' : ',') + `EndDate=NULL`;
          }

          if (sourceID !== null) {
               params.push(['WatchListSourceID',sql.Int,sourceID]);
               updateStr+=(updateStr == '' ? '' : ',') + `WatchListSourceID=@WatchListSourceID`;
          }
 
          if (season !== null) {
               params.push(['Season',sql.VarChar,season]);
               updateStr+=(updateStr == '' ? '' : ',') + `Season=@Season`;
          }
          
          if (rating !== null) {
               params.push(['Rating',sql.VarChar,rating]);
               updateStr+=(updateStr == '' ? '' : ',') + `Rating=@Rating`;
          }
          
          params.push(['Notes',sql.VarChar,notes]);

          if (notes !== null) {
               updateStr+=(updateStr == '' ? '' : ',') + `Notes=@Notes`;
          } else {
               updateStr+=(updateStr == '' ? '' : ',') + `Notes=NULL`;
          }
 
          if (updateStr === '') { // No params were passed except for the mandatory columns
               res.send(["ERROR","No params were passed"]);
               return;
          }
          
          const SQL=`UPDATE WatchList SET ${updateStr} WHERE WatchListID=@WatchListID`;

          execSQL(res,SQL,params,true);
     }
});

/** 
 * @swagger 
 * /UpdateWatchListItem: 
 *    put:
 *        tags: 
 *          - WatchListItems
 *        summary: Update WatchList item
 *        description: Update WatchList item
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: Name
 *             in: query
 *             description: Name
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Type
 *             in: query
 *             description: Type
 *             required: false
 *             schema:
 *                  type: string
 *           - name: IMDB_URL
 *             in: query
 *             description: IMDB_URL
 *             required: false
 *             schema:
 *                  type: string
 *           - name: IMDB_Poster
 *             in: query
 *             description: IMDB_URL
 *             required: false
 *             schema:
 *                  type: string
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/UpdateWatchListItem', (req, res) => {
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     const name=(typeof req.query.WatchListItemName !== 'undefined' ? req.query.WatchListItemName : null);
     const typeID=(typeof req.query.WatchListTypeID !== 'undefined' ? req.query.WatchListTypeID : null);
     const imdb_url=(typeof req.query.IMDB_URL !== 'undefined' ? req.query.IMDB_URL : null);
     const imdb_poster=(typeof req.query.IMDB_Poster !== 'undefined' ? req.query.IMDB_Poster : null);
     const notes=(typeof req.query.ItemNotes !== 'undefined' ? req.query.ItemNotes : null);
    
     if (watchListItemID === null) {
          res.send(["ERROR","ID was not provided"]);
          return;
     } else {
          const params = [['WatchListItemID',sql.Int,watchListItemID]]; // Mandatory column

          let updateStr='';
          
          if (name !== null) {
              params.push(['WatchListItemName',sql.VarChar,name]);
              updateStr+=`WatchListItemName=@WatchListItemName`;
          }
          
          if (typeID !== null) {
              params.push(['WatchListTypeID',sql.VarChar,typeID]);
              updateStr+=(updateStr === '' ? '' : ',' ) + `WatchListTypeID=@WatchListTypeID`;
          }
          
          if (imdb_url != null) {
               params.push(['IMDB_URL',sql.VarChar,imdb_url]);
               updateStr+=(updateStr === '' ? '' : ',' ) + `IMDB_URL=@IMDB_URL`;
          }
          
          if (imdb_poster != null) {
              console.log(`IMDB_Poster=${imdb_poster}`);
               params.push(['IMDB_Poster',sql.VarChar,imdb_poster]);
               updateStr+=(updateStr === '' ? '' : ',' ) + `IMDB_Poster=@IMDB_Poster`;
          }

          if (notes != null && notes != 'null') {
               params.push(['ItemNotes',sql.VarChar,notes]);
               updateStr+=(updateStr === '' ? '' : ',' ) + `ItemNotes=@ItemNotes`;
          }

          if (updateStr === '') { // No params were passed except for the mandatory columns
               res.send(["ERROR","No params were passed"]);
               return;
          }
          const SQL=`UPDATE WatchListItems SET ${updateStr} WHERE WatchListItemID=@WatchListItemID;`;
  
          execSQL(res,SQL,params,true);
     }
});

/** 
 * @swagger 
 * /UpdateWatchListQueueItem: 
 *    put:
 *        tags: 
 *          - WatchListQueue
 *        summary: Update WatchList queue item
 *        description: Update WatchList queue item
 *        parameters:
 *           - name: WatchListQueueItemID
 *             in: query
 *             description: WatchList Queue Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID
 *             required: true
 *             schema:
 *                  type: integer
 *           - name: Notes
 *             in: query
 *             description: Notes
 *             required: false
 *             schema:
 *                  type: string
 *        responses:  
 *          200: 
 *            description: "['OK',''] on success, ['ERROR','ERROR MESSAGE'] on error"
 *   
 */
app.put('/UpdateWatchListQueueItem', (req, res) => {
     const userID=(typeof req.query.UserID !== 'undefined' ? req.query.UserID : null);
     const watchListQueueItemID=(typeof req.query.WatchListQueueItemID !== 'undefined' ? req.query.WatchListQueueItemID : null);
     const watchListItemID=(typeof req.query.WatchListItemID !== 'undefined' ? req.query.WatchListItemID : null);
     const notes=(typeof req.query.Notes !== 'undefined' ? req.query.Notes : null);
  
     if (userID === null) {
          res.send(["ERROR","User ID was not provided"]);
          return;
     } else if (watchListQueueItemID === null) {
          res.send(["Queue Item ID was not provided"]);
          return;
     } else {
          let params = [['UserID',sql.Int,userID],['WatchListQueueItemID',sql.Int,watchListQueueItemID]];

          if (watchListItemID !== null)
               params.push(['WatchListItemID',sql.Int,watchListItemID]);

          if (notes != null)
               params.push(['Notes',sql.VarChar,notes]);

          const SQL=`UPDATE WatchListQueueItems SET ` + (watchListItemID !== null ? `WatchListItemID=@WatchListItemID,` : ``) + (notes != null ? `Notes=@Notes` : `,Notes=NULL`) + ` WHERE UserID=@UserID AND WatchListQueueItemID=@WatchListQueueItemID`;
          execSQL(res,SQL,params,false);
     }
});

async function execSQL(res,SQL, params, isQuery = false, returnData=false) { // returnData returns the data to the calling method instead of sending it using res.send
     try {
          const pool = await sql.connect(config);
		 
	  let data = await pool.request();

	  // Bind params
          if (params != null) { // parameterize SQL query parameters 
               for (let i=0;i<params.length;i++) {
                    if (params[i][0] !== "SortColumn" && params[i][0] != "SortDirection") { // These columns are part of the ORDER BY and cannot be parameterized. It won't work if you try!!
                         data.input(params[i][0],params[i][1],params[i][2]);
                    } else if ((params[i][0] === "SortColumn" && params[i][2] != null))  {
                         const approvedSortColumnNames=['WatchListID','WatchListItemID','WatchListItemName','StartDate','EndDate','WatchListTypeID','IMDB_URL'];
 
                         if (params[i][0] == "SortColumn" && approvedSortColumnNames.includes(params[i][2]))
                              SQL=SQL.replace("@SortColumn",params[i][2]);
                         } else if ((params[i][0] === "SortDirection" && params[i][2] != null))  {
                              const approvedSortColumnDirections=['ASC','DESC'];
                              
                              if (params[i][0] == "SortDirection" && approvedSortColumnDirections.includes(params[i][2])) {
                                   SQL=SQL.replace("@SortDirection",params[i][2]);
                              }
                         }
                    }
               }
                 
          const result=await data.query(SQL);
         		 
          pool.close;
          sql.close;

          if (isQuery)
	       if (!returnData)
	            res.send(result.recordset);
	       else
                    return ["OK",result.recordset];
	  else
	       return ["OK",""];
     } catch (err) {
          const errorMsg=`execSQL(): An error occurred executing the SQL ${SQL} and the params ${params} with the error ${err}`;
	  console.log(errorMsg);
          
	  if (!returnData)
	       res.send(["ERROR",errorMsg]);
	  else
               return ["ERROR",errorMsg];
     	  //return["ERROR",errorMsg];
     }
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

