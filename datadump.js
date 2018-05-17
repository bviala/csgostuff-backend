const Stuff = require('./src/models/stuff')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/csgostuff')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  // we're connected!
  await Stuff.remove()
  console.log('Stuff collection removed')

  // data creation
  let stuffs = []

  // MIRAGE
  stuffs[1] = new Stuff({
    name: 'mirage boost 1',
    map: 'MIRAGE',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/3oeHLrjZGBgnPx5VII/giphy.mp4'
  })
  stuffs[2] = new Stuff({
    name: 'mirage boost 2',
    map: 'MIRAGE',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/76gdmaAuiTzEs/giphy.mp4'
  })
  stuffs[3] = new Stuff({
    name: 'mirage incendiary 1',
    map: 'MIRAGE',
    stuffType: 'INCENDIARY',
    gifURL: 'https://media.giphy.com/media/lcySndwSDLxC4eOU86/giphy.mp4'
  })
  stuffs[4] = new Stuff({
    name: 'mirage incendiary 2',
    map: 'MIRAGE',
    stuffType: 'INCENDIARY',
    gifURL: 'https://media.giphy.com/media/xNrM4cGJ8u3ao/giphy.mp4'
  })
  stuffs[5] = new Stuff({
    name: 'mirage flash 1',
    map: 'MIRAGE',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/P1SDU8YUuQb2o/giphy.mp4'
  })
  stuffs[6] = new Stuff({
    name: 'mirage flash 2',
    map: 'MIRAGE',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/3oz8xAiHifpLt6NpO8/giphy.mp4'
  })

  // OVERPASS
  stuffs[7] = new Stuff({
    name: 'overpass boost 1',
    map: 'OVERPASS',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/EnVTvGAQUlou4/giphy.mp4'
  })
  stuffs[8] = new Stuff({
    name: 'overpass boost 2',
    map: 'OVERPASS',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/iwD9JZ7N8hEyc/giphy.mp4'
  })
  stuffs[9] = new Stuff({
    name: 'overpass flash 1',
    map: 'OVERPASS',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/s0k30jjI04THq/giphy.mp4'
  })
  stuffs[10] = new Stuff({
    name: 'overpass flash 2',
    map: 'OVERPASS',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/Lr2YomhIBU8LK/giphy.mp4'
  })
  stuffs[11] = new Stuff({
    name: 'overpass smoke 1',
    map: 'OVERPASS',
    stuffType: 'SMOKE',
    gifURL: 'https://media.giphy.com/media/26gssIytJvy1b1THO/giphy.mp4'
  })
  stuffs[12] = new Stuff({
    name: 'overpass smoke 2',
    map: 'OVERPASS',
    stuffType: 'SMOKE',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.mp4'
  })

  await Promise.all(stuffs.map(stuff => stuff.save()))
})
