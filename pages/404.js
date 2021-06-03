import { Heading } from '~/components/heading'
import Link from 'next/link'

const Page = () => {
  return (
    <div className="flex md:flex-1 flex-col w-full">
      <div className="bg-red-500 leading-6 md:leading-10 p-2 text-red-700 text-lg md:text-4xl w-full">
        404: Not Found.{' '}
        <Link href="/">
          <a className="text-red-300 md:hover:text-blue-500">Click here</a>
        </Link>{' '}
        to return home.
      </div>
      <div className="flex md:flex-1 items-center justify-center text-red-500 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin-slow h-48 md:h-64 w-48 md:w-64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M14.828 14.828a4 4 0 00-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  )
}

export default Page
