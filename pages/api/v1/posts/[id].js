import { isFinite } from 'lodash'
import { prisma, PrismaClient } from '@prisma/client'

const show = async (req, res) => {
  const id = parseInt(req.query.id)

  if (!isFinite(id)) {
    res.statusMessage = 'Bad Request'
    res.status(400).end()

    return
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    const post = await prisma.post.findUnique({
      include: {
        url: true,
      },
      where: {
        id,
      },
    })

    await prisma.$disconnect()

    if (!post) {
      res.statusMessage = 'Not Found'
      res.status(404).end()

      return
    }

    res.json({ post })
  } catch (error) {
    await prisma.$disconnect()

    res.statusMessage = 'Not Found'
    res.status(404).end()
  }
}

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    await show(req, res)
  } else {
    res.statusMessage = 'Method Not Allowed'
    res.status(405).end()
  }
}

export default handler
