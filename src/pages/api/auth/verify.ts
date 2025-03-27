import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const token = req.cookies.session_token
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!)
    return res.status(200).json({ user: decoded })
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}