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
          stuffs(map: Map, stuffType: StuffType): [Stuff]
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
          score: Float
          myVote: VoteType
          gifURL: String
      }
  `

module.exports = schema
