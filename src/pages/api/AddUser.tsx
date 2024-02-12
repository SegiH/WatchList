import { NextApiRequest, NextApiResponse } from 'next'
import { addUser } from "./default";

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     addUser(req, res);
}