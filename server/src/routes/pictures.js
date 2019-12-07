const router = require('express').Router()
const { PictureController } = require('../controllers/')
const { isAuthenticated } = require('../middlewares')

router.get('/', PictureController.getAPicture)
router.post('/', isAuthenticated, PictureController.addToFavorites)
router.delete('/:pictureID', isAuthenticated, PictureController.removeFromFavorites)

module.exports = router