var Vote = require('../models/vote')

class StuffDTO {
  constructor (id, name, map, stuffType, gifURL, reqUserGoogleId) {
    this.id = id
    this.name = name
    this.map = map
    this.stuffType = stuffType
    this.gifURL = gifURL
    this.reqUserGoogleId = reqUserGoogleId
  }

  score () {
    return Vote.count({
      stuffID: this.id,
      voteType: 'UPVOTE'
    })
  }

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
