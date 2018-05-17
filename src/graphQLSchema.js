var schema =
  `
      enum VoteType{
          UPVOTE
          DOWNVOTE
      }
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
          stuffsConnection(map: Map, stuffType: StuffType, first: Int, after: String): StuffConnection
      }
      type Mutation{
          vote(stuffID: ID!, voteType: VoteType!): String
          removeVote(stuffID: ID!): String
      }
      type Stuff{
          id: ID
          name: String
          map: Map
          stuffType: StuffType
          score: Int
          myVote: VoteType
          gifURL: String
      }
      type StuffEdge{
          cursor: String!
          node: Stuff!
      }
      type StuffConnection{
          pageInfo: PageInfo!
          edges: [StuffEdge]
      }
      type PageInfo{
          endCursor: String
          hasNextPage: Boolean!
      }


  `

module.exports = schema
