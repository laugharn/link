const getSuffix = (value) => (value > 1 ? 's' : '')

export const humanTimeDiff = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = Math.floor(seconds / 31536000)

  if (interval >= 1) {
    return `${interval} year${getSuffix(interval)} ago`
  }
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return `${interval} month${getSuffix(interval)} ago`
  }
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return `${interval} day${getSuffix(interval)} ago`
  }
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return `${interval} hour${getSuffix(interval)} ago`
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return `${interval} minute${getSuffix(interval)} ago`
  }

  return 'just now'
}

export const ttl = (seconds = 900, date = new Date()) => {
  date.setSeconds(date.getSeconds() + seconds)

  return date
}

export const validateTtl = (date) => {
  if (!date) {
    return false
  }

  const now = new Date().getTime()
  const expiry = new Date(date).getTime()

  return expiry > now
}
