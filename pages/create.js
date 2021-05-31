import { FormCreate } from '~/components/form'
import { Head } from '~/components/head'
import { Heading } from '~/components/heading'
import { withSession } from '~/lib/session'

const Page = () => {
  return (
    <div className="w-full">
      <Head>
        <title>Create - Links</title>
      </Head>
      <Heading href="/create">Create a Link</Heading>
      <FormCreate />
    </div>
  )
}

export const getServerSideProps = withSession(async ({ req }) => {
  const { session } = req

  const id = session.get('id')

  if (!id) {
    return {
      redirect: {
        destination: '/start?redirect=/create',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
})

export default Page
