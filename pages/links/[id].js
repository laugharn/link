import { getLink } from '~/lib/post'
import { Head } from '~/components/head'
import { LinkPost } from '~/components/post'

const Page = ({ post }) => (
  <>
    <Head>
      <title>
        Link no. {post.id} at {post.url.url} - Links
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
  const post = await getLink(params)

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
