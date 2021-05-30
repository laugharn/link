import { isFinite, set } from 'lodash'
import { PrismaClient } from '@prisma/client'

const take = 20

const getFilters = (query) => {
  const allowed = [
    'cursor',
    'direction',
    'domain',
    'host',
    'tag',
    'url',
    'user',
  ]

  let filters = {}

  Object.entries(query).forEach(([key, value]) => {
    if (allowed.includes(key)) {
      filters[key] = value
    }
  })

  return filters
}

const getPostsRequest = (query) => {
  const filters = getFilters(query)

  let request = {
    include: {
      url: true,
      user: true,
    },
    orderBy: {
      id: filters.direction === 'asc' ? 'asc' : 'desc',
    },
    take: take + 1,
    where: {
      type: 'link',
    },
  }

  if (filters.cursor) {
    const id = parseInt(filters.cursor)

    if (!isFinite(id)) {
      return {
        notFound: true,
      }
    }

    set(request, 'where.id', {
      [filters.direction === 'asc' ? 'gte' : 'lte']: id,
    })
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

  return { filters, request }
}

export const getLink = async (params) => {
  const id = parseInt(params.id)

  if (!isFinite(id)) {
    return {
      notFound: true,
    }
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  const post = await prisma.post
    .findFirst({
      include: {
        url: true,
        user: true,
      },
      where: {
        type: 'link',
        id,
      },
    })
    .then((response) => JSON.parse(JSON.stringify(response)))

  await prisma.$disconnect()

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}

export const getPosts = async (query) => {
  const { filters, request } = getPostsRequest(query)

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    const get = await prisma.post
      .findMany(request)
      .then((response) => JSON.parse(JSON.stringify(response)))

    await prisma.$disconnect()

    const posts = get.length > take ? get.slice(0, -1) : get
    const cursor = get.length > posts.length ? get[get.length - 1].id : false

    return {
      props: {
        cursor,
        filters,
        posts,
      },
    }
  } catch (error) {
    await prisma.$disconnect()

    throw Error('Not Found')
  }
}

export const getPostsByUser = async (query) => {
  let where = {}
  const { filters, request } = getPostsRequest(query)

  if (!query.user) {
    return {
      notFound: true,
    }
  }

  const id = parseInt(query.user)

  if (!isFinite(id)) {
    set(where, 'name', query.user)
  } else {
    set(where, 'id', id)
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  let { posts: get, ...user } = await prisma.user
    .findFirst({
      include: {
        posts: request,
      },
      where,
    })
    .then((response) => JSON.parse(JSON.stringify(response)))

  if (!user) {
    return {
      notFound: true,
    }
  }

  const posts = get.length > take ? get.slice(0, -1) : get
  const cursor = get.length > posts.length ? get[get.length - 1].id : false

  return {
    props: {
      cursor,
      filters,
      posts,
      user,
    },
  }
}
