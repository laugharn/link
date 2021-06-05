import { handler } from '~/lib/api'
import { store } from '~/lib/post'

handler.post(async (req, res) => await store(req, res))

export default handler
