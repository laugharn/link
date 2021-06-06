import { createContainer } from 'unstated-next'
import { Fragment } from 'react'
import { humanTimeDiff } from '../lib/time'
import Link from 'next/link'
import { omit, uniq, sortBy } from 'lodash'
import { useAuth } from '../containers/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  WayfindingAdd,
  WayfindingAscending,
  WayfindingDescending,
  WayfindingRemove,
} from './wayfinding'

const getBasepath = (asPath) => new URL(`https://url.com${asPath}`).pathname

export const getHrefFromFilters = (filters = {}, config = {}) => {
  const { addition = {}, removeKeys = [], useAsPath = false } = config
  const { asPath } = useRouter()

  const query = omit(
    {
      ...filters,
      ...addition,
    },
    removeKeys
  )

  const pathname = useAsPath
    ? new URL(`https://url.com${asPath}`).pathname
    : query.user
    ? `/${query.user}`
    : '/'

  if (query.user) {
    delete query.user
  }

  return {
    pathname,
    query,
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

const CommentData = () => {
  const { asPath } = useRouter()
  const { authenticated, user } = useAuth()
  const { isDeleting, post, setIsDeleted, setIsDeleting } = usePost()

  const basepath = new URL(`https://url.com${asPath}`).pathname

  return (
    <li className="text-gray-300 dark:text-gray-700">
      <Link href={`${basepath}?cursor=${post.id}`}>
        <a className="text-gray-500 md:hover:text-blue-500">#{post.id}</a>
      </Link>
      {` / `}
      <Link href={`/${post.user.name}`}>
        <a className="text-black dark:text-white md:hover:text-blue-500">
          {post.user.name}
        </a>
      </Link>
      {` / ${humanTimeDiff(post.createdAt)}`}
      {authenticated && user?.id === post.user.id && (
        <>
          {' / '}
          <button
            className="text-red-300 dark:text-red-800 md:hover:text-blue-500"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true)

              await fetch(`/api/v1/posts/${post.id}`, {
                method: 'DELETE',
              }).then((response) => {
                setIsDeleting(false)

                if (response.ok) {
                  setIsDeleted(true)
                }
              })
            }}
          >
            Delete
          </button>
        </>
      )}
    </li>
  )
}

export const CommentPost = () => {
  const { isDeleted } = usePost()

  return (
    <ul className="leading-6 md:leading-10 p-2 relative text-lg md:text-4xl w-full">
      <CommentPostBody />
      <CommentData />
      {isDeleted && (
        <div className="absolute bg-white dark:bg-black inset-0 opacity-50 z-20" />
      )}
    </ul>
  )
}

const CommentPostBody = () => {
  const { post } = usePost()

  if (post.body) {
    return <li className="text-gray-700 dark:text-gray-300">{post.body}</li>
  }

  return null
}

