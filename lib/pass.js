import createError from 'http-errors'
import { handlePass } from '~/lib/mail'
import { PrismaClient } from '@prisma/client'
import { randomNumbers } from '~/lib/string'
import { ttl, validateTtl } from '~/lib/time'

export const destroy = async (req, res) => {
  const { query, session } = req

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    const pass = await prisma.pass.delete({
      include: {
        user: true,
      },
      where: {
        code: query.code,
      },
    })

    if (!validateTtl(pass?.expiresAt)) {
      throw createError(404)
    }

    await prisma.$disconnect()

    session.set('id', pass.user.id)
    await session.save()

    res.json({
      isNew: pass.createdAt.toString() === pass.user.createdAt.toString(),
      redirect: pass.redirect,
      user: pass.user,
    })
  } catch (error) {
    await prisma.$disconnect()

    throw createError(404)
  }
}

export const store = async (req, res) => {
  const { body, headers } = req

  const { email, redirect = '/' } = body

  const prisma = new PrismaClient()
  await prisma.$connect()

  const date = new Date()

  try {
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
  } catch (error) {
    await prisma.$disconnect()

    throw createError(400)
  }
}
