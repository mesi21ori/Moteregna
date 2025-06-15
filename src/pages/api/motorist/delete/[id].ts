import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    // First find the motorist to get the userId
    const motorist = await prisma.motorist.findUnique({
      where: { id: id as string },
      select: { userId: true }
    })

    if (!motorist) {
      return res.status(404).json({ error: 'Motorist not found' })
    }

    // Delete the motorist and related user in a transaction
    await prisma.$transaction([
      // Delete the motorist first (child record)
      prisma.motorist.delete({
        where: { id: id as string }
      }),
      
      // Then delete the user (parent record)
      prisma.user.delete({
        where: { id: motorist.userId ?? "" }
      })
    ])

    return res.status(200).json({ message: 'Motorist and associated user deleted successfully' })
  } catch (error) {
    console.error('[MOTORIST_DELETE]', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}