const isAuthenticated = require('./isAuthenticated')
const isSelfTargeting = require('./isSelfTargeting')
const isAlreadyAFriend = require('./isAlreadyAFriend')
const isOnPendingRequest = require('./isOnPendingRequest')

module.exports = {
  isAuthenticated,
  isSelfTargeting,
  isAlreadyAFriend,
  isOnPendingRequest
}