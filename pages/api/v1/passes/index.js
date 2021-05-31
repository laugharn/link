import { handlePass } from '~/lib/mail'
import { PrismaClient } from '@prisma/client'
import { randomNumbers } from '~/lib/string'
import { ttl } from '~/lib/time'

const store = async (req, res) => {
  const { body, headers } = req

  const { email, redirect = '/' } = body

  const prisma = new PrismaClient()
  await prisma.$connect()

  const date = new Date()

  const pass = await prisma.pass.create({
    data: {
      code: randomNumbers(6),
      createdAt: date,
      email,
      expiresAt: ttl(900, date),
      redirect,
      user: {
        connectOrCreate: {
          create: {
            createdAt: date,
            email,
            types: ['user'],
          },
          where: {
            email,
          },
        },
      },
    },
    include: {
      user: true,
    },
  })

  if (!pass.user.name) {
    await prisma.user.update({
      data: {
        name: `user${pass.user.id}`,
      },
      where: {
        id: pass.user.id,
      },
    })
  }

  await prisma.$disconnect()

  if (process.env.NODE_ENV === 'production') {
    await handlePass(pass.code, email, headers)
  } else {
    console.log(pass.code)
  }

  res.end()
}

const handler = async (req, res) => {
  const { method } = req

  if (method === 'POST') {
    await store(req, res)
  } else {
    res.statusMessage = 'Method Not Allowed'
    res.status(405).end()
  }
}

export default handler
