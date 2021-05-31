import { useApp } from '../containers/app'

export const ButtonMenu = () => {
  const { setShowMenu } = useApp()

  return (
    <button onClick={() => {
      setShowMenu(true)
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 md:h-10 text-gray-500 md:hover:text-blue-500 w-6 md:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  )
}

export const ButtonSubmit = ({ children, disabled }) => {
  return (
    <button
      className="disabled:cursor-not-allowed leading-6 md:leading-10 disabled:opacity-25 text-lg md:text-4xl text-emerald-500 md:hover:text-blue-500"
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  )
}
