const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')
const mongoose = require('mongoose')
const graphQLSchema = require('./graphQLSchema')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const root = require('./graphQLEndpoints')

// Connect the DB
const dbUri = process.env.DB_URI
mongoose.connect(dbUri)

// Construct a schema, using GraphQL schema language
const schema = buildSchema(graphQLSchema)

const app = express()
app.use(cors())

app.use('/graphql', jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
  }),
  audience: process.env.GOOGLE_CLIENT_ID,
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
