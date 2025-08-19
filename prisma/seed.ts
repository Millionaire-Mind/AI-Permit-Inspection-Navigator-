import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create jurisdictions
  const jurisdiction1 = await prisma.jurisdiction.upsert({
    where: { code: 'NYC' },
    update: {},
    create: {
      code: 'NYC',
      name: 'New York City',
      state: 'NY',
      country: 'USA',
      timezone: 'America/New_York',
    },
  });

  const jurisdiction2 = await prisma.jurisdiction.upsert({
    where: { code: 'LA' },
    update: {},
    create: {
      code: 'LA',
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      timezone: 'America/Los_Angeles',
    },
  });

  console.log('✅ Jurisdictions created');

  // Create permit types
  const permitTypes = await Promise.all([
    prisma.permitType.upsert({
      where: { code: 'BUILDING' },
      update: {},
      create: {
        code: 'BUILDING',
        name: 'Building Permit',
        category: 'Construction',
        description: 'Required for new building construction',
      },
    }),
    prisma.permitType.upsert({
      where: { code: 'ELECTRICAL' },
      update: {},
      create: {
        code: 'ELECTRICAL',
        name: 'Electrical Permit',
        category: 'Electrical',
        description: 'Required for electrical work',
      },
    }),
    prisma.permitType.upsert({
      where: { code: 'PLUMBING' },
      update: {},
      create: {
        code: 'PLUMBING',
        name: 'Plumbing Permit',
        category: 'Plumbing',
        description: 'Required for plumbing work',
      },
    }),
  ]);

  console.log('✅ Permit types created');

  // Create permit requirements
  await Promise.all([
    prisma.permitRequirement.upsert({
      where: { 
        jurisdictionId_permitTypeId: { 
          jurisdictionId: jurisdiction1.id, 
          permitTypeId: permitTypes[0].id 
        } 
      },
      update: {},
      create: {
        jurisdictionId: jurisdiction1.id,
        permitTypeId: permitTypes[0].id,
        rule: 'Building permits required for structures over 100 sq ft',
        criteria: { sqftMin: 100, valuationMin: 5000 },
      },
    }),
    prisma.permitRequirement.upsert({
      where: { 
        jurisdictionId_permitTypeId: { 
          jurisdictionId: jurisdiction1.id, 
          permitTypeId: permitTypes[1].id 
        } 
      },
      update: {},
      create: {
        jurisdictionId: jurisdiction1.id,
        permitTypeId: permitTypes[1].id,
        rule: 'Electrical permits required for new installations',
        criteria: { scopeIncludes: ['electrical', 'wiring'] },
      },
    }),
  ]);

  console.log('✅ Permit requirements created');

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'moderator@example.com' },
      update: {},
      create: {
        email: 'moderator@example.com',
        password: hashedPassword,
        name: 'Moderator User',
        role: 'MODERATOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Regular User',
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'superadmin@example.com' },
      update: {},
      create: {
        email: 'superadmin@example.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
      },
    }),
  ]);

  console.log('✅ Users created');

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 'project-1' },
      update: {},
      create: {
        id: 'project-1',
        name: 'Downtown Office Complex',
        description: 'Modern office building in downtown area',
        address: '123 Main St, New York, NY 10001',
        jurisdictionId: jurisdiction1.id,
        userId: users[2].id, // Regular user
        status: 'IN_REVIEW',
        valuation: 2500000,
        sqft: 50000,
        scope: 'commercial office construction',
        params: { floors: 8, parking: true, greenBuilding: true },
      },
    }),
    prisma.project.upsert({
      where: { id: 'project-2' },
      update: {},
      create: {
        id: 'project-2',
        name: 'Residential Renovation',
        description: 'Kitchen and bathroom renovation',
        address: '456 Oak Ave, New York, NY 10002',
        jurisdictionId: jurisdiction1.id,
        userId: users[2].id, // Regular user
        status: 'APPROVED',
        valuation: 75000,
        sqft: 1200,
        scope: 'residential renovation',
        params: { rooms: ['kitchen', 'bathroom'], electrical: true, plumbing: true },
      },
    }),
  ]);

  console.log('✅ Projects created');

  // Create sample reports
  const reports = await Promise.all([
    prisma.report.upsert({
      where: { id: 'report-1' },
      update: {},
      create: {
        id: 'report-1',
        title: 'Foundation Inspection Report',
        content: 'Foundation inspection completed. All structural elements meet code requirements.',
        status: 'APPROVED',
        category: 'Structural',
        priority: 'HIGH',
        userId: users[2].id,
        projectId: projects[0].id,
      },
    }),
    prisma.report.upsert({
      where: { id: 'report-2' },
      update: {},
      create: {
        id: 'report-2',
        title: 'Electrical Safety Review',
        content: 'Electrical systems reviewed. Minor issues found and addressed.',
        status: 'IN_REVIEW',
        category: 'Electrical',
        priority: 'MEDIUM',
        userId: users[2].id,
        projectId: projects[1].id,
      },
    }),
  ]);

  console.log('✅ Reports created');

  // Create sample appeals
  const appeals = await Promise.all([
    prisma.appeal.upsert({
      where: { id: 'appeal-1' },
      update: {},
      create: {
        id: 'appeal-1',
        userId: users[2].id,
        reportId: reports[1].id,
        title: 'Appeal for Electrical Permit',
        description: 'Requesting reconsideration of electrical permit requirements',
        reason: 'Existing electrical system meets current safety standards',
        status: 'PENDING',
        priority: 'MEDIUM',
      },
    }),
  ]);

  console.log('✅ Appeals created');

  // Create SLA settings
  await prisma.sLASettings.upsert({
    where: { id: 'sla-1' },
    update: {},
    create: {
      id: 'sla-1',
      category: 'Permit Review',
      threshold: 72, // 72 hours
      teamId: 'permits-team',
    },
  });

  console.log('✅ SLA settings created');

  // Create sample rules
  await prisma.rule.upsert({
    where: { id: 'rule-1' },
    update: {},
    create: {
      id: 'rule-1',
      jurisdictionId: jurisdiction1.id,
      code: 'NYC-BLD-001',
      title: 'Building Height Restrictions',
      description: 'Maximum building height in residential zones',
      category: 'Zoning',
    },
  });

  console.log('✅ Rules created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Sample Users:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  Moderator: moderator@example.com / password123');
  console.log('  User: user@example.com / password123');
  console.log('  Super Admin: superadmin@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });