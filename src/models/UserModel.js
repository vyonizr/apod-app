const { bcrypt } = require('../helpers')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    validate: [
      {
        validator: (password) => {
          const alphanumericRegex = /^[a-zA-Z0-9_]*$/
          return alphanumericRegex.test(password)
        },
        message: 'Your username must be alphanumeric'
      }
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: [
      {
        validator: (password) => {
          const upperCaseRegex = /^(?=.*[A-Z])/
          return upperCaseRegex.test(password)
        },
        message: 'Your password must contain at least 1 uppercase alphabetical character'
      },
      {
        validator: (password) => {
          const lowerCaseRegex = /^(?=.*[a-z])/
          return lowerCaseRegex.test(password)
        },
        message: 'Your password must contain at least 1 lowercase alphabetical character'
      },
      {
        validator: (password) => {
          const numberRegex = /^(?=.*[0-9])/
          return numberRegex.test(password)
        },
        message: 'Your password must contain at least 1 numeric character'
      }
    ]
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Picture'
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true })

UserSchema.pre('save', function(next) {
  const hashedPassword = bcrypt.hashSync(this.password)
  this.password = hashedPassword
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
