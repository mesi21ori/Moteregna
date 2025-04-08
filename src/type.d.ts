import { NextApiRequest, NextApiResponse } from 'next';

declare module 'next' {
  interface NextApiRequest {
    files?: any;
    body?: any;
  }
}

declare global {
  namespace Express {
    interface Request {
      files?: any;
    }
  }
}