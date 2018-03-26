var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Query {
        stuff: Stuff
    }
    type Stuff{
        id: ID!
        name: String!
        gifURL: String!
        author: String
    }
`);

class Stuff{
    constructor(id, name, gifURL, author){
        this.id = id;
        this.name = name;
        this.gifURL = gifURL;
        this.author = author;
    }
}

// The root provides a resolver function for each API endpoint
var root = {
    stuff: () => {
        return new Stuff('1', 'mid to B smoke', 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif', 'Baptiste');
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