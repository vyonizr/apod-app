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
    const { username } = req.params
    const { id } = req.authenticatedUser
    const { targetUsername } = req.body

    try {
      if (targetUsername === username) {
        setError('Cannot send a friend request to oneself', 400)
      }
      else {
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
    const { username } = req.params
    const { id } =req.authenticatedUser

    try {
      const rejectedUserID = UserModel.findOne({ username }, '_id')
      await UserModel.findByIdAndUpdate(id, { $pull: { pendingFriends: rejectedUserID } }, { new: true })

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
    const { friendUsername } = req.params
    const { id } =req.authenticatedUser

    try {
      const acceptedUser = await UserModel.findOne({ username: friendUsername }, '_id')

      await UserModel.findByIdAndUpdate(id, { $addToSet: { friends: acceptedUser._id } }, { new: true })

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
    const { username } = req.body
    const { id } = req.authenticatedUser
    const loggedInUsername = req.authenticatedUser.username

    try {
      if (loggedInUsername === username) {
        setError('Cannot unfriend oneself', 400)
      }
      else {
        const removedUserID = UserModel.findOne({ username }, '_id')
        await UserModel.findByIdAndUpdate(id, { $pull: { friends: removedUserID } }, { new: true })
      }

      res.status(200).json({
        status: 'success',
        data: {}
      })
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
}

module.exports = UserController