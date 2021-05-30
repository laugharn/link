import { getPosts } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPosts } from '~/components/post'

const Page = ({ cursor, filters, posts }) => {
  return (
    <>
      <Head>
        <title>Home - Links</title>
      </Head>
      <LinkPosts cursor={cursor} filters={filters} posts={posts} />
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  try {
    const response = await getPosts(query)

    return response
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default Page
