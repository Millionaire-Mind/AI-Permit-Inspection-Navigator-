import { prisma } from "@/lib/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
	const sub = await prisma.subscription.findFirst({
		where: { userId, status: { in: ["active", "trialing", "past_due"] } },
		orderBy: { updatedAt: "desc" },
	});
	return !!sub;
}