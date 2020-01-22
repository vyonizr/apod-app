const jwt = require("jsonwebtoken")

module.exports = {
  sign: (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' })
    return token
  },
  verify: (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    return decodedToken
  }
}