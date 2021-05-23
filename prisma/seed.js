const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const seed = async () => {
  await prisma.$connect()

  await prisma.user.createMany({
    data: [
      {
        email: 'laugharn@gmail.com',
      },
    ],
  })
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
