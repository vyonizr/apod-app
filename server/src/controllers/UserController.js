const { UserModel } = require('../models')
const { bcrypt, jwt, setError } = require('../helpers')

class UserController {
  static async getAUser(req, res) {
    const { username } = req.params

    try {
      const foundUser = await UserModel.findOne({ username }, '_id username favorites friends')

      if (!foundUser) {
        setError('Username not found', 404)
      }
      else {
        res.status(200).json({
          status: 'success',
          data: foundUser
        })
      }
    }
    catch (err) {
      if (err.name === 'CustomError') {
        res.status(err.statusCode).json({
          status: 'fail',
          message: err.message
        })
      }
      else {
        res.status(500).json(err)
      }
    }
  }

  static async userLogin(req, res) {
    const { username, password } = req.body

    try {
      const foundUser = await UserModel.findOne({ username })

      if (!foundUser) {
        setError('Wrong username or password', 401)
      }
      else if (bcrypt.compareSync(password, foundUser.password)) {
        const token = jwt.sign({
          id: foundUser._id,
          username: foundUser.username,
        })

        res.status(200).json({
          status: 'success',
          data: {
            token,
            id: foundUser._id,
            username: foundUser.username
          }
        })
      }
      else {
        setError('Wrong username or password', 401)
      }
    } catch (err) {
      if (err.name === 'CustomError') {
        res.status(err.statusCode).json({
          status: 'fail',
          message: err.message
        })
      }
      else {
        res.status(500).json(err)
      }
    }
  }

  static async userRegister(req, res) {
    const { username, password } = req.body

    try {
      const foundUser = await UserModel.findOne({ username })

      if (foundUser) {
        setError('Username is already exist', 409)
      }
      else {
        const createdUser = await UserModel.create({ username, password })

        const token = jwt.sign({
          id: createdUser._id,
          username: createdUser.username
        })

        res.status(201).json({
          status: 'success',
          data: {
            username: createdUser.username,
            token
          }
        })
      }
    }
    catch (err) {
      switch(err.name) {
        case 'ValidationError': {
          const errors = []

          for (let errorField in err.errors) {
            errors.push(err.errors[errorField].message)
          }

          res.status(400).json({
            status: 'fail',
            message: { errors }
          })
        } break;

        case 'CustomError': {
          res.status(err.statusCode).json({
            status: 'fail',
            message: err.message
          })
        } break;

        default: {
          res.status(500).json(err)
        }
      }
    }
  }

  static async addAFriend(req, res) {
    const { id } = res.locals.authenticatedUser
    const { targetUsername } = req.body

    try {
      const updatedUser = await UserModel.findOneAndUpdate({ username: targetUsername }, { $addToSet: { pendingFriends: id } }, { new: true })

      if (updatedUser) {
        res.status(200).json({
          status: 'success',
          data: {}
        })
      }
      else {
        setError('The requested username was not found', 404)
      }
    }
    catch (err) {
      if (err.name = 'CustomError') {
        res.status(err.statusCode).json({
          status: 'fail',
          message: err.message
        })
      }
      else {
        res.status(500).json({
          status: 'fail',
          message: err
        })
      }
    }
  }

  static async rejectAFriendRequest(req, res) {
    const { id } = res.locals.authenticatedUser
    const { targetUserID } = res.locals

    try {
      await UserModel.findByIdAndUpdate(targetUserID, { $pull: { pendingFriends: id } })

      res.status(200).json({
        status: 'success',
        data: {}
      })
    }
    catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err
      })
    }
  }

  static async acceptAFriendRequest(req, res) {
    const { id } = res.locals.authenticatedUser
    const { targetUserID } = res.locals

    try {
      await UserModel.findByIdAndUpdate(targetUserID, { $pull: { pendingFriends: id }, $push: { friends: id } })
      await UserModel.findByIdAndUpdate(id, { $addToSet: { friends: targetUserID } })

      res.status(200).json({
        status: 'success',
        data: {}
      })
    }
    catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err
      })
    }
  }

  static async removeAFriend(req, res) {
    const { targetUsername } = req.body
    const { id } = res.locals.authenticatedUser

    try {
      const removedUser = UserModel.find({ targetUsername }, '_id ')

      await UserModel.findByIdAndUpdate(removedUser._id, { $pull: { friends: id } })
      await UserModel.findByIdAndUpdate(id, { $pull: { friends: removedUser._id } })

      res.status(200).json({
        status: 'success',
        data: {}
      })
    }
    catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err
      })
    }
  }
}

module.exports = UserController