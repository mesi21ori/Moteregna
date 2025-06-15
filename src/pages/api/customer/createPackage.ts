import { z } from 'zod'; 
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
// import admin from '@/firebase/firebaseAdmin';
import * as admin from "firebase-admin";


const createPackageSchema = z.object({
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category ID is required"), 
  weight: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  specialInstructions: z.string().optional(),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  dropoffLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
});
async function sendPushNotification(
  tokens: string[], 
  title: string, 
  body: string, 
  customerPhone: String,
  pickupLocationLatitude: number,
  pickupLocationLongitude: number,
  dropoffLocationLatitude: number,  
  dropoffLocationLongitude: number,
  description: string,
    weight: number,
  quantity: number,
  specialInstructions: string,
  categoryName: string,
  packageName: string,
) {
  if (!tokens.length) return;
   let price = await prisma.price.findFirst({
        where: { isActive: true },
        orderBy: { isActiveDate: "desc" }, // Get the most recently activated price if multiple are active
      })

       function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  const distanceInKm = calculateDistance(
    pickupLocationLatitude,
    pickupLocationLongitude,
    dropoffLocationLatitude,
    dropoffLocationLongitude
  );

  // Calculate total cost
  const initialPrice = price ? parseFloat(String(price.Price)) : 0;
  const perKilometerPrice = price ? parseFloat(String(price.perkilometer)) : 0;
  const perMinutePrice = price ? parseFloat(String(price.perminute)) : 0;
  
  // Estimate time based on distance (assuming average speed of 30km/h)
  const estimatedTimeInMinutes = (distanceInKm / 30) * 60;
  
  // Calculate total cost: initial + (distance * per km) + (time * per minute)
  const totalCost = initialPrice + 
                   (distanceInKm * perKilometerPrice) + 
                   (estimatedTimeInMinutes * perMinutePrice);



      console.log({
        message: "Delivery created successfully",
        deliveryId: body,
        initialPrice: price ? String(price.Price) : "0",
        KiloMeter: price ? String(price.perkilometer) : "0",
        PerMinute: price ? String(price.perminute) : "0",
        customerPhone: String(customerPhone),
      sourceLongitude: String(pickupLocationLongitude),
      sourceLatitude:  String(pickupLocationLatitude), 
      destinationLongitude: String(dropoffLocationLongitude), 
      destinationLatitude: String(dropoffLocationLatitude),
      totalCost: String(totalCost),
      description: description,
    categoryName: categoryName,
    weight:  String(weight),
    quantity:  String(quantity),
    specialInstructions: String(specialInstructions), 
    packageName: packageName
      })
const message: admin.messaging.MulticastMessage = {
  tokens,
  notification: {
    title,
    body,
  },
  data: {
        message: "Delivery created successfully",
        deliveryId: body,
        initialPrice: price ? String(price.Price) : "0",
        KiloMeter: price ? String(price.perkilometer) : "0",
        PerMinute: price ? String(price.perminute) : "0",
        customerPhone: String(customerPhone),
      sourceLongitude: String(pickupLocationLongitude),
      sourceLatitude:  String(pickupLocationLatitude), 
      destinationLongitude: String(dropoffLocationLongitude), 
      destinationLatitude: String(dropoffLocationLatitude),
      totalCost: String(totalCost),
      description: description,
    categoryName: categoryName,
   weight:  String(weight),
    quantity:  String(quantity),
    specialInstructions: specialInstructions, 
    packageName: packageName
      },
  android: {
    priority: "high",
    notification: {
      channelId: "high_importance_channel",
      sound: "default",
      clickAction: "FLUTTER_NOTIFICATION_CLICK",
      visibility: "public",
      defaultSound: true,
    },
  },
  apns: {
    payload: {
      aps: {
        alert: {
          title,
          body,
        },
        sound: "default",
      },
    },
  },
};


  try {
 
    const response = await admin.messaging().sendEachForMulticast(message);
    
      console.log("Successfully sent notifications to: ", response.successCount);

    if (response.failureCount > 0) {
      console.log("Failed to send notifications:", response.failureCount);
    }
  } catch (error) {
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
      userId: string;
      role: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
    };

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Only customers can create packages' });
    }

    const validatedData = createPackageSchema.parse(req.body);

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.userId },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const category = await prisma.packageCategory.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const pickupLocation = await prisma.location.create({
      data: {
        name: `Pickup for ${customer.firstName}`,
        address: validatedData.pickupLocation.address,
        latitude: validatedData.pickupLocation.latitude,
        longitude: validatedData.pickupLocation.longitude,
      },
    });

    const dropoffLocation = await prisma.location.create({
      data: {
        name: `Dropoff for ${customer.firstName}`,
        address: validatedData.dropoffLocation.address,
        latitude: validatedData.dropoffLocation.latitude,
        longitude: validatedData.dropoffLocation.longitude,
      },
    });
    
    const newPackage = await prisma.package.create({
      data: {
        description: validatedData.description,
        weight: validatedData.weight,
        quantity: validatedData.quantity,
        specialInstructions: validatedData.specialInstructions,
        customer: {
          connect: { id: customer.id }
        },
        category: {
          connect: { id: validatedData.categoryId }
        },
        pickupLocation: {
          connect: { id: pickupLocation.id }
        },
        dropoffLocation: {
          connect: { id: dropoffLocation.id }
        },
        status: 'PENDING', 
      },
      include: {
        pickupLocation: true,
        dropoffLocation: true,
        category: true,
        customer: true,
      },
    });

    const nearbyMotorists = await findNearbyMotorists(
      validatedData.pickupLocation.latitude,
      validatedData.pickupLocation.longitude,
      5 
    );

    // Extract FCM tokens from nearby motorists
    const tokens = nearbyMotorists
      .map(m => m.fcmToken)
      .filter((token): token is string => Boolean(token));
  // tokens.push("dklF4cOjT0OLnaXqvkt5Cu:APA91bFEhf2Zvywa3OgV9vhb7b0BOk2IH-E6Df9MJ4bhGhxUJzWWW3B_huQBJshUyy1SDUnnLW0cPPhTKMN_qRNuM5j3rnutiR51Qco3k-a7vsRiC_pExdU")


    // Send push notification to nearby motorists
    await sendPushNotification(
      tokens,
      'New Package Available',
      newPackage.id,
      customer.phone? customer.phone : "",
          validatedData.pickupLocation.latitude,
          validatedData.pickupLocation.longitude,
          validatedData.dropoffLocation.latitude,
          validatedData.dropoffLocation.longitude,
          validatedData.description,
validatedData.weight ?? 0,
validatedData.quantity ?? 0,
validatedData.specialInstructions ?? "",
category.name ?? "",
newPackage.id ?? ""
        );

    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage,
      nearbyMotoristsCount: nearbyMotorists.length,
      nearbyMotorists: nearbyMotorists.map(m => ({
        id: m.id,
        distance: calculateDistance(
          validatedData.pickupLocation.latitude,
          validatedData.pickupLocation.longitude,
          m.currentLocation!.latitude,
          m.currentLocation!.longitude
        ).toFixed(2) + ' km',
        vehiclePlateNumber: m.vehiclePlateNumber
      }))
    });

  } catch (error) {
    console.error('Error creating package:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function findNearbyMotorists(latitude: number, longitude: number, radiusKm: number) {
  const motorists = await prisma.motorist.findMany({
    where: {
      isOnline: true,
      isAvailable: true,
      currentLocationId: { not: null },
    },
    include: {
      currentLocation: true,
      user: true,
    },
  });
return motorists;
  // return motorists.filter(motorist => {
  //   if (!motorist.currentLocation) return false;

  //   const distance = calculateDistance(
  //     latitude,
  //     longitude,
  //     motorist.currentLocation.latitude,
  //     motorist.currentLocation.longitude
  //   );

  //   return distance <= radiusKm;
  // });
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
