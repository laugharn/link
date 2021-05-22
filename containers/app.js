import { createContainer } from 'unstated-next'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useContainer = () => {
  const { events } = useRouter()

  const [pushing, setPushing] = useState(false)

  useEffect(() => {
    events.on('routeChangeComplete', () => {
      setPushing(false)
    })

    events.on('routeChangeError', () => {
      setPushing(false)
    })

    events.on('routeChangeStart', () => {
      setPushing(true)
    })
  }, [])

  useEffect(() => {
    pushing ? NProgress.start() : NProgress.done()
  }, [pushing])
}

export const { Provider: AppProvider, useContainer: useApp } =
  createContainer(useContainer)
