import { handler } from '~/lib/api'
import { show, update } from '~/lib/user'

handler.get(async (req, res) => await show(req, res))
handler.patch(async (req, res) => await update(req, res))

export default handler
