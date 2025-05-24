import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const superAdminPhone = process.env.SUPER_ADMIN_PHONE;
  const superAdminPasswordPlain = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminPhone || !superAdminPasswordPlain) {
    throw new Error('Super admin phone and password must be set in the .env file.');
  }

  const superAdminPassword = await hash(superAdminPasswordPlain, 10);

  let superAdmin = await prisma.user.findUnique({
    where: { phone: superAdminPhone },
  });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        phone: superAdminPhone,
        password: superAdminPassword,
        role: 'SUPERADMIN',
      },
    });

    console.log('Super admin account created successfully.');
  } else {
    console.log('User with this phone number already exists. Skipping creation.');
  }

  const existingPrice = await prisma.price.findFirst();

  if (!existingPrice) {
    if (!superAdmin?.id) {
      throw new Error('Super admin user ID is missing. Cannot create price record.');
    }

    await prisma.price.create({
      data: {
        userId: superAdmin.id,
        Price: 100,
      },
    });

    console.log(`Initial price record created successfully with value 100 for Super Admin (ID: ${superAdmin.id}).`);
  } else {
    console.log('Price record already exists. Skipping creation.');
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
