import { NextApiRequest } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  userId: string; 
}

export type DeliveryStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Role = "SUPERADMIN" | "ADMIN" | "MOTORIST" 

export interface Delivery {
  id: string;
  startLocation: string;
  startLat: number;
  startLong: number;
  endLocation: string;
  endLat: number | null;
  endLong: number | null;
  motorist: string;
  motoristPhone: string;
  customerPhone: string;
  distance: number;
  fee: number;
  status: DeliveryStatus;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
}