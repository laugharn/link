import { destroy } from '~/lib/pass'
import { handler } from '~/lib/api'

handler.delete(async (req, res) => await destroy(req, res))

export default handler
