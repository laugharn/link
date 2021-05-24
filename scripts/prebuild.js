const fetch = require('node-fetch')
const fs = require('fs')
const { kebabCase } = require('lodash')

const {
  CI,
  DIGITALOCEAN_DATABASE_HOST,
  DIGITALOCEAN_DATABASE_ID,
  DIGITALOCEAN_DATABASE_USER,
  DIGITALOCEAN_DATABASE_PASSWORD,
  DIGITALOCEAN_DATABASE_PORT,
  DIGITALOCEAN_TOKEN,
  VERCEL_GIT_COMMIT_REF,
} = process.env

console.log(process.env)

if (!CI) {
  console.log('Running outside of CI, this is a no-op.')
  return true
}

const Authorization = `Bearer ${DIGITALOCEAN_TOKEN}`
const name = `links_${kebabCase(VERCEL_GIT_COMMIT_REF)}`

const init = async () => {
  const response = await fetch(
    `https://api.digitalocean.com/v2/databases/${DIGITALOCEAN_DATABASE_ID}/dbs`,
    {
      body: JSON.stringify({ name }),
      headers: {
        Authorization,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  ).then(async (r) => {
    return await r.json()
  })

  if (response.message && response.message !== 'database name is not available') {
    throw new Error(response.message)
  }

  fs.writeFileSync(
    `${process.cwd()}/prisma/.env`,
    `DATABASE_URL="postgresql://${DIGITALOCEAN_DATABASE_USER}:${DIGITALOCEAN_DATABASE_PASSWORD}@${DIGITALOCEAN_DATABASE_HOST}:${DIGITALOCEAN_DATABASE_PORT}/${name}"`,
    'utf-8',
  )

  return true
}

init().catch((error) => {
  throw error
})