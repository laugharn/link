const { withIronSession } = require('next-iron-session')

const authCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME
const userCookieName = process.env.NEXT_PUBLIC_USER_COOKIE_NAME

const withSession = (handler) => {
  const config = {
    password: [
      {
        id: 1,
        password: process.env.SECRET_COOKIE_PASSWORD_1,
      },
    ],
    cookieName: authCookieName,
    cookieOptions: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    },
  }

  return withIronSession(handler, config)
}

module.exports = {
  authCookieName,
  userCookieName,
  withSession,
}