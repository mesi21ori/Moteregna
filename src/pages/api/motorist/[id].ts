import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  try {
    const motorist = await prisma.motorist.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            phone: true,
            gender: true,
            birthdate: true,
            address: true,
            profile: true,
            isLoggedIn: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!motorist) {
      return res.status(404).json({ error: 'Motorist not found' })
    }

    const responseData = {
      id: motorist.id,
      name: `${motorist.user.firstName} ${motorist.user.middleName ? motorist.user.middleName + ' ' : ''}${motorist.user.lastName}`,
      email: '',
      phone: motorist.user.phone,
      address: motorist.user.address || '',
      licenseNumber: motorist.licenseNumber,
      vehicleModel: motorist.vehicleModel,
      vehiclePlate: motorist.vehiclePlateNumber,
      vehicleYear: '',
      vehicleColor: '',
      status: motorist.user.status ? 'active' : 'inactive',
      registrationDate: motorist.createdAt.toISOString(),
      profilePhoto: motorist.user.profile || '/placeholder.svg',
      licensePhoto: motorist.driversLicencephotoFront || '/placeholder.svg',
      vehiclePhoto: motorist.Librephoto || '/placeholder.svg',
      businessPermitPhoto: motorist.businessPermit || '/placeholder.svg',
      user: motorist.user,
      isAvailable: motorist.isAvailable,
      isOnline: motorist.isOnline,
      // currentLocation: motorist.currentLocation,
    }

    return res.status(200).json(responseData)
  } catch (error) {
    console.error('[MOTORIST_GET]', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}