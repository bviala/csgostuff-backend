const mongoose = require('mongoose')

const stuffSchema = mongoose.Schema({
  name: String,
  map: { type: String,
    enum: [
      'CACHE',
      'COBBLESTONE',
      'DUST2',
      'INFERNO',
      'MIRAGE',
      'NUKE',
      'OVERPASS',
      'TRAIN'
    ]},
  stuffType: {
    type: String,
    enum: [
      'BOOST',
      'FLASH',
      'INCENDIARY',
      'SMOKE'
    ]},
  gifURL: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  diffScore: {
    type: Number,
    default: 0
  },
  wilsonScore: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Stuff', stuffSchema)
