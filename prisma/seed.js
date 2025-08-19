const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: hashed,
      name: 'Super Admin',
    },
  });

  console.log('✅ Seeded user: superadmin@example.com');
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