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
  stuffs: ({map, stuffType, first, after}, req) => {
    let lastElementCursor
    let stuffsPromise

    if (map && stuffType) {
      stuffsPromise = Stuff.find()
        .where('map').equals(map)
        .where('stuffType').equals(stuffType)
    } else if (map && !stuffType) {
      stuffsPromise = Stuff.find()
        .where('map').equals(map)
    } else if (!map && stuffType) {
      stuffsPromise = Stuff.find()
        .where('stuffType').equals(stuffType)
    } else {
      stuffsPromise = Stuff.find()
    }

    return stuffsPromise
      // mongoose doc to Object with methods for vote and score fetching
      .then(docs => docs.map(doc => new StuffDTO(doc._id, doc.name, doc.map, doc.stuffType, doc.gifURL, req.userGoogleId)))

      // give rank as a cursor
      .then(docs => {
        return docs.map((doc, index) => {
          return {
            node: doc,
            cursor: index
          }
        })
      })

      // remove results before given cursor ($after)
      .then(docs => {
        if (after) {
          return docs.filter(doc => doc.cursor > after)
        }
        return docs
      })

      // keep the amount of result required ($first)
      .then(docs => {
        lastElementCursor = docs[docs.length - 1].cursor
        if (first) {
          if (after) {
            return docs.filter(doc => doc.cursor - after <= first)
          }
          return docs.filter(doc => doc.cursor < first)
        }
        return docs
      })

      // wrap results in StuffConnection
      .then(docs => {
        return {
          pageInfo: {
            endCursor: docs[docs.length - 1].cursor,
            hasNextPage: docs[docs.length - 1].cursor !== lastElementCursor
          },
          edges: docs
        }
      })
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
