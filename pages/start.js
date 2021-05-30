import { FormStart } from '~/components/form'
import { Head } from '~/components/head'
import { Heading } from '~/components/heading'
import { useAuth } from '~/containers/auth'
import { withSession } from '~/lib/session'

const Page = ({ preAuth }) => {
  const { logout } = useAuth()

  return (
    <div className="w-full">
      <Head>
        <title>Get Started - Links</title>
      </Head>
      <Heading href="/start">Get Started</Heading>
      {preAuth && (
        <div className="leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
          You're already logged in.{' '}
          <button
            className="text-gray-500 md:hover:text-blue-500"
            onClick={() => {
              logout()
            }}
          >
            Click here
          </button>{' '}
          to logout and use a different account.
        </div>
      )}
      {!preAuth && <FormStart />}
    </div>
  )
}

export const getServerSideProps = withSession(async ({ req }) => {
  const id = req.session.get('id')

  return {
    props: {
      preAuth: Boolean(id),
    },
  }
})

export default Page
