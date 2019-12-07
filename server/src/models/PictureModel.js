const mongoose = require('mongoose')

const PictureSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  explanation: {
    type: String,
  },
  hdurl: {
    type: String,
  },
  media_type: {
    type: String,
  },
  service_version: {
    type: String,
  },
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true })

const PictureModel = mongoose.model('Picture', PictureSchema)

module.exports = PictureModel