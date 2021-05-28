import Link from 'next/link'
import { memo } from 'react'

export const WayfindingAdd = memo(({ href, ...props }) => (
  <Link href={href}>
    <a
      className="text-teal-300 dark:text-teal-700 md:hover:text-blue-500"
      {...props}
    >
      ↗
    </a>
  </Link>
))

export const WayfindingAscending = memo(({ href, isActive, ...props }) => (
  <Link href={href}>
    <a
      className={`${
        isActive
          ? 'dark:text-teal-700'
          : 'text-gray-400 dark:text-gray-600'
      } md:hover:text-blue-500`}
      {...props}
    >
      ↑
    </a>
  </Link>
))

export const WayfindingDescending = memo(({ href, isActive, ...props }) => (
  <Link href={href}>
    <a
      className={`${
        isActive
          ? 'dark:text-teal-700'
          : 'text-gray-400 dark:text-gray-600'
      } md:hover:text-blue-500`}
      {...props}
    >
      ↓
    </a>
  </Link>
))

export const WayfindingRemove = memo(({ href, ...props }) => (
  <Link href={href}>
    <a
      className="text-rose-300 dark:text-rose-700 md:hover:text-blue-500"
      {...props}
    >
      ↘
    </a>
  </Link>
))
