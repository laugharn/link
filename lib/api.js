import connect from 'next-connect'
import { session } from './session'

export const handler = connect({
  onError: (err, req, res) => {
    res.status(err.status ?? 500).end(err.message ?? 'Internal Server Error')
  },
})
handler.use(session)
