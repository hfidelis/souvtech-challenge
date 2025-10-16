import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  const itemCategories = ['bakery', 'drink', 'meat', 'vegetable', 'fruit'];

  for (const category of itemCategories) {
    await prisma.itemCategory.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
  }

  const defaultEmail = process.env.DEFAULT_USER || 'user@souv.tech';
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'souvtech';
  const hashed: string = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.upsert({
    where: { email: defaultEmail },
    update: {},
    create: {
      email: defaultEmail,
      password: hashed,
    },
  });

  console.log('[INFO] initial data has been seeded.');

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
