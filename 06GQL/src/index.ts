import { ApolloServer } from "apollo-server"; //npm install apollo (hacer con el ejecutable)
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";



const server = new ApolloServer({typeDefs,resolvers})

server.listen({ port: 4000 }).then(()=>{
    console.log("gql funcionando en el puerto 4000");
})