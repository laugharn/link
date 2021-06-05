import { authCookieName } from '../lib/session'
import Cookie from 'js-cookie'
import { createContainer } from 'unstated-next'
import localforage from 'localforage'
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
      localforage.getItem('user').then((data) => {
        setAuthenticated(true)

        if (data) {
          setUser(data)
        }
      })
    } else {
      localforage.removeItem('user').then(() => {
        setUser({})
        setAuthenticated(false)
      })
    }
  }, [asPath])

  useEffect(() => {
    if (authenticated) {
      fetch('/api/v1/user').then(async (response) => {
        const data = await response.json()
        const userData = pick(data.user, ['email', 'id', 'name'])

        setUser(userData)

        await localforage.setItem('user', userData)
      })
    } else {
      setUser({})
    }
  }, [asPath, authenticated])

  const login = async (data) => {
    const userData = pick(data, ['email', 'id', 'name'])

    localforage.setItem('user', userData).then(() => {
      setAuthenticated(true)
      setUser(userData)
    })
  }

  const logout = async () => {
    localforage.removeItem('user').then(() => {
      setAuthenticated(false)
      setUser({})

      Cookie.remove(authCookieName)

      push('/start?logout=1')
    })
  }

  return { authenticated, login, logout, setAuthenticated, user }
}

export const { Provider: AuthProvider, useContainer: useAuth } =
  createContainer(useContainer)
