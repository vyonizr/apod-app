const setError = (message, code, name = 'CustomError') => {
  const err = new Error(message)
  err.statusCode = code
  err.name = name

  throw err
}

module.exports = setError