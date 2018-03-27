var mongoose = require('mongoose');

var stuffSchema = mongoose.Schema({
    name: String,
    map: { type: String, enum: [
        'CACHE',
        'COBBLESTONE',
        'DUST2',
        'INFERNO',
        'MIRAGE',
        'NUKE',
        'OVERPASS',
        'TRAIN',
    ]},
    stuffType: {type: String, enum: [
        'BOOST',
        'FLASH',
        'INCENDIARY',
        'SMOKE'
    ]},
    author: String,
    upvotes: Number,
    downvotes: Number,
    gifURL: String
});

module.exports = mongoose.model('Stuff', stuffSchema);