import Head from 'next/head'
import { PrismaClient } from '@prisma/client'

const Page = ({ posts }) => {
  return (
    <>
    <Head>
      <title>Home - Link</title>
    </Head>
    <div className="leading-6 md:leading-10 p-2 text-lg md:text-4xl w-full">
      A simple social bookmarking proof of concept built on a rainy Saturday
      morning. Currently displaying {posts.length} {posts.length === 1 ? 'link' : 'links'}.
    </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()
  await prisma.$connect()

  const posts = await prisma.post
    .findMany()
    .then((response) => JSON.parse(JSON.stringify(response)))

  await prisma.$disconnect()

  return {
    props: {
      posts,
    },
  }
}

export default Page
