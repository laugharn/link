export const getTimestamp = (value) => {
  const date = new Date(value)
  const hour = date.getHours()

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Nov',
    'Dec',
  ]

  return `${hour > 12 ? hour - 12 : hour}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')} ${hour > 12 ? 'PM' : 'AM'} · ${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`
}
