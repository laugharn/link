import { authCookieName } from '../lib/session'
import Cookie from 'js-cookie'
import { createContainer } from 'unstated-next'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useContainer = () => {
  const { asPath, push } = useRouter()

  const [authenticated, setAuthenticated] = useState()
  const [user, setUser] = useState({})

  useEffect(() => {
    const auth = Boolean(Cookie.get(authCookieName))

    if (auth) {
      setAuthenticated(true)
    } else {
      setUser({})
      setAuthenticated(false)
    }
  }, [asPath])

  useEffect(() => {
    if (authenticated) {
      fetch('/api/v1/user').then(async (response) => {
        const data = await response.json()
  
        setUser(pick(data.user, ['email', 'id', 'name']))
      })
    } else {
      setUser({})
    }
  }, [asPath, authenticated])

  const login = async (data) => {
    const userData = pick(data, ['email', 'id', 'name'])

    setAuthenticated(true)
    setUser(userData)
  }

  const logout = async () => {
    setAuthenticated(false)
    setUser({})

    Cookie.remove(authCookieName)

    push('/start?logout=1')
  }

  return { authenticated, login, logout, setAuthenticated, user }
}

export const { Provider: AuthProvider, useContainer: useAuth } =
  createContainer(useContainer)
