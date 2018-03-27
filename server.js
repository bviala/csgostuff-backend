var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mongoose = require('mongoose');
var Stuff = require('./models/stuff');

// Connect the DB
mongoose.connect('mongodb://localhost/csgostuff');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    enum StuffType{
        BOOST
        FLASH
        INCENDIARY
        SMOKE
    }
    enum Map{
        CACHE
        COBBLESTONE
        DUST2
        INFERNO
        MIRAGE
        NUKE
        OVERPASS
        TRAIN
    }
    type Query {
        stuffs: [Stuff]
    }
    type Stuff{
        id: ID
        name: String
        map: Map
        stuffType: StuffType
        author: String
        upvotes: Int
        downvotes: Int
        gifURL: String
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
    stuffs: () => {
        return Stuff.find();
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');