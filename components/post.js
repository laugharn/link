import { createContainer } from 'unstated-next'
import { Fragment } from 'react'
import { getTimestamp } from '../lib/time'
import Link from 'next/link'
import { omit, uniq, sortBy } from 'lodash'
import { stringify } from 'qs'
import { useAuth } from '../containers/auth'
import { useState } from 'react'
import {
  WayfindingAdd,
  WayfindingAscending,
  WayfindingDescending,
  WayfindingRemove,
} from './wayfinding'

const addToFilters = (addition = {}, filters = {}, config = {}) => {
  const { removeKeys = [] } = config

  return {
    pathname: '/',
    query: omit(
      {
        ...filters,
        ...addition,
      },
      removeKeys
    ),
  }
}

const { Provider: PostProvider, useContainer: usePost } = createContainer(
  (initialState = {}) => {
    const { filters = {}, post } = initialState

    const [isDeleted, setIsDeleted] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    return { filters, isDeleted, isDeleting, post, setIsDeleted, setIsDeleting }
  }
)

const Filters = ({ filters }) => {
  const tags = filters.tag ? sortBy(filters.tag.split(','), (tag) => tag) : []

  return (
    <div className="bg-yellow-50 dark:bg-gray-900 leading-6 md:leading-10 p-2 text-gray-300 dark:text-gray-700 text-lg md:text-4xl w-full">
      <WayfindingAscending
        href={`/?${stringify({
          ...filters,
          direction: 'asc',
        })}`}
        isActive={filters.direction === 'asc'}
      />
      <WayfindingDescending
        href={`/?${stringify({
          ...filters,
          direction: 'desc',
        })}`}
        isActive={filters.direction !== 'asc'}
      />
      {filters.user && (
        <>
          {' / By '}
          <Link href={`/?user=${filters.user}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              User No. {filters.user}
            </a>
          </Link>
          <WayfindingRemove
            href={`/?${stringify(omit(filters, 'user'))}`}
            title="Remove user"
          />
        </>
      )}
      {filters.createdAt && (
        <>
          {' / From '}
          <Timestamp
            href={`/?createdAt=${new Date(filters.createdAt).toISOString()}`}
            timestamp={filters.createdAt}
          />
          <WayfindingRemove
            href={`/?${stringify(omit(filters, 'createdAt'))}`}
            title="Remove created at"
          />
        </>
      )}
      {filters.domain && (
        <>
          {' / On '}
          <Link href={`/?domain=${filters.domain}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              {filters.domain}
            </a>
          </Link>
          <WayfindingRemove
            href={`/?${stringify(omit(filters, 'domain'))}`}
            title="Remove domain"
          />
        </>
      )}
      {filters.host && (
        <>
          {' / On '}
          <Link href={`/?host=${filters.host}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              {filters.host}
            </a>
          </Link>
          <WayfindingRemove
            href={`/?${stringify(omit(filters, 'host'))}`}
            title="Remove host"
          />
        </>
      )}
      {filters.url && (
        <>
          {' / At '}
          <Link href={`/?url=${filters.url}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              {filters.url}
            </a>
          </Link>
          <WayfindingRemove
            href={`/?${stringify(omit(filters, 'url'))}`}
            title="Remove URL"
          />
        </>
      )}
      {tags.length > 0 && (
        <>
          {' / Tagged'}
          {tags.map((tag) => {
            return (
              <span key={`tag-${tag}`}>
                {' '}
                <Link href={`/?tag=${tag}`}>
                  <a className="text-purple-300 dark:text-purple-800 md:hover:text-blue-500">
                    {tag}
                  </a>
                </Link>
              </span>
            )
          })}
        </>
      )}
    </div>
  )
}

const LinkData = () => {
  const { authenticated, user } = useAuth()
  const { filters, isDeleting, post, setIsDeleted, setIsDeleting } = usePost()

  return (
    <li className="text-gray-300 dark:text-gray-700">
      <Link href={`/links/${post.id}`}>
        <a
          className="text-black dark:text-white md:hover:text-blue-500"
          title="Go to Link"
        >
          ↳
        </a>
      </Link>
      {` / By `}
      <Link href={`/?user=${post.user.id}`}>
        <a className="text-black dark:text-white md:hover:text-blue-500">
          User No. {post.user.id}
        </a>
      </Link>
      {' / Linked '}
      <Timestamp
        href={`/?createdAt=${new Date(post?.createdAt).toISOString()}`}
        timestamp={post.createdAt}
      />
      <WayfindingAdd
        href={`/?${stringify({
          ...filters,
          createdAt: new Date(post?.createdAt).toISOString(),
        })}`}
        title="Add timestamp to query"
      />
      <LinkTags />
      {authenticated && user?.id === post.user.id && (
        <>
          {' / '}
          <button className="text-red-300 dark:text-red-800 md:hover:text-blue-500" disabled={isDeleting} onClick={async () => {
            setIsDeleting(true)

            await fetch(`/api/v1/posts/${post.id}`, {
              method: 'DELETE',
            }).then(response => {
              setIsDeleting(false)

              if (response.ok) {
                setIsDeleted(true)
              }
            })
          }}>
            Delete
          </button>
        </>
      )}
    </li>
  )
}

export const LinkPost = () => {
  const { isDeleted } = usePost()

  return (
    <ul className="leading-6 md:leading-10 p-2 relative text-lg md:text-4xl w-full">
      <LinkPostTitle />
      <LinkPostDescription />
      <LinkPostUrl />
      <LinkData />
      {isDeleted && (
        <div className="absolute bg-white dark:bg-black inset-0 opacity-50 z-20" />
      )}
    </ul>
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
      <div className="md:space-y-4">
        {posts.length === 0 && (
          <div className="leading-6 md:leading-10 p-2 text-lg md:text-4xl text-gray-300 dark:text-gray-800">
            No links match your query.
          </div>
        )}
        {posts.map((post) => {
          return (
            <Post filters={filters} key={post.id} post={post}>
              <LinkPost />
            </Post>
          )
        })}
      </div>
      <Pagination filters={filters} nextTime={nextTime} />
    </div>
  )
}

const LinkPostTitle = () => {
  const { filters, post } = usePost()

  if (post.url) {
    const title =
      post.url.meta?.title.length > 0 ? post.url.meta.title : post.url.url

    return (
      <li>
        <Link href={post.url.url}>
          <a className="md:hover:text-blue-500" target="_blank" title={title}>
            {title}
          </a>
        </Link>
        <WayfindingAdd
          href={addToFilters(
            {
              url: post.url.url,
            },
            filters,
            {
              removeKeys: ['domain', 'host'],
            }
          )}
          title="Add URL to query"
        />
      </li>
    )
  }

  return null
}

const LinkPostUrl = () => {
  const { filters, post } = usePost()

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
      <WayfindingAdd
        href={addToFilters(
          {
            host: post?.url.parsed.host,
          },
          filters,
          {
            removeKeys: ['domain', 'url'],
          }
        )}
        title="Add host to query"
      />
      {domain && (
        <>
          {' / '}
          <Link href={`/?domain=${domain}`}>
            <a className="break-words text-gray-500 md:hover:text-blue-500">
              {domain}
            </a>
          </Link>
          <WayfindingAdd
            href={addToFilters(
              {
                domain: post?.url.parsed.domain,
              },
              filters,
              {
                removeKeys: ['host', 'url'],
              }
            )}
            title="Add domain to query"
          />
        </>
      )}
    </li>
  )
}

const LinkTags = () => {
  const { filters, post } = usePost()

  if (post.tags.length > 0) {
    return (
      <>
        {' / Tagged'}
        {sortBy(post.tags, (tag) => tag).map((tag) => {
          return (
            <Fragment key={`post-${post.id}-tag-${tag}`}>
              {' '}
              <Tag tag={tag} />
              <WayfindingAdd
                href={addToFilters(
                  {
                    tag: filters.tag
                      ? uniq([...filters.tag.split(','), tag]).join(',')
                      : tag,
                  },
                  filters
                )}
                title="Add tag to query"
              />
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

export const Post = ({ children, filters, post }) => {
  return (
    <PostProvider initialState={{ filters, post }}>{children}</PostProvider>
  )
}

const Tag = ({ tag }) => {
  return (
    <Link href={`/?tag=${tag}`}>
      <a
        className="text-purple-300 dark:text-purple-800 md:hover:text-blue-500"
        title={`Go to tag "${tag}"`}
      >
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
