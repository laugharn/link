import connect from 'next-connect'
import { session } from './session'

export const handler = connect()
handler.use(session)