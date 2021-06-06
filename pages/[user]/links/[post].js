import { getPostByUser } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPost, Post } from '~/components/post'
import { UserHeading } from '~/components/user'

const Page = ({ children, cursor, filters, post, user }) => (
  <>
    <Head>
      <title>
        Link no. {post.id} at {post.url.url} - Links
      </title>
    </Head>
    <UserHeading user={user} />
    <Post post={post}>
      <LinkPost />
    </Post>
  </>
)

export const getServerSideProps = async (context) => {
  const response = await getPostByUser(context)

  return response
}

export default Page
