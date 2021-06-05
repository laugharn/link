import connect from 'next-connect'
import { session } from './session'

export const handler = connect({
  onError: (err, req, res) => {
    console.log(err)
    res.status(400).end(err.toString())
  },
})
handler.use(session)