export const CommentPosts = ({ cursor, filters, posts }) => {
  return (
    <div className="w-full" id="comments">
      <CommentFilters cursor={cursor} filters={filters} posts={posts} />
      <div className="md:space-y-4">
        {posts.length === 0 && (
          <div className="leading-6 md:leading-10 p-2 text-lg md:text-4xl text-gray-300 dark:text-gray-800">
            No comments match your query.
          </div>
        )}
        {posts.map((post) => {
          return (
            <Post key={post.id} post={post}>
              <CommentPost />
            </Post>
          )
        })}
      </div>
      {cursor && (
        <div className="pb-2 pt-6 px-2 text-lg md:text-4xl">
          <Link
            href={getHrefFromFilters(filters, {
              addition: { cursor },
              useAsPath: true,
            })}
          >
            <a className="text-orange-500 md:hover:text-blue-500">
              More Comments
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

const CommentFilters = ({ filters = {}, posts = [] }) => {
  return (
    <div className="bg-gray-500 leading-6 md:leading-10 p-2 text-gray-700 text-lg md:text-4xl w-full">
      <Link href={getHrefFromFilters(filters, { useAsPath: true })}>
        <a className="text-gray-300 md:hover:text-blue-500">
          {posts.length} Comment{posts.length === 1 ? '' : 's'}
        </a>
      </Link>
      {' / '}
      <WayfindingAscending
        href={getHrefFromFilters(filters, {
          removeKeys: ['direction'],
          useAsPath: true,
        })}
        isActive={filters.direction !== 'desc'}
      />
      <WayfindingDescending
        href={getHrefFromFilters(filters, {
          addition: { direction: 'desc' },
          useAsPath: true,
        })}
        isActive={filters.direction === 'desc'}
      />
    </div>
  )
}

const Filters = ({ cursor, filters, posts = [] }) => {
  const tags = filters.tag ? sortBy(filters.tag.split(','), (tag) => tag) : []

  return (
    <div className="bg-gray-500 leading-6 md:leading-10 p-2 text-gray-700 text-lg md:text-4xl w-full">
      <Link href={getHrefFromFilters(filters)}>
        <a className="text-gray-300 md:hover:text-blue-500">
          {posts.length}
          {cursor ? ' ' : ' '}
          {posts.length === 1 ? 'Link' : 'Links'}
        </a>
      </Link>
      {' / '}
      <WayfindingAscending
        href={getHrefFromFilters(filters, { addition: { direction: 'asc' } })}
        isActive={filters.direction === 'asc'}
      />
      <WayfindingDescending
        href={getHrefFromFilters(filters, { removeKeys: ['direction'] })}
        isActive={filters.direction !== 'asc'}
      />
      {filters.cursor && (
        <>
          {' / From '}
          <Link href={`/?cursor=${filters.cursor}`}>
            <a className="break-words text-gray-300 md:hover:text-blue-500">
              #{filters.cursor}
            </a>
          </Link>
          <WayfindingRemove
            href={getHrefFromFilters(filters, { removeKeys: ['cursor'] })}
            title="Remove cursor"
          />
        </>
      )}
      {filters.domain && (
        <>
          {' / On '}
          <Link href={`/?domain=${filters.domain}`}>
            <a className="break-words text-gray-300 md:hover:text-blue-500">
              {filters.domain}
            </a>
          </Link>
          <WayfindingRemove
            href={getHrefFromFilters(filters, { removeKeys: ['domain'] })}
            title="Remove domain"
          />
        </>
      )}
      {filters.host && (
        <>
          {' / On '}
          <Link href={`/?host=${filters.host}`}>
            <a className="break-words text-gray-300 md:hover:text-blue-500">
              {filters.host}
            </a>
          </Link>
          <WayfindingRemove
            href={getHrefFromFilters(filters, { removeKeys: ['host'] })}
            title="Remove host"
          />
        </>
      )}
      {filters.url && (
        <>
          {' / At '}
          <Link href={`/?url=${filters.url}`}>
            <a className="break-words text-gray-300 md:hover:text-blue-500">
              {filters.url}
            </a>
          </Link>
          <WayfindingRemove
            href={getHrefFromFilters(filters, { removeKeys: ['url'] })}
            title="Remove URL"
          />
        </>
      )}
      {tags.length > 0 && (
        <>
          {' / Tagged'}
          {tags.map((tag) => {
            return (
              <Fragment key={`tag-${tag}`}>
                {' '}
                <Tag context="filters" tag={tag} />
                <WayfindingRemove
                  href={
                    tags.length === 1
                      ? getHrefFromFilters(filters, { removeKeys: ['tag'] })
                      : getHrefFromFilters(filters, {
                          addition: {
                            tag: tags.filter((t) => t !== tag).join(','),
                          },
                        })
                  }
                  title="Remove tag"
                />
              </Fragment>
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
      <Link href={`/${post.user.name}/links/${post.id}`}>
        <a
          className="text-black dark:text-white md:hover:text-blue-500"
          title="Go to Link"
        >
          ↳
        </a>
      </Link>
      {` / `}
      <Link href={`/?cursor=${post.id}`}>
        <a className="text-gray-500 md:hover:text-blue-500">#{post.id}</a>
      </Link>
      <WayfindingAdd
        href={getHrefFromFilters(filters, {
          addition: {
            cursor: post.id,
          },
        })}
        title="Add cursor to query"
      />
      {` / `}
      <Link href={`/${post.user.name}`}>
        <a className="text-black dark:text-white md:hover:text-blue-500">
          {post.user.name}
        </a>
      </Link>
      <WayfindingAdd
        href={getHrefFromFilters(filters, {
          addition: {
            user: post.user.name,
          },
        })}
        title="Add user to query"
      />
      {` / ${humanTimeDiff(post.createdAt)}`}
      <LinkTags />
      {post._count?.children > 0 && (
        <>
          {' / '}
          <Link href={`/${post.user.name}/links/${post.id}#comments`}>
            <a className="text-gray-500 md:hover:text-blue-500">Comments</a>
          </Link>
        </>
      )}
      {authenticated && user?.id === post.user.id && (
        <>
          {' / '}
          <button
            className="text-red-300 dark:text-red-800 md:hover:text-blue-500"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true)

              await fetch(`/api/v1/posts/${post.id}`, {
                method: 'DELETE',
              }).then((response) => {
                setIsDeleting(false)

                if (response.ok) {
                  setIsDeleted(true)
                }
              })
            }}
          >
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
      <li className="line-clamp-2 text-gray-600 dark:text-gray-400">
        {post.url.meta.description}
      </li>
    )
  }

  return null
}

export const LinkPosts = ({ context, cursor, filters, posts }) => {
  return (
    <div className="w-full">
      <Filters
        context={context}
        cursor={cursor}
        filters={filters}
        posts={posts}
      />
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
      <Pagination filters={filters} cursor={cursor} />
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
          <a
            className="text-blue-700 dark:text-blue-300 md:hover:text-blue-500"
            target="_blank"
            title={title}
          >
            {title}
          </a>
        </Link>
        <WayfindingAdd
          href={getHrefFromFilters(filters, {
            addition: {
              url: post.url.url,
            },
            removeKeys: ['domain', 'host'],
          })}
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
        href={getHrefFromFilters(filters, {
          addition: {
            host: post?.url.parsed.host,
          },
          removeKeys: ['domain', 'url'],
        })}
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
            href={getHrefFromFilters(filters, {
              addition: {
                domain: post?.url.parsed.domain,
              },
              removeKeys: ['host', 'url'],
            })}
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
        {' / '}
        {sortBy(post.tags, (tag) => tag).map((tag) => {
          return (
            <Fragment key={`post-${post.id}-tag-${tag}`}>
              {' '}
              <Tag tag={tag} />
              <WayfindingAdd
                href={getHrefFromFilters(filters, {
                  addition: {
                    tag: filters.tag
                      ? uniq([...filters.tag.split(','), tag]).join(',')
                      : tag,
                  },
                })}
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

const Pagination = ({ filters, cursor }) => {
  if (!cursor) {
    return null
  }

  return (
    <div className="pb-2 pt-6 px-2 text-lg md:text-4xl">
      <Link href={getHrefFromFilters(filters, { addition: { cursor } })}>
        <a className="text-orange-500 md:hover:text-blue-500">More Links</a>
      </Link>
    </div>
  )
}

export const Post = ({ children, filters, post }) => {
  return (
    <PostProvider initialState={{ filters, post }}>{children}</PostProvider>
  )
}

const Tag = ({ context, tag }) => {
  return (
    <Link href={`/?tag=${tag}`}>
      <a
        className={`${
          context === 'filters' ? 'text-purple-300' : 'text-purple-500'
        } md:hover:text-blue-500`}
        title={`Go to tag "${tag}"`}
      >
        {tag}
      </a>
    </Link>
  )
}
