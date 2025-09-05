import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { logPermitApplicationCreated } from '@/lib/audit';

const SubmitSchema = z.object({
  userId: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  project: z.object({
    type: z.string().min(1),
    location: z.string().min(1),
    valuation: z.number().nonnegative().optional(),
    sqft: z.number().nonnegative().optional(),
  }).optional(),
  applicant: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }).optional(),
  attachments: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url(),
  })).optional(),
  extra: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'validation_error', error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions as any);
    const sessionUserId = (session as any)?.user?.id as string | undefined;
    const userId = parsed.data.userId || sessionUserId;
    if (!userId) {
      return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    }

    const project = await (prisma as any).project.findUnique({ where: { id: parsed.data.projectId } });
    if (!project) {
      return NextResponse.json({ status: 'validation_error', error: { formErrors: [], fieldErrors: { projectId: ['Invalid projectId'] } } }, { status: 400 });
    }

    const application = await (prisma as any).permitApplication.create({
      data: {
        userId,
        projectId: parsed.data.projectId,
        data: {
          project: parsed.data.project || null,
          applicant: parsed.data.applicant || null,
          attachments: parsed.data.attachments || [],
          extra: parsed.data.extra || {},
        },
        status: 'SUBMITTED',
      },
    });

    await logPermitApplicationCreated(userId, application.id);

    return NextResponse.json({ status: 'success', applicationId: application.id });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}