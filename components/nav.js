import Link from 'next/link'
import { useAuth } from '~/containers/auth'

export const Nav = () => {
  const { authenticated, logout } = useAuth()

  return (
    <div className="bg-yellow-100 dark:bg-gray-800 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      <Link href="/">
        <a
          className="text-black dark:text-white md:hover:text-blue-500"
          title="Links"
        >
          Link
        </a>
      </Link>
      {authenticated === false && (
        <>
          {' / '}
          <Link href="/start">
            <a className="text-gray-500 md:hover:text-blue-500" title="Start">
              Start
            </a>
          </Link>
        </>
      )}
      {' / '}
      <Link href="/create">
        <a className="text-teal-500 md:hover:text-blue-500" title="Create">
          Create
        </a>
      </Link>
      {authenticated && (
        <>
          {' / '}
          <button
            className="text-gray-500 md:hover:text-blue-500"
            onClick={async () => {
              await logout()
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  )
}
