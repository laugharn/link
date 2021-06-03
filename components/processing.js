import { useApp } from '../containers/app'
import { useLayoutEffect } from 'react'

const Processor = () => {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => (document.body.style.overflow = originalStyle)
  }, [])

  return (
    <div className="backdrop-blur-sm backdrop-filter backdrop-grayscale fixed flex inset-0 items-center justify-center z-50">
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
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  )
}

export const Processing = () => {
  const { processing } = useApp()

  if (processing) {
    return <Processor />
  }

  return null
}
