import { isFinite } from 'lodash'
import { PrismaClient } from '@prisma/client'
import { withSession } from '~/lib/session'

const destroy = async (req, res) => {
  const { query, session } = req

  const id = session.get('id')
  const postId = parseInt(query.id)

  if (!id) {
    res.statusMessage = 'Unauthorized'
    res.status(401).end()
    return
  }

  if (!isFinite(postId)) {
    res.statusMessage = 'Unprocessable Entity'
    res.status(422).end()
    return
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    await prisma.post.deleteMany({
      where: {
        id: postId,
        user: {
          id,
        },
      },
    })
  
    await prisma.$disconnect()

    res.end("ok")
  } catch (error) {
    await prisma.$disconnect()

    res.statusMessage = 'Bad Request'
    res.status(400).end()
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
