import { getPostsByUser } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPosts } from '~/components/post'
import { UserHeading } from '~/components/user'

const Page = ({ cursor, filters, posts, user }) => {
  return (
    <>
      <Head>
        <title>Home - Links</title>
      </Head>
      <UserHeading context="posts" filters={filters} user={user} />
      <LinkPosts context="user" cursor={cursor} filters={filters} posts={posts} />
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  try {
    const response = await getPostsByUser(query)

    return response
  } catch (error) {
      console.log(error)
    return {
      notFound: true,
    }
  }
}

export default Page
