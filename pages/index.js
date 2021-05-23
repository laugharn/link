import { getLinks } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPosts } from '~/components/post'

const Page = ({ filters, nextTime, posts }) => {
  return (
    <>
      <Head>
        <title>Home - Links</title>
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
