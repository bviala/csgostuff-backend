const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')
const mongoose = require('mongoose')
const Stuff = require('./models/stuff')
const Vote = require('./models/vote')
const StuffDTO = require('./DTOs/StuffDTO')
const graphQLSchema = require('./graphQLSchema')

const { GSI_CLIENT_ID } = require('./secrets')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const updateStuffScores = require('./updateStuffScores')

// Connect the DB
mongoose.connect('mongodb://localhost/csgostuff')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(graphQLSchema)

// The root provides a resolver function for each API endpoint
const root = {
  stuffsConnection: async ({map, stuffType, first, after}, req) => {
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
  },
  vote: ({stuffID, voteType}, req) => {
    if (req.userGoogleId) {
      const query = {
        stuffID: stuffID,
        voterGoogleId: req.userGoogleId
      }
      Vote.findOneAndUpdate(query, {voteType: voteType}, {upsert: true})
        .then(() => updateStuffScores(stuffID))
      return 'Successfully voted'
    } else {
      return 'Unauthorized'
    }
  },
  removeVote: ({stuffID}, req) => {
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
}

const app = express()
app.use(cors())

app.use('/graphql', jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
  }),
  audience: GSI_CLIENT_ID,
  issuer: 'accounts.google.com',
  credentialsRequired: false
}))
app.use((err, req, res, next) => {
  console.log('error: ' + err)
  next()
})
app.use((req, res, next) => {
  if (req.user) {
    req.userGoogleId = req.user.sub
    console.log('authenticated request (' + req.userGoogleId + ')')
  } else {
    console.log('unauthenticated request')
  }
  next()
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
