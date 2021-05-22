import Head from 'next/head'
import { isFinite } from 'lodash'
import { LinkPost } from '~/components/post'
import { PrismaClient } from '@prisma/client'

const Page = ({ post }) => (
  <>
    <Head>
      <title>
        Link no. {post.id} at {post.url.url} - Link
      </title>
    </Head>
    <LinkPost post={post} />
  </>
)

export const getStaticPaths = () => {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export const getStaticProps = async ({ params }) => {
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
      revalidate: 1,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 1,
  }
}

export default Page
