const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10);

module.exports = {
  hashSync: (rawPassword) => {
    const hash = bcrypt.hashSync(rawPassword, salt);

    return hash
  },
  compareSync: (inputPassword, passwordFromDatabase) => {
    return bcrypt.compareSync(inputPassword, passwordFromDatabase)
  }
}