// lib/firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      projectId: "moteregna-a44d2",
      privateKeyId: "2d8bef425c9ab8e9c780f13f25c58e12a8e9f6a0",
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: "firebase-adminsdk-fbsvc@moteregna-a44d2.iam.gserviceaccount.com",
      clientId: "100040438321198845883",
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      clientC509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40moteregna-a44d2.iam.gserviceaccount.com",
      universeDomain: "googleapis.com"
    } as admin.ServiceAccount),
  });
}

export default admin;
