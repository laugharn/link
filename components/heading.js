import Link from 'next/link'

export const Heading = ({ children, href }) => {
  return (
    <div className="bg-gray-500 leading-6 md:leading-10 p-2 text-gray-700 text-lg md:text-4xl w-full">
      <Link href={href}>
        <a className="text-gray-300 md:hover:text-blue-500">{children}</a>
      </Link>
    </div>
  )
}
