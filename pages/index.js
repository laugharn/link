import { getLinks } from '~/lib/post'
import Head from 'next/head'
import { LinkPosts } from '~/components/post'

const Page = ({ filters, nextTime, posts }) => {
  return (
    <>
      <Head>
        <title>Home - Link</title>
      </Head>
      <LinkPosts filters={filters} nextTime={nextTime} posts={posts} />
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  const props = await getLinks(query)

  return {
    props,
  }
}

export default Page
