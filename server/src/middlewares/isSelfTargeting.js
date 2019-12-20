module.exports = (req, res, next) => {
  const { username } = res.locals.authenticatedUser
  const { targetUsername } = req.body

  if (!username || !targetUsername || targetUsername === username) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid mandatory parameter(s)'
    })
  }
  else {
    next()
  }
}