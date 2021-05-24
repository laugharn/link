import mailgun from 'mailgun-js'

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

export const handlePass = async (code, email, headers) => {
  await mg.messages().send({
    from: `Links <postmaster@sandboxc3b01bf9332c4e7db6b57d892bdffc4f.mailgun.org>`,
    to: email,
    subject: `This is your Links pass code`,
    text: `Hello. Your pass code is:\n\n${code}\n\nGo to ${
      headers['x-forwarded-proto'] ?? 'http'
    }://${
      headers['x-forwarded-host'] ?? 'localhost:3000'
    }/start to use it. It's only valid for 15 minutes, so use it quickly! Thank you for using Links.`,
  })
}