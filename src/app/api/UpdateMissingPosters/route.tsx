import { NextRequest } from 'next/server';
import { getDB, logMessage, writeDB } from "../lib";
import IWatchListItem from '@/app/interfaces/IWatchListItem';

async function getImageBase64(URL: string) {

     const response = await fetch(URL);

     if (!response.ok) {
          return new Response('Failed to fetch image.', { status: 500 });
     }

     const arrayBuffer = await response.arrayBuffer();
     const base64 = Buffer.from(arrayBuffer).toString('base64');

     // Get the MIME type from headers, default to image/jpeg if unknown
     const contentType = response.headers.get('content-type') || 'image/jpeg';

     const base64Data = `data:${contentType};base64,${base64}`;

     return base64Data;
}

export async function GET(request: NextRequest) {
     try {
          const searchParams = request.nextUrl.searchParams;

          const watchListItemsProcessIds = searchParams.get("IDs");

          if (watchListItemsProcessIds === null) {
               return Response.json({ "ERROR": "IDs were not provided" });
          }

          const parseNumberList = str => str.split(',').map(s => { if (isNaN(s = s.trim()) || s === '') throw new Error(`Invalid number: "${s}"`); return Number(s); });

          const processIds = parseNumberList(watchListItemsProcessIds);
          const resultsSummary: any = [];

          const db = getDB();
     
          const watchListItemsDB = db.WatchListItems;

          const processResults = Promise.all(
               watchListItemsDB
               .filter((watchListItem: IWatchListItem, index: number) => { return processIds.includes(watchListItem.WatchListItemID)})
               .map(async (watchListItem: IWatchListItem, index: number) => {
                    if (watchListItem.IMDB_URL != "") {
                         logMessage(`Checking ${watchListItem.WatchListItemName} with the URL ${watchListItem.IMDB_URL}`);

                         const mediaViewerPageResponse = await fetch(watchListItem.IMDB_URL, {
                              headers: {
                                   'User-Agent': 'Next.js server',
                              },
                         });

                         if (!mediaViewerPageResponse.ok) {
                              logMessage(`Failed to fetch: ${mediaViewerPageResponse.statusText} with status: ${mediaViewerPageResponse.status}`);
                         }

                         const html = await mediaViewerPageResponse.text();

                         const mediaViewerMatch = html.match(
                              /<a[^>]*class="[^"]*\bipc-lockup-overlay\b[^"]*\bipc-focusable\b[^"]*"[^>]*href="([^"]+)"[^>]*>/
                         );

                         if (mediaViewerMatch && mediaViewerMatch[1]) {
                              const newImageURL = `https://imdb.com${mediaViewerMatch[1]}`;

                              const imageResponse = await fetch(newImageURL, {
                                   headers: {
                                        'User-Agent': 'Next.js server',
                                   },
                              });

                              if (!imageResponse.ok) {
                                   return new Response(`Failed to fetch: ${imageResponse.statusText}`, { status: imageResponse.status });
                              }

                              const imgHtml = await imageResponse.text();

                              const imgMatch = imgHtml.match(
                                   /<img[^>]*\bclass="[^"]*\bsc-b66608db-0\b[^"]*\bAEgTx\b[^"]*"[^>]*\bsrc="([^"]+)"[^>]*>|<img[^>]*\bsrc="([^"]+)"[^>]*\bclass="[^"]*\bsc-b66608db-0\b[^"]*\bAEgTx\b[^"]*"[^>]*>/
                              );

                              if (imgMatch && imgMatch[1]) {
                                   watchListItem.IMDB_Poster = imgMatch[1];

                                   const base64Data = await getImageBase64(imgMatch[1]);

                                   watchListItem.IMDB_Poster_Image = base64Data.toString();

                                   resultsSummary.push([`Match 1 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_Poster}`]);
                                   logMessage(`Match 1 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_Poster}`)
                              } else {
                                   const cIndex = imgHtml.indexOf("sc-b66608db-0 AEgTx");
                                   let matched = false;

                                   // find Img
                                   for (let i = cIndex; i >= 4; i--) {
                                        if (imgHtml.substring(i - 4, i) === "<img") {
                                             matched = false;

                                             // find src=""
                                             const srcIndexStart = imgHtml.indexOf("src=\"", i - 4);

                                             if (srcIndexStart != -1) {
                                                  const srcIndexEnd = imgHtml.indexOf('"', srcIndexStart+6);

                                                  if (srcIndexStart != -1 && srcIndexEnd != -1) {
                                                       const newURL = imgHtml.substring(srcIndexStart + 5, srcIndexEnd);
                                                       //logMessage(imgHtml.substring(srcIndexStart))

                                                       watchListItem.IMDB_Poster = newURL;

                                                       const base64Data = await getImageBase64(newURL);

                                                       watchListItem.IMDB_Poster_Image = base64Data.toString();

                                                       resultsSummary.push([`Match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_Poster} ${typeof watchListItem.IMDB_Poster_Image == "undefined" ? "true" : "false"}`]);
                                                       logMessage(`Match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_Poster} ${typeof watchListItem.IMDB_Poster_Image == "undefined" ? "true" : "false"}`)

                                                       matched = true;
                                                  } else {
                                                       resultsSummary.push([`No match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`]);
                                                       logMessage(`No match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`);
                                                  }
                                             }

                                             if (matched) {
                                                  break;
                                             } else {
                                                  resultsSummary.push([`No match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`]);
                                                  logMessage(`No match 2 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`);
                                             }
                                        }
                                   }
                              }
                         } else {
                              resultsSummary.push([`No match 1 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`]);
                              logMessage(`No match 1 for ${watchListItem.WatchListItemName} ${watchListItem.IMDB_URL}`);
                         }
                    }

                    // pause for 2 seconds
                    if (index % 10 === 0) {
                         logMessage("Pausing for 2 seconds");

                         await new Promise(r => setTimeout(r, 2000));
                    }
               })
          );

          await processResults;

          console.log(new Date().toTimeString() + " Saving to the DB");
          await writeDB(db);

          return Response.json(["OK"]);
     } catch (e) {
          //logMessage(e.message);
          return Response.json(["ERROR", e.message]);
     }
}