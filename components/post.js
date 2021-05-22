import { createContainer } from 'unstated-next'
import { Fragment } from 'react'
import { getTimestamp } from '~/lib/time'
import Link from 'next/link'
import { stringify } from 'qs'

const { Provider: PostProvider, useContainer: usePost } = createContainer(
  (initialState = {}) => {
    const { filters = {}, post } = initialState

    return { filters, post }
  }
)

const Filters = ({ filters }) => {
  return (
    <div className="bg-yellow-50 dark:bg-gray-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      Posts /
      <Link href={`/?${stringify({
          ...filters,
          direction: 'asc',
      })}`}>
      <a
          className={`${
            filters.direction === 'asc'
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-400 dark:text-gray-600'
          } md:hover:text-blue-500`}
        >↑</a>
      </Link>
      <Link href={`/?${stringify({
          ...filters,
          direction: 'desc',
      })}`}>
        <a
          className={`${
            filters.direction !== 'asc'
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-400 dark:text-gray-600'
          } md:hover:text-blue-500`}
        >
          ↓
        </a>
      </Link>
    </div>
  )
}

const LinkData = () => {
  const { post } = usePost()

  return (
    <li className="text-gray-300 dark:text-gray-700">
      <Link href={`/links/${post.id}`}>
        <a className="text-black dark:text-white md:hover:text-blue-500">↳</a>
      </Link>
      {' / Created '}
      <Timestamp
        href={`/?createdAt=${new Date(post?.createdAt).toISOString()}`}
        timestamp={post.createdAt}
      />
      <LinkTags />
    </li>
  )
}

export const LinkPost = ({ post }) => {
  return (
    <PostProvider initialState={{ post }}>
      <ul className="leading-6 md:leading-10 p-2 text-lg md:text-4xl w-full">
        <LinkPostTitle />
        <LinkPostDescription />
        <LinkPostUrl />
        <LinkData />
      </ul>
    </PostProvider>
  )
}

const LinkPostDescription = () => {
  const { post } = usePost()

  if (post.url?.meta?.description) {
    return (
      <li className="text-gray-600 dark:text-gray-400">
        {post.url.meta.description}
      </li>
    )
  }

  return null
}

export const LinkPosts = ({ filters, nextTime, posts }) => {
  return (
    <div className="w-full">
      <Filters filters={filters} />
      <div className="space-y-4">
        {posts.map((post) => {
          return <LinkPost key={post.id} post={post} />
        })}
      </div>
      <Pagination filters={filters} nextTime={nextTime} />
    </div>
  )
}

const LinkPostTitle = () => {
  const { post } = usePost()

  if (post.url) {
    return (
      <li>
        <Link href={post.url.url}>
          <a
            className="md:hover:text-blue-500"
            target="_blank"
            title={post.url.meta?.title ?? post.url.url}
          >
            {post.url.meta?.title ?? post.url.url}
          </a>
        </Link>
      </li>
    )
  }

  return null
}

const LinkPostUrl = () => {
  const { post } = usePost()

  if (!post.url) {
    return null
  }

  const duplexes = ['co.uk']
  const parts = post?.url.parsed.host.split('.')
  const [host, domain] =
    parts.length > 2
      ? duplexes.find((duplex) => post.url.parsed.host.endsWith(duplex))
        ? [parts.slice(0, -3).join('.'), parts.slice(-3).join('.')]
        : [parts.slice(0, -2).join('.'), parts.slice(-2).join('.')]
      : [post?.url.parsed.host]

  return (
    <li className="text-gray-300 dark:text-gray-700">
      <Link href={`/?host=${post?.url.parsed.host}`}>
        <a
          className="break-words text-gray-500 md:hover:text-blue-500"
          title={`Links on ${post?.url.parsed.host}`}
        >
          {host}
        </a>
      </Link>
      {domain && (
        <>
          {' / '}
          <Link href={`/?domain=${domain}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              {domain}
            </a>
          </Link>
        </>
      )}
    </li>
  )
}

const LinkTags = () => {
  const { post } = usePost()

  if (post.tags.length > 0) {
    return (
      <>
        {' / Tagged'}
        {post.tags.map((tag) => {
          return (
            <Fragment key={`post-${post.id}-tag-${tag}`}>
              {' '}
              <Tag tag={tag} />
            </Fragment>
          )
        })}
      </>
    )
  }

  return null
}

const Pagination = ({ filters, nextTime }) => {
  if (!nextTime) {
    return null
  }

  const query = {
    ...filters,
    createdAt: nextTime,
  }

  return (
    <div className="pb-2 pt-6 px-2 text-lg md:text-4xl">
      <Link href={`/?${stringify(query)}`}>
        <a className="text-blue-300 dark:text-blue-900 md:hover:text-blue-500">
          More Links
        </a>
      </Link>
    </div>
  )
}

const Tag = ({ tag }) => {
  return (
    <Link href={`/?tag=${tag}`}>
      <a className="text-purple-300 dark:text-purple-800 md:hover:text-blue-500">
        {tag}
      </a>
    </Link>
  )
}

const Timestamp = ({ href, timestamp }) => {
  return (
    <Link href={href}>
      <a className="text-gray-500 md:hover:text-blue-500">
        {getTimestamp(timestamp)}
      </a>
    </Link>
  )
}
