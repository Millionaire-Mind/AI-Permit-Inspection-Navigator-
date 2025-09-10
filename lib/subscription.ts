import { prisma } from "@/lib/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
	const anyDb: any = prisma as any;
	const user = await anyDb.user.findUnique({ where: { id: userId } });
	if (!user?.customerId) return false;
	const subscription = await anyDb.subscription.findFirst({
		where: { customerId: user.customerId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
		orderBy: { createdAt: "desc" },
	});
	return !!subscription;
}