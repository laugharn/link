import Link from 'next/link'
import { removeFromFilters } from './post'
import { WayfindingRemove } from './wayfinding'

export const UserHeading = ({ context, filters, user }) => {
  return (
    <div className="bg-pink-100 dark:bg-pink-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      <Link href={`/${user.name ?? user.id}`}>
        <a className="text-black dark:text-white md:hover:text-blue-500">
          {user.name ?? `User #${user.id}`}
        </a>
      </Link>
      {context === 'posts' && (
        <WayfindingRemove
          href={removeFromFilters(filters, ['user'])}
          title="Remove user"
        />
      )}
    </div>
  )
}
