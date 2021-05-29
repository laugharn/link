import { getLink } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPost, Post } from '~/components/post'

const Page = ({ post }) => (
  <>
    <Head>
      <title>
        Link no. {post.id} at {post.url.url} - Links
      </title>
    </Head>
    <Post post={post}>
      <LinkPost />
    </Post>
  </>
)

export const getServerSideProps = async ({ params }) => {
  const response = await getLink(params)

  return response
}

export default Page
