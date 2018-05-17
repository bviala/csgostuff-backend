var mongoose = require('mongoose')

var voteSchema = new mongoose.Schema({
  stuffID: mongoose.Schema.Types.ObjectId,
  voterGoogleId: String,
  voteType: { type: String, enum: ['UPVOTE', 'DOWNVOTE'] }
})

module.exports = mongoose.model('Vote', voteSchema)
