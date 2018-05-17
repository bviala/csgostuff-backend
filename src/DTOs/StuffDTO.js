var Vote = require('../models/vote')

class StuffDTO {
  constructor (id, name, map, stuffType, gifURL, score, reqUserGoogleId) {
    this.id = id
    this.name = name
    this.map = map
    this.stuffType = stuffType
    this.gifURL = gifURL
    this.score = score
    this.reqUserGoogleId = reqUserGoogleId
  }

  /* async score () {
    const votePos = await Vote.count({
      stuffID: this.id,
      voteType: 'UPVOTE'
    })
    const voteNeg = await Vote.count({
      stuffID: this.id,
      voteType: 'DOWNVOTE'
    })
    return votePos - voteNeg
  } */

  myVote () {
    const query = {
      stuffID: this.id,
      voterGoogleId: this.reqUserGoogleId
    }
    return Vote.findOne(query).then(doc => {
      if (doc) return doc.voteType
    })
  }
}

module.exports = StuffDTO
