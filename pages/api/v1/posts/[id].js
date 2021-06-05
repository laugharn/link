import { destroy } from '~/lib/post'
import { handler } from '~/lib/api'


handler.delete(async (req, res) => await destroy(req, res))

export default handler
