const Stuff = require('./models/stuff')
const Vote = require('./models/vote')
const { score } = require('average-rating')

const updateStuffScores = async (id) => {
  const votePos = await Vote.count({
    stuffID: id,
    voteType: 'UPVOTE'
  })
  const voteNeg = await Vote.count({
    stuffID: id,
    voteType: 'DOWNVOTE'
  })
  console.log('votePos: ' + votePos)
  console.log('voteNeg: ' + voteNeg)
  await Stuff.updateOne({
    _id: id
  },
  {
    diffScore: votePos - voteNeg,
    wilsonScore: score(votePos, voteNeg)
  })
}

module.exports = updateStuffScores
