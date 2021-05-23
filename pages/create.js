import { FormCreate } from '~/components/form'
import { Head } from '~/components/head'

const Page = () => {
  return (
    <div className="w-full">
      <Head>
        <title>Create - Links</title>
      </Head>
      <div className="bg-yellow-50 dark:bg-gray-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
        Create a Link
      </div>
      <FormCreate />
    </div>
  )
}

export default Page
