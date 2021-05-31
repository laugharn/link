import { ButtonMenu } from './button'
import Link from 'next/link'
import { useAuth } from '../containers/auth'
import { useRouter } from 'next/router'

export const Nav = () => {
  const { authenticated, user } = useAuth()
  const { push } = useRouter()

  return (
    <div className="bg-black dark:bg-white flex leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
      {authenticated && (
        <>
          <ButtonMenu />
          <div className="mx-1 md:mx-2.5">{'/'}</div>
        </>
      )}
      <div className="mr-auto">
        <Link href="/">
          <a
            className="text-white dark:text-black md:hover:text-blue-500"
            title="Links"
          >
            Links
          </a>
        </Link>
        {' / '}
        <Link href="/create">
          <a className="text-teal-500 md:hover:text-blue-500" title="Create">
            Create
          </a>
        </Link>
      </div>
      <div>
        {authenticated && user?.id && (
          <button
            className="text-white dark:text-black md:hover:text-blue-500"
            onClick={() => {
              push(`/${user.name}`)
            }}
          >
            {user.name}
          </button>
        )}
        {authenticated === false && (
          <Link href="/start">
            <a
              className="text-white dark:text-black md:hover:text-blue-500"
              title="Start"
            >
              Start
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}
