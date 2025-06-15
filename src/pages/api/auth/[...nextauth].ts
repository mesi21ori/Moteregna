// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { Phone } from 'lucide-react';

// const prisma = new PrismaClient();

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         Phone: { label: 'Phone', type: 'Phonenumber' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials, req) {
//         if (!credentials) {
//           return null;
//         }
//         const phone = credentials.Phone;
//         const password = credentials.password;

//         const user = await prisma.user.findFirst({
//           where: { phone },
//         });

//         if (!user) {
//           return null;  
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
//         if (!isPasswordValid) {
//           return null;  
//         }

//         return {
//           id: user.id,
//           email: user.phone || '', // Ensure email is always a string
//           firstName: user.firstName || '',
//           lastName: user.lastName || '',
//           role: user.role,
//           profile: user.profile || '', 
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       return session;
//     },
//   },

//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//   },

//   secret: process.env.JWT_SECRET_KEY,
// });