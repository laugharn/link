import Link from 'next/link'
import { useAuth } from '~/containers/auth'
import { useRouter } from 'next/router'

export const Nav = () => {
  const { authenticated, logout, user } = useAuth()
  const { push } = useRouter()

  return (
    <div className="bg-yellow-100 dark:bg-gray-800 flex justify-between leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      <div>
        <Link href="/">
          <a
            className="text-black dark:text-white md:hover:text-blue-500"
            title="Links"
          >
            Link
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
        {authenticated && user.id && (
          <button
            className="text-black dark:text-white md:hover:text-blue-500"
            onClick={() => {
              push(`/?user=${user.name ?? user.id}`)
            }}
          >
            {user.name ?? `User #${user.id}`}
          </button>
        )}
        {authenticated === false && (
          <Link href="/start">
            <a
              className="text-black dark:text-white md:hover:text-blue-500"
              title="Start"
            >
              Start
            </a>
          </Link>
        )}
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
    </div>
  )
}
