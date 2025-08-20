import { PrismaClient } from '@prisma/client';
import bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: hashedPassword,
      name: 'Super Admin',
    },
  });

  console.log('✅ Seeded user:', user.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🌱 Database seeded successfully');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
