import autosize from 'autosize'
import { Fragment, memo, useEffect, useState } from 'react'

export const Textarea = memo(({ error, id, touched, value, ...props }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const element = document.getElementById(id)

    autosize.destroy(element)
    autosize(element)
  }, [value])

  useEffect(() => {
    if (!loading) {
      const element = document.getElementById(id)

      autosize(element)
    }
  }, [loading])

  useEffect(() => {
    setLoading(false)
  }, [])

  return loading ? (
    <Fragment />
  ) : (
    <textarea
      className={`appearance-none bg-white dark:bg-black border md:border-2 ${
        touched && error
          ? 'border-red-300 dark:border-red-700'
          : 'border-gray-300 dark:border-gray-700'
      } focus:border-gray-700 dark:focus:border-gray-300 leading-6 md:leading-10 outline-none p-2 rounded-md text-lg md:text-4xl w-full`}
      id={id}
      value={value}
      {...props}
    />
  )
})

export const TextareaForm = memo(
  ({
    error,
    helpText,
    id,
    label,
    showError = true,
    showLabel = true,
    touched,
    value,
    ...props
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block leading-6 md:leading-10 pb-1 md:pb-2 text-lg md:text-4xl text-gray-600 dark:text-gray-400 w-full">
            {label}
          </label>
        )}
        <Textarea
          error={error}
          id={id}
          touched={touched}
          value={value}
          {...props}
        />
        {touched && error && showError && (
          <div className="leading-6 md:leading-10 pt-1 md:pt-2 text-lg md:text-4xl text-red-300 dark:text-red-700">
            {error}
          </div>
        )}
      </div>
    )
  }
)
