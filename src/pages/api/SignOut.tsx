import { NextApiRequest, NextApiResponse } from 'next';
import cookie from "cookie";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     // Clear session cookie
     res.setHeader('Set-Cookie', cookie.serialize('userData', "", {
          maxAge: 0
     }));

     res.send(["OK"]);
}