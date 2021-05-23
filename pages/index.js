import { getLinks } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPosts } from '~/components/post'
import { useAuth } from '~/containers/auth'

const Page = ({ filters, nextTime, posts }) => {
  const { authenticated } = useAuth()

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
