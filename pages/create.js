import { FormCreate } from '~/components/form'
import { Head } from '~/components/head'
import { Heading } from '~/components/heading'
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
      <Heading href="/create">Create a Link</Heading>
      {authenticated && <FormCreate />}
    </div>
  )
}

export default Page
