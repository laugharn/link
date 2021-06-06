import cheerio from 'cheerio'
import createError from 'http-errors'
import { isFinite, pick, set } from 'lodash'
import { parse } from 'url'
import { PrismaClient } from '@prisma/client'

const take = 20

export const destroy = async (req, res) => {
  const { query, session } = req

  const id = session.get('id')

  if (!id) {
    throw createError(401)
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    await prisma.post.deleteMany({
      where: {
        id: +query.id,
        user: {
          id,
        },
      },
    })

    await prisma.$disconnect()

    res.end('ok')
  } catch (error) {
    await prisma.$disconnect()

    throw createError(400)
  }
}

const getFilters = (query) =>
  pick(query, ['cursor', 'direction', 'domain', 'host', 'tag', 'url', 'user'])

const getPostsRequest = (query) => {
  const filters = getFilters(query)

  let request = {
    include: {
      _count: {
        select: {
          children: true,
        },
      },
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

export const getPostByUser = async (context) => {
  const { params, query } = context

  const id = parseInt(params.post)

  if (!isFinite(id)) {
    return {
      notFound: true,
    }
  }

  const filters = pick(query, ['cursor', 'direction'])

  const prisma = new PrismaClient()
  await prisma.$connect()

  const request = {
    include: {
      posts: {
        include: {
          children: {
            include: {
              user: true,
            },
            orderBy: {
              id: filters.direction === 'desc' ? 'desc' : 'asc',
            },
            take: take + 1,
            where: {
              type: 'comment',
            },
          },
          url: true,
          user: true,
        },
        where: {
          id,
        },
      },
    },
    where: {
      name: params.user,
    },
  }

  if (filters.cursor) {
    const id = parseInt(filters.cursor)

    if (!isFinite(id)) {
      return {
        notFound: true,
      }
    }

    set(request, 'include.posts.include.children.where.id', {
      [filters.direction === 'desc' ? 'lte' : 'gte']: id,
    })
  }

  try {
    const { posts, ...user } = await prisma.user
      .findFirst(request)
      .then((response) => JSON.parse(JSON.stringify(response)))

    await prisma.$disconnect()

    if (!user) {
      return {
        notFound: true,
      }
    }

    if (posts.length === 0) {
      return {
        notFound: true,
      }
    }

    const children =
      posts[0].children?.length > take
        ? posts[0].children.slice(0, -1)
        : posts[0].children
    const cursor =
      posts[0].children?.length > children.length
        ? posts[0].children[posts[0].children.length - 1].id
        : false

    return {
      props: {
        children,
        cursor,
        filters,
        post: posts[0],
        user,
      },
    }
  } catch (error) {
    await prisma.$disconnect()

    return {
      notFound: true,
    }
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

  try {
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
  } catch (error) {
    await prisma.$disconnect()

    return {
      notFound: true,
    }
  }
}

export const store = async (req, res) => {
  if (req.body.type === 'link') {
    await storeLink(req, res)
  } else {
    throw createError(422)
  }
}

const storeLink = async (req, res) => {
  const id = req.session.get('id')

  if (!id) {
    throw createError(401)
  }

  const { body, type, url, ...data } = req.body

  if ([type !== 'link', !url].includes(true)) {
    throw createError(422)
  }

  const date = new Date()

  let query = {
    data: {
      createdAt: date,
      type,
      updatedAt: date,
      url: {
        connectOrCreate: {
          create: {
            createdAt: date,
            updatedAt: date,
            url,
            user: {
              connect: {
                id,
              },
            },
          },
          where: {
            url,
          },
        },
      },
      user: {
        connect: {
          id,
        },
      },
      ...data,
    },
    include: {
      url: true,
      user: true,
    },
  }

  if (body) {
    query.data.children = {
      create: [
        {
          body,
          createdAt: date,
          type: 'comment',
          updatedAt: date,
          user: {
            connect: {
              id,
            },
          },
        },
      ],
    }

    query.data.discussedAt = date
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  try {
    const post = await prisma.post.create(query)

    await prisma.$disconnect()

    if (post.url.createdAt.toString() === date.toString()) {
      let html = '<html></html>'

      html = await fetch(url)
        .then(async (response) => await response.text())
        .catch(() => '<html></html>')

      const $ = cheerio.load(html)

      const meta = {
        app_url:
          $('meta[property="twitter:app:url:googleplay"]').attr('content') ??
          $('meta[property="twitter:app:url:iphone"]').attr('content') ??
          $('meta[property="al:ios:url"]').attr('content') ??
          $('meta[property="al:ios:url"]').attr('content'),
        audio:
          $('meta[property="og:audio:secure_url"]').attr('content') ??
          $('meta[property="og:audio"]').attr('content') ??
          $('meta[property="twitter:player:stream:content_type"]').attr(
            'content'
          ) ??
          $('meta[property="twitter:player:stream"]').attr('content'),
        description:
          $('meta[property="og:description"]').attr('content') ??
          $('meta[name="twitter:description"]').attr('content') ??
          $('meta[name="description"]').attr('content') ??
          $('meta[itemprop="description"]').attr('content'),
        height:
          $('meta[property="og:video:height"]').attr('content') ||
          $('meta[property="twitter:player:height"]').attr('content'),
        image:
          $('meta[property="og:image:secure_url"]').attr('content') ??
          $('meta[property="og:image:url"]').attr('content') ??
          $('meta[property="og:image"]').attr('content') ??
          $('meta[name="twitter:image:src"]').attr('content') ??
          $('meta[name="twitter:image"]').attr('content') ??
          $('meta[itemprop="image"]').attr('content'),
        publisher: $('meta[property="og:site_name"]').attr('content'),
        title:
          $('meta[property="og:title"]').attr('content') ??
          $('meta[name="twitter:title"]').attr('content') ??
          $('title').text(),
        type: $('meta[property="og:type"]').attr('content') ?? 'website',
        video:
          $('meta[property="og:video:secure_url"]').attr('content') ??
          $('meta[property="og:video:url"]').attr('content') ??
          $('meta[property="og:video"]').attr('content') ??
          $('meta[property="twitter:player:stream"]').attr('content'),
        width:
          $('meta[property="og:video:width"]').attr('content') ??
          $('meta[property="twitter:player:width"]').attr('content'),
      }

      let parsed = parse(url)

      const duplexes = ['co.uk']
      const parts = parsed.host.split('.')
      const [_, domain] =
        parts.length > 2
          ? duplexes.find((duplex) => parsed.host.endsWith(duplex))
            ? [parts.slice(0, -3).join('.'), parts.slice(-3).join('.')]
            : [parts.slice(0, -2).join('.'), parts.slice(-2).join('.')]
          : [parsed.host]

      parsed.domain = domain

      await prisma.$connect()

      await prisma.url.update({
        data: {
          meta,
          parsed,
        },
        where: {
          url,
        },
      })
    }

    res.json({ post })

    return
  } catch (error) {
    await prisma.$disconnect()

    throw createError(400)
  }
}
