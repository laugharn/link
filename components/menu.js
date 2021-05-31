import { useApp } from '../containers/app'
import { useAuth } from '../containers/auth'
import { useLayoutEffect } from 'react'

const Processor = () => {
    const { logout } = useAuth()
  const { setShowMenu } = useApp()

  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => (document.body.style.overflow = originalStyle)
  }, [])

  return (
    <div className="backdrop-blur-sm backdrop-filter backdrop-grayscale bg-gray-500 bg-opacity-10 fixed inset-0 z-50">
      <div className="bg-black dark:bg-white bottom-0 fixed top-0 w-full md:w-80">
        <div className="flex justify-between leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
          <span>Menu</span>
          <button
            className="text-gray-500 md:hover:text-blue-500"
            onClick={() => {
              setShowMenu(false)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 md:h-10 w-6 md:w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
            <button className="text-gray-300 md:hover:text-blue-500" onClick={() => {
                logout()
                setShowMenu(false)
            }}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export const Menu = () => {
  const { showMenu } = useApp()

  if (showMenu) {
    return <Processor />
  }

  return null
}
