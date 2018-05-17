var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var cors = require('cors')
var mongoose = require('mongoose')
var Stuff = require('./models/stuff')
var Vote = require('./models/vote')
var StuffDTO = require('./DTOs/StuffDTO')
var graphQLSchema = require('./graphQLSchema')

var { GSI_CLIENT_ID } = require('./secrets')
var jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// Connect the DB
mongoose.connect('mongodb://localhost/csgostuff')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(graphQLSchema)

// The root provides a resolver function for each API endpoint
var root = {
  stuffsConnection: async ({map, stuffType, first, after}, req) => {
    let lastResultCursor

    let stuffsPromise = Stuff.find()
    if (map) stuffsPromise = stuffsPromise.where('map').equals(map)
    if (stuffType) stuffsPromise = stuffsPromise.where('stuffType').equals(stuffType)

    let docs = await stuffsPromise

    // mongoose doc to Object with methods for vote and score fetching
    docs = docs.map(doc => new StuffDTO(doc._id, doc.name, doc.map, doc.stuffType, doc.gifURL, req.userGoogleId))

    // give rank as a cursor
    docs = docs.map((doc, index) => {
      return {
        node: doc,
        cursor: index
      }
    })

    // get the last result cursor
    if (docs.length > 0) lastResultCursor = docs[docs.length - 1].cursor

    // remove results before given cursor ($after)
    if (after) {
      docs = docs.filter(doc => doc.cursor > after)
    }

    // keep the amount of result required ($first)
    if (first) {
      if (after) {
        docs = docs.filter(doc => doc.cursor - after <= first)
      } else {
        docs.filter(doc => doc.cursor < first)
      }
    }

    // wrap results in StuffConnection
    return {
      pageInfo: {
        endCursor: docs.length > 0 ? docs[docs.length - 1].cursor : null,
        hasNextPage: docs.length > 0 ? docs[docs.length - 1].cursor !== lastResultCursor : false
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
      Vote.findOneAndUpdate(query, {voteType: voteType}, {upsert: true}, err => {
        if (err) console.error(err)
      })
      return 'successfully voted'
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
      Vote.findOneAndRemove(query, err => {
        if (err) console.log(err)
      })
      return 'vote successfully removed'
    } else {
      return 'Unauthorized'
    }
  }
}

var app = express()
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
