import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash the admin password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Upsert the admin user
  const admin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      customer: {
        create: {
          stripeCustomerId: 'seed_stripe_id',
          subscriptions: {
            create: {
              plan: 'Pro',
              status: 'ACTIVE', // matches SubscriptionStatus enum
              stripeSubscriptionId: 'seed_sub_id'
            }
          }
        }
      },
      projects: {
        create: {
          title: 'Sample Project',
          description: 'This is a seeded sample project',
          location: 'Sample City',
        }
      }
    }
  })

  console.log('✅ Database seeded successfully')
  console.log(`Admin user ID: ${admin.id} Email: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
