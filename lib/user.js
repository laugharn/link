import createError from 'http-errors'
import { PrismaClient } from '@prisma/client'

export const reservedNames = [
  'admin',
  'api',
  'create',
  'index',
  'link',
  'links',
  'profile',
  'start',
  'users',
]

export const show = async (req, res) => {
  const { session } = req

  const id = session.get('id')

  if (!id) {
    throw createError(401)
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    await prisma.$disconnect()

    res.json({ user })
  } catch (error) {
    await prisma.$disconnect()

    throw createError(400)
  }
}

export const update = async (req, res) => {
  const { body, session } = req

  const id = session.get('id')
  const { name, ...data } = body

  if (!id) {
    throw createError(401)
  }

  if (!name) {
    throw createError(422)
  }

  if (name.startsWith('user') || reservedNames.includes(name)) {
    throw createError(409)
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  // TODO: Refactor via https://github.com/prisma/prisma/issues/3387
  const check = await prisma.user.findFirst({
    where: {
      id: {
        not: id,
      },
      name,
    },
  })

  if (check) {
    await prisma.$disconnect()

    throw createError(409)
  }

  try {
    const user = await prisma.user.update({
      data: {
        name,
        ...data,
      },
      where: {
        id,
      },
    })

    await prisma.$disconnect()

    session.set('id', user.id)
    await session.save()

    res.json({ user })
  } catch (error) {
    await prisma.$disconnect()

    throw createError(400)
  }
}
