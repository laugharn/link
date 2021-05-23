export const Callback = ({ callback }) => {
  return (
    <div className="p-2">
      <div
        className={`${
          callback.type === 'error'
            ? 'bg-red-300 dark:bg-red-800 text-red-800 dark:text-red-300'
            : 'bg-emerald-300 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300'
        } leading-6 md:leading-10 p-2 text-lg md:text-4xl w-full`}
      >
        {callback.message}
      </div>
    </div>
  )
}
