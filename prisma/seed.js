/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash('password123', 10);
	const user = await prisma.user.upsert({
		where: { email: 'superadmin@example.com' },
		update: {},
		create: {
			email: 'superadmin@example.com',
			password: hashedPassword,
			name: 'Super Admin',
			role: 'ADMIN',
			subscriptionStatus: 'active'
		}
	});
	console.log('✅ Seeded user:', user.email);

	const j = await prisma.jurisdiction.create({ data: { name: 'Sample City' } });
	await prisma.project.create({ data: { jurisdictionId: j.id } });
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
