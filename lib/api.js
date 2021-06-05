import connect from 'next-connect'
import { session } from './session'

export const handler = connect({
  onError: (err, req, res) => {
    res.status(err.status).end(err.message)
  },
})
handler.use(session)
