import { PrismaClient } from '@prisma/client'
import { validateTtl } from '~/lib/time'
import { withSession } from '~/lib/session'

const destroy = async (req, res) => {
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
      res.statusMessage = 'Not Found'
      res.status(404).end()

      return
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

    res.statusMessage = 'Not Found'
    res.status(404).end()
  }
}

const handler = async (req, res) => {
  const { method } = req

  if (method === 'DELETE') {
    await destroy(req, res)
  } else {
    res.statusMessage = 'Method Not Allowed'
    res.status(405).end()
  }
}

export default withSession(handler)
