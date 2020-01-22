const { PictureModel, UserModel } = require('../models')
const { fetchAPOD, getRandomDate } = require('../helpers')

class PictureController {
  static async getAPicture(req, res) {
    let { date } = req.query
    if (!date) {
      date = getRandomDate()
    }

    try {
      const { data } = await fetchAPOD(date)

      res.status(200).json({
        status: 'success',
        data
      })
    }
    catch (err) {
      const { data } = err.response
      if (data && data.code && data.msg) {
        res.status(data.code).json({
          status: 'error',
          message: data.msg
        })
      }
      else {
        res.status(500).end()
      }
    }
  }

  static async addToFavorites(req, res) {
    const { date } = req.body
    const { id } = res.locals.authenticatedUser

    try {
      const updatedPicture = await PictureModel.findOneAndUpdate( { date }, { $addToSet: { favoritedBy: id } }, { new: true })

      if (updatedPicture) {
        res.status(200).json({
          status: 'success',
          data: updatedPicture
        })
      }
      else {
        const { data } = await fetchAPOD(date)
        const createdPicture = await PictureModel.create(data)
        createdPicture.favoritedBy.push(id);
        await createdPicture.save()
        res.status(201).json({
          status: 'success',
          data: createdPicture
        })
      }
    }
    catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err
      })
    }
  }

  static async removeFromFavorites(req, res) {
    const { pictureID } = req.params
    const { id } = res.locals.authenticatedUser
    try {
      await UserModel.findByIdAndUpdate(id, {
        $pull: {
          favorites: pictureID
        }
      }, { new: true })
      res.status(204).send()
    }
    catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err
      })
    }
  }
}

module.exports = PictureController