import { FormStart } from '~/components/form'
import { useAuth } from '~/containers/auth'

const Page = () => {
  const { authenticated, logout } = useAuth()

  if (authenticated) {
    return (
      <div>
        You are already authenticated. Click here to logout, or click here to go
        home.
      </div>
    )
  }

  if (authenticated === false) {
    return (
      <div className="w-full">
        <div className="bg-yellow-50 dark:bg-gray-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
          Get Started
        </div>
        <FormStart />
      </div>
    )
  }

  return null
}

export default Page
