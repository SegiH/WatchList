import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
     api: {
          externalResolver: true,
     },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
     res.status(404).json("");
}