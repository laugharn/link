import Link from 'next/link'
import { getHrefFromFilters } from './post'
import { WayfindingRemove } from './wayfinding'

export const UserHeading = ({ context, filters = {}, user }) => {
  return (
    <div className="bg-pink-500 leading-6 md:leading-10 p-2 text-pink-700 text-lg md:text-4xl w-full">
      <Link href={`/${user.name}`}>
        <a className="text-white md:hover:text-blue-500">{user.name}</a>
      </Link>
      {context === 'posts' && (
        <WayfindingRemove
          href={getHrefFromFilters(filters, { removeKeys: ['user'] })}
          title="Remove user"
        />
      )}
      {user.description && (
        <>
          {' / '}
          {user.description}
        </>
      )}
    </div>
  )
}
