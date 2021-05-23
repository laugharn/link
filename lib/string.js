const random = (length = 32) =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

const randomNumbers = (length = 32) => {
  return [...Array(length)]
    .map(() => (~~(Math.random() * 10)).toString(10))
    .join('')
}

module.exports = {
  random,
  randomNumbers,
}
