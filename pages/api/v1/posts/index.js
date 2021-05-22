import cheerio from 'cheerio'
import { parse } from 'url'
import { prisma, PrismaClient } from '@prisma/client'

const index = async (req, res) => {
  const prisma = new PrismaClient()
  await prisma.$connect()

  const posts = await prisma.post
    .findMany({
      include: {
        url: true,
      },
    })
    .then((response) => JSON.parse(JSON.stringify(response)))

  await prisma.$disconnect()

  res.json({ posts })
}

const store = async (req, res) => {
  const { url, ...data } = req.body

  if ([data.type !== 'link', !url].includes(true)) {
    res.statusMessage = 'Unprocessable Entity'
    res.status(422).end()

    return
  }

  const date = new Date()
  const normalizedUrl = url

  try {
    const prisma = new PrismaClient()
    await prisma.$connect()

    const post = await prisma.post.create({
      data: {
        createdAt: date,
        updatedAt: date,
        url: {
          connectOrCreate: {
            create: {
              createdAt: date,
              updatedAt: date,
              url: normalizedUrl,
            },
            where: {
              url: normalizedUrl,
            },
          },
        },
        ...data,
      },
      include: {
        url: true,
      },
    })

    await prisma.$disconnect()

    if (post.url.createdAt.toString() === date.toString()) {
      let html = '<html></html>'

      html = await fetch(normalizedUrl)
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

      let parsed = parse(normalizedUrl)

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
          url: normalizedUrl,
        },
      })
    }

    res.json({ post })

    return
  } catch (error) {
    await prisma.$disconnect()

    res.statusMessage = error.message ?? 'Bad Request'
    res.status(error.statusCode ?? 400).end()

    return
  }
}

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    await index(req, res)
  } else if (method === 'POST') {
    await store(req, res)
  } else {
    res.statusMessage = 'Method Not Allowed'
    res.status(405).end()
  }
}

export default handler
