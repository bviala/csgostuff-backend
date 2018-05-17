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
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[2] = new Stuff({
    name: 'mirage boost 2',
    map: 'MIRAGE',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[3] = new Stuff({
    name: 'mirage incendiary 1',
    map: 'MIRAGE',
    stuffType: 'INCENDIARY',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[4] = new Stuff({
    name: 'mirage incendiary 2',
    map: 'MIRAGE',
    stuffType: 'INCENDIARY',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[5] = new Stuff({
    name: 'mirage flash 1',
    map: 'MIRAGE',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[6] = new Stuff({
    name: 'mirage flash 2',
    map: 'MIRAGE',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })

  // OVERPASS
  stuffs[7] = new Stuff({
    name: 'overpass boost 1',
    map: 'OVERPASS',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[8] = new Stuff({
    name: 'overpass boost 2',
    map: 'OVERPASS',
    stuffType: 'BOOST',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[9] = new Stuff({
    name: 'overpass flash 1',
    map: 'OVERPASS',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[10] = new Stuff({
    name: 'overpass flash 2',
    map: 'OVERPASS',
    stuffType: 'FLASH',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[11] = new Stuff({
    name: 'overpass smoke 1',
    map: 'OVERPASS',
    stuffType: 'SMOKE',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })
  stuffs[12] = new Stuff({
    name: 'overpass smoke 2',
    map: 'OVERPASS',
    stuffType: 'SMOKE',
    gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
  })

  await Promise.all(stuffs.map(stuff => stuff.save()))
})
