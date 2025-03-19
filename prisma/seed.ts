import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();

const prisma = new PrismaClient();

async function main() {

  const superAdminPhone = process.env.SUPER_ADMIN_PHONE;
  const superAdminPasswordPlain = process.env.SUPER_ADMIN_PASSWORD;


  if (!superAdminPhone || !superAdminPasswordPlain) {
    throw new Error(
      'Super admin phone and password must be set in the .env file.',
    );
  }

  const superAdminPassword = await hash(superAdminPasswordPlain, 10);

  const existingUser = await prisma.user.findUnique({
    where: { phone: superAdminPhone },
  });

  if (existingUser) {
    console.log('User with this phone number already exists. Skipping creation.');
  } else {
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        phone: superAdminPhone,
        password: superAdminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Super admin account created successfully.');
  }

  const existingPrice = await prisma.price.findFirst();

  if (existingPrice) {
    console.log('Price record already exists. Skipping creation.');
  } else {
    await prisma.price.create({
      data: {
        initialPrice: 100,
      },
    });

    console.log('Initial price record created successfully with value 100.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });