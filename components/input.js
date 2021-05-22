import { memo } from 'react'
import PropTypes from 'prop-types'

export const Input = memo(
  ({
    disabled,
    error,
    id,
    label,
    showError,
    touched,
    type,
    value,
    ...props
  }) => {
    return (
      <div className={`${disabled ? 'opacity-25' : ''} w-full`}>
        {label && (
          <label className="block leading-6 md:leading-10 text-lg md:text-4xl text-gray-600 dark:text-gray-400 w-full">
            {label}
          </label>
        )}
        <input
          className={`appearance-none bg-white dark:bg-black border md:border-2 ${
            touched && error
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          } focus:border-gray-700 dark:focus:border-gray-300 leading-6 md:leading-10 outline-none p-2 rounded-none text-lg md:text-4xl w-full`}
          type={type}
          value={value}
          {...props}
        />
        {touched && error && showError && (
          <div className="leading-6 md:leading-10 text-lg md:text-4xl text-red-300 dark:text-red-700">
            {error}
          </div>
        )}
      </div>
    )
  }
)

Input.defaultProps = {
  disabled: false,
  showError: true,
  type: 'text',
}

Input.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.any,
  label: PropTypes.string,
  showError: PropTypes.bool,
  touched: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.any.isRequired,
}
