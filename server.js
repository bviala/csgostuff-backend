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
  stuffs: ({map, stuffType}, req) => {
    if (req.user) console.log('logged user: ' + req.user.sub)
    var stuffsPromise
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

    return stuffsPromise.then(docs => {
      return docs.map(doc => new StuffDTO(doc._id, doc.name, doc.map, doc.stuffType, doc.gifURL, req.ip))
    })
  },
  vote: ({stuffID, voteType}, req) => {
    var query = {
      stuffID: stuffID,
      voterIP: req.ip
    }
    Vote.findOneAndUpdate(query, {voteType: voteType}, {upsert: true}, function (err) {
      if (err) console.log(err)
    })
    return 'successfully voted'
  },
  removeVote: ({stuffID}, req) => {
    var query = {
      stuffID: stuffID,
      voterIP: req.ip
    }
    Vote.findOneAndRemove(query, function (err) {
      if (err) console.log(err)
    })
    return 'vote successfully removed'
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

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
