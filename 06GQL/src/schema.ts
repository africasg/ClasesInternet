import { gql } from 'apollo-server';

// getAlbums: [Albums!]!, //el de fuera(tiene que devoler un array),opcion1 el de dentro tiene que ser de albums opcion2-> el tipo es complejo
export const typeDefs = gql`

    type Album{
        id: ID!,
        title: String,
        artist: String,
        releaseDate: String,
        format: String
    }


    type Query {
       getAlbums:[Album]
        getAlbum(id: ID!): Album
    }

    type Mutation {
        addAlbum(title: String!, artist: String!, releaseDate: String!, format:String): Album!
    }

`;