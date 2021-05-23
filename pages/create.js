import { FormCreate } from '~/components/form'
import { Head } from '~/components/head'
import { useAuth } from '~/containers/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Page = () => {
  const { authenticated } = useAuth()
  const { push } = useRouter()

  useEffect(() => {
    if (authenticated === false) {
      push(`/start?redirect=/create`)
    }
  }, [authenticated])

  return (
    <div className="w-full">
      <Head>
        <title>Create - Links</title>
      </Head>
      <div className="bg-yellow-50 dark:bg-gray-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
        Create a Link
      </div>
      {authenticated && <FormCreate />}
    </div>
  )
}

export default Page
