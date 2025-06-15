import { z } from 'zod'; 
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
// import admin from '@/firebase/firebaseAdmin';
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "moteregna-a44d2",
      // privateKeyId: "2d8bef425c9ab8e9c780f13f25c58e12a8e9f6a0",
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCq6VPLzpWk2Dyl
247m90z6jqOiwC+Ham4RTGKcodZUYnIDSPH6TYcjHWG2rlFyz/XsdQRS5xvxpvoI
6Y3Q+PUYj5fVmW2xn8iMfTtlKFEYCV9GH33mnmjMTv/dXc1ovMeQTeieVR6qK9ni
NFJ+JSHHJfkfVNdyAZUMxyOuKJebjwWkqZi40lkSMH7zXJgm0HCN1UR1CX8TAAlD
TpBEFSIdzDCwW47tYs3Xglyv2PXRVY5diYcyT+FvRrcU8ebHEQS0GjY0qZRl00Mj
2iipulgdWqY33OMENMm229ZzOivypNX5cOqJsLzLkpLZuP4gbj+8tWwh1pbqZcaa
cJ7UAcmTAgMBAAECggEAP7xzu3V26NqbA181k3x2AJpg+7igAOf31AugWrkfrKhp
zD/PvYBb/QRgBDhNt3tGQsAAtMnq6dtTMy+l62BsRpSGEun8tljX+Uxacgbu9v/H
v+bOlMpOWqK7WFo61+xOn8nuDd3AacWgo3LPsKs4RYQruztwfNuKMhGxhKkuoJvB
E0VZVojhv/cxyOY40lswVjA/nPuGJSmZt5pc4tPc7bU4mCICOp/vCW+wGnYLDNly
gtfoOaOZekMeeH9bhznf65C7w0sCMTf6SRflaVKG9ZZFf6+rlmcphdpQ4ytMUMTv
Oa0R6nwSBPVFxBfzC1LNxPsv31S4E+C1mBAuL/BWQQKBgQDhfjGA3pLqpWlOj0Mg
XiVAxHFm8xE1ItHGMV+yN3SDuJrSE1GdVfyYG8NaqazXjiFI7V4I+JF0aMvC4dtf
KfhvXeNawCg0RYO1Omq3/uetbz+84sxQMX8QK+b+4nhg75O9pIRdK534shiMFc6Z
mH0KUWXufOZimCpbd3CvuEcppwKBgQDCCLzXn5EL9FoRIjwkUOF1fcyNAfqaNWZV
fif4TqbSgCcqBD/iYCeDJcND8yt5UdJRth13gW8fCFwGbe+whX4SDbkVvFUSvLy0
h/TcVW8yWKlAFWicJQ22Y8hxXAE7l7WsKg8J+nWu41nnU7w6xAwYmGIgb4LwcHl/
J/eSmFnGNQKBgHIyXJOtJK5c0vYMK6yqwScJ1XyTwLUuSxqaSqKQ3xsOVKnrSrvp
niDSfp7dq0EHI+gw/hyA9fkEUZ0CkPyi3sRXwhplknbWdZtEWGOSXnZBDwBzw5Eh
X/4qnbObsec1rZavSLF+s2QNnczkBltXFIwzKPIcovhvo5Pq61CyfKelAoGAPm9R
VJCju5UE5j5927Gq2oOALl9UpApKw3e0pNGqHFHgSETVyaHnFOwxyMuWUZNieaiA
EtQzTWkDM45scgCCcIy54aSYO08/6VdWEw/ql+ivjU9WOegyYV36QX+5ZdOLQbrG
3A8bjwrZAvaOutoaik9+Q7GeEIAgmCnkH+el+4ECgYEAv21cug3vvlZARmyaf/W/
ls2dghjucwy8OKS8DC6LH7OOuDzQSyJeBOVhKPOMyq9+WtBZF00vyuWnY74vdBZ7
jjZofoXDrC4vB83+X1DlEFuaNk2ywvKrpvWRHYOV5z9axXnBv+i6h2Sv7JFldPRJ
+I7Jx97BUHEFU/o+GzfP/OA=
-----END PRIVATE KEY-----`,
      clientEmail: "firebase-adminsdk-fbsvc@moteregna-a44d2.iam.gserviceaccount.com",
      // clientId: "100040438321198845883",
      // authUri: "https://accounts.google.com/o/oauth2/auth",
      // tokenUri: "https://oauth2.googleapis.com/token",
      // authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      // clientC509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40moteregna-a44d2.iam.gserviceaccount.com",
      // universeDomain: "googleapis.com"
    }),
  });
}
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
