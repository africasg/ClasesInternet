import {gql} from "apollo-server"

export const typeDefs = gql`

    type VideoGame{
        _id: ID!,
        name: String!,
        platform: String,
        releaseYear: Int
    }


    type Query {
       getVideoGames:[VideoGame!]!,
        getVideoGame(_id: ID!): VideoGame
    }

    type Mutation {
        addVideogame(name: String!, platform: String!, releaseYear: Int!): VideoGame!
    }

`;