var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

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
        TRAIN
    }
    type Query {
        stuff: Stuff
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

class Stuff{
    constructor(id, name, map, stuffType, author, upvotes, downvotes, gifURL){
        this.id = id;
        this.name = name;
        this.map = map;
        this.stuffType = stuffType;
        this.author = author;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.gifURL = gifURL;
    }
}

// The root provides a resolver function for each API endpoint
var root = {
    stuff: () => {
        return new Stuff('1', 'mid to B smoke', 'DUST2', 'FLASH', 'Baptiste', 190, 32, 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif');
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