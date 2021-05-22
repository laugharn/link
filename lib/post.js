import { PrismaClient } from '@prisma/client'
import { set } from 'lodash'

const take = 20

const getFilters = (query) => {
  const allowed = [
    'createdAt',
    'direction',
    'domain',
    'host',
    'orderBy',
    'tag',
    'url',
  ]

  let filters = {}

  Object.entries(query).forEach(([key, value]) => {
    if (allowed.includes(key)) {
      filters[key] = value
    }
  })

  return filters
}

export const getLinks = async (query) => {
  const filters = getFilters(query)

  const orderBy = filters.orderBy ?? 'createdAt'

  let request = {
    include: {
      url: true,
    },
    orderBy: {
      [orderBy]: filters.direction === 'asc' ? 'asc' : 'desc',
    },
    take: take + 1,
    where: {
      type: 'link',
    },
  }

  if (filters.createdAt) {
    set(
      request,
      `where.${orderBy}.${filters.direction === 'asc' ? 'gte' : 'lte'}`,
      new Date(filters.createdAt).toISOString()
    )
  }

  if (filters.domain) {
    set(request, 'where.url', {
      parsed: {
        equals: filters.domain,
        path: ['domain'],
      },
    })
  }

  if (filters.host) {
    set(request, 'where.url', {
      parsed: {
        equals: filters.host,
        path: ['host'],
      },
    })
  }

  if (filters.tag) {
    const tags = filters.tag.split(',')

    set(request, 'where.tags.hasEvery', tags)
  }

  if (filters.url) {
    set(request, 'where.url.url', decodeURI(filters.url))
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  const get = await prisma.post
    .findMany(request)
    .then((response) => JSON.parse(JSON.stringify(response)))

  await prisma.$disconnect()

  const posts = get.length > take ? get.slice(0, -1) : get

  const nextTime =
    get.length > posts.length
      ? new Date(get[get.length - 1][orderBy]).toISOString()
      : false

  return {
    filters,
    nextTime,
    posts,
  }
}