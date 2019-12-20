const { jwt } = require('../helpers')

module.exports = (req, res, next) => {
  const { authentication } = req.headers

  if (authentication) {
    const decodedToken = jwt.verify(authentication)
    res.locals.authenticatedUser = decodedToken
    next()
  }
  else {
    res.status(401).json({
      status: 'fail',
      message: 'You are not authenticated. Please login.'
    })
  }
}