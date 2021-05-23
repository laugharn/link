import Cookie from 'js-cookie'
import { cookieName } from '../lib/session'
import { createContainer } from 'unstated-next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useContainer = () => {
  const { asPath, push } = useRouter()

  const [authenticated, setAuthenticated] = useState()

  useEffect(() => {
    const cookie = Cookie.get(cookieName)

    setAuthenticated(Boolean(cookie))
  }, [asPath])

  const logout = async () => {
    Cookie.remove(cookieName)

    push('/start?logout=1')
  }

  return { authenticated, logout, setAuthenticated }
}

export const { Provider: AuthProvider, useContainer: useAuth } =
  createContainer(useContainer)
