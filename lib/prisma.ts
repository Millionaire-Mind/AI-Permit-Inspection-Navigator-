import { PrismaClient } from '@prisma/client';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ??
	new PrismaClient({
		log: process.env.PRISMA_LOG_LEVEL ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
	});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;