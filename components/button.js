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
