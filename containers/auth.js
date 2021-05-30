import { authCookieName, userCookieName } from '../lib/session'
import Cookie from 'js-cookie'
import { createContainer } from 'unstated-next'
import { isFinite, pick } from 'lodash'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useContainer = () => {
  const { asPath, push } = useRouter()

  const [authenticated, setAuthenticated] = useState()
  const [user, setUser] = useState({})

  useEffect(() => {
    const auth = Boolean(Cookie.get(authCookieName))

    if (auth) {
      const data = Cookie.getJSON(userCookieName)

      setUser(data)
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }, [asPath])

  const login = async (data) => {
    const userData = pick(data, ['email', 'id', 'name'])

    setAuthenticated(true)
    setUser(userData)

    Cookie.set(userCookieName, userData)
  }

  const logout = async () => {
    setAuthenticated(false)
    setUser({})

    Cookie.remove(authCookieName)
    Cookie.remove(userCookieName)

    push('/start?logout=1')
  }

  return { authenticated, login, logout, setAuthenticated, user }
}

export const { Provider: AuthProvider, useContainer: useAuth } =
  createContainer(useContainer)
