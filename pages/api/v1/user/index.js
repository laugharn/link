import { PrismaClient } from '@prisma/client'
import { reservedNames } from '~/lib/user'
import { withSession } from '~/lib/session'

const update = async (req, res) => {
  const { body, session } = req

  const id = session.get('id')
  const { name } = body

  if (!id) {
    res.statusMessage = 'Unauthorized'
    res.status(401).end()
    return
  }

  if (!name) {
    res.statusMessage = 'Unprocessable Entity'
    res.status(422).end()
    return
  }

  if (name.startsWith('user') || reservedNames.includes(name)) {
    res.statusMessage = 'Conflict'
    res.status(409).end()
    return
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

    res.statusMessage = 'Conflict'
    res.status(409).end()
    return
  }

  const user = await prisma.user.update({
    data: {
      name,
    },
    where: {
      id,
    },
  })

  await prisma.$disconnect()

  session.set('id', user.id)
  await session.save()

  res.json({ user })
}

const handler = async (req, res) => {
  const { method } = req

  if (method === 'PATCH') {
    await update(req, res)
  } else {
    res.statusMessage = 'Method Not Allowed'
    res.status(405).end()
  }
}

export default withSession(handler)
