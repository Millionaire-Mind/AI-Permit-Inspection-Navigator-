import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const submissionSchema = z.object({
  type: z.enum(["electrical", "plumbing", "mechanical", "residential"]),
  applicantName: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  projectDescription: z.string().optional(),
  serviceAmperage: z.number().int().optional(),
  fixtures: z.number().int().optional(),
  equipmentType: z.string().optional(),
  btuRating: z.number().int().optional(),
  squareFootage: z.number().int().optional(),
  estimatedValue: z.number().int().optional(),
  contractorName: z.string().min(1),
  contractorLicense: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;

    const created = await prisma.formSubmission.create({
      data: {
        type: body.type,
        applicantName: body.applicantName,
        address: body.address,
        phone: body.phone,
        email: body.email,
        projectDescription: body.projectDescription,
        serviceAmperage: body.serviceAmperage ?? null,
        fixtures: body.fixtures ?? null,
        equipmentType: body.equipmentType ?? null,
        btuRating: body.btuRating ?? null,
        squareFootage: body.squareFootage ?? null,
        estimatedValue: body.estimatedValue ?? null,
        contractorName: body.contractorName,
        contractorLicense: body.contractorLicense,
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, id: created.id });
  } catch (error: any) {
    console.error("/api/forms error:", error);
    return NextResponse.json({ success: false, error: error?.message ?? "Server error" }, { status: 400 });
  }
}

