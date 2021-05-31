import Link from 'next/link'
import { memo } from 'react'

export const WayfindingAdd = memo(({ href, ...props }) => (
  <Link href={href}>
    <a
      className="ml-0.5 md:ml-0 text-teal-300 dark:text-teal-700 md:hover:text-blue-500"
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
          ? 'text-cyan-500'
          : 'text-gray-300'
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
          ? 'text-cyan-500'
          : 'text-gray-300'
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
      className="ml-0.5 md:ml-0 text-rose-700 md:hover:text-blue-500"
      {...props}
    >
      ↘
    </a>
  </Link>
))
