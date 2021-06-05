import { handler } from '~/lib/api'
import { store } from '~/lib/pass'

handler.post(async (req, res) => await store(req, res))

export default handler
