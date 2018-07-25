const Stuff = require('./models/stuff')
const Vote = require('./models/vote')
const StuffDTO = require('./DTOs/StuffDTO')
const updateStuffScores = require('./updateStuffScores')

const gifURLValidator = /(^https:\/\/(zippy|fat|giant).gfycat.com\/.+\.(mp4|webm)$)|(^https:\/\/media.giphy.com\/media\/.+\/giphy.mp4$)/

const stuffsConnectionQuery = async ({map, stuffType, first, after}, req) => {
  const offset = after ? Number(after) + 1 : 0
  let hasNextPage = false

  let stuffsPromise = Stuff.find()
  if (map) stuffsPromise = stuffsPromise.where('map').equals(map)
  if (stuffType) stuffsPromise = stuffsPromise.where('stuffType').equals(stuffType)
  stuffsPromise = stuffsPromise.sort('-wilsonScore')
  if (after) stuffsPromise = stuffsPromise.skip(offset)
  if (first) stuffsPromise = stuffsPromise.limit(first + 1) // try to get one more of number asked to determine if there's a next page

  let docs = await stuffsPromise

  // detect if there is results after those requested
  if (first && docs.length > first) {
    docs.pop()
    hasNextPage = true
  }

  // mongoose doc to Object with methods for vote and score fetching
  docs = docs.map(doc => new StuffDTO(doc._id, doc.name, doc.map, doc.stuffType, doc.gifURL, doc.diffScore, req.userGoogleId))

  // give cursors
  docs = docs.map((doc, index) => {
    return {
      node: doc,
      cursor: index + offset
    }
  })

  // wrap results in StuffConnection
  return {
    pageInfo: {
      endCursor: docs.length > 0 ? docs[docs.length - 1].cursor : null,
      hasNextPage: hasNextPage
    },
    edges: docs
  }
}

const voteMutation = ({stuffID, voteType}, req) => {
  if (req.userGoogleId) {
    const query = {
      stuffID: stuffID,
      voterGoogleId: req.userGoogleId
    }
    Vote.findOneAndUpdate(query, {voteType: voteType}, {upsert: true})
      .then(() => updateStuffScores(stuffID))
    return 'Successfully voted'
  } else {
    throw new Error('Unauthorized')
  }
}

const removeVoteMutation = ({stuffID}, req) => {
  if (req.userGoogleId) {
    const query = {
      stuffID: stuffID,
      voterGoogleId: req.userGoogleId
    }
    Vote.findOneAndRemove(query)
      .then(() => updateStuffScores(stuffID))
    return 'Vote successfully removed'
  } else {
    return 'Unauthorized'
  }
}

const createStuffMutation = ({name, map, stuffType, gifURL}, req) => {
  if (!req.userGoogleId) throw new Error('Unauthorized')
  if (!gifURLValidator.test(gifURL)) throw new Error('Invalid GIF URL')
  const newStuff = new Stuff({
    name: name,
    map: map,
    stuffType: stuffType,
    gifURL: gifURL
  })
  newStuff.save()
  return 'Successfully created Stuff'
}

const removeStuffMutation = ({stuffID}, req) => {
  if (req.userGoogleId && req.userGoogleId === process.env.ADMIN_GOOGLE_ID) {
    Stuff.findByIdAndDelete(stuffID).exec()
    return 'Successfully removed Stuff'
  } else {
    throw new Error('Unauthorized')
  }
}

module.exports = {
  stuffsConnection: stuffsConnectionQuery,
  vote: voteMutation,
  removeVote: removeVoteMutation,
  createStuff: createStuffMutation,
  removeStuff: removeStuffMutation
}
