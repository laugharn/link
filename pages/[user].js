import { getLinks } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPosts } from '~/components/post'

const Page = ({ filters, nextTime, posts }) => {
  return (
    <>
      <Head>
        <title>User No. {filters.user} - Links</title>
      </Head>
      <LinkPosts filters={filters} nextTime={nextTime} posts={posts} />
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  try {
    const props = await getLinks(query)

    return {
      props,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default Page
