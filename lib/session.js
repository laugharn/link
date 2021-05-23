const { withIronSession } = require('next-iron-session')

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME

const withSession = (handler) => {
  const config = {
    password: [
      {
        id: 1,
        password: process.env.SECRET_COOKIE_PASSWORD_1,
      },
    ],
    cookieName,
    cookieOptions: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    },
  }

  return withIronSession(handler, config)
}

module.exports = {
  cookieName,
  withSession,
}