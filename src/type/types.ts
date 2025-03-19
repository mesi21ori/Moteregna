import { NextApiRequest } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  userId: string; 
}