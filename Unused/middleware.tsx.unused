//import compression from 'compression';
import { NextRequest, NextResponse } from 'next/server';
//import { Readable } from 'stream';
import { brotliCompress, constants, gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

// Helper to run middleware
/*export function runMiddleware(
     req: NextRequest,
     res: NextResponse,
     fn: Function
): Promise<void> {
     return new Promise((resolve, reject) => {
          fn(req, res, (result: any) => {
               if (result instanceof Error) {
                    return reject(result);
               }
               return resolve(result);
          });
     });
}*/

export async function sendCompressedJsonBrotli(data: any): Promise<Uint8Array> {
     const json = JSON.stringify(data);

     const brotliCompressAsync = promisify(brotliCompress);

     const compressed = await brotliCompressAsync(json, {
          params: {
               [constants.BROTLI_PARAM_QUALITY]: 11, // max quality
          },
     });

     return new Uint8Array(compressed.buffer, compressed.byteOffset, compressed.byteLength);
}

export async function sendCompressedJsonGZip(data: any): Promise<Uint8Array> {
     const json = JSON.stringify(data);
     const compressed = await gzipAsync(json, {
          level: 9, // max compression level (slowest, best compression)
          memLevel: 9, // maximum memory usage for compression
     });

     return new Uint8Array(compressed.buffer, compressed.byteOffset, compressed.byteLength);
}