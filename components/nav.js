import Link from 'next/link'

export const Nav = () => {
  return (
    <div className="bg-yellow-100 dark:bg-gray-800 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      <Link href="/"><a className="text-black dark:text-white md:hover:text-blue-500" title="Link">Link</a></Link>{' / '}
      <Link href="/create"><a className="text-teal-500 md:hover:text-blue-500" title="Create">Create</a></Link>
    </div>
  )
}
