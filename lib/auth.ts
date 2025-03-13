import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    return decoded.userId;
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
}