import { ApolloServer } from "apollo-server";
import { connectToMongoDb } from "./db/mongo"
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";

const start = async() =>{
    await connectToMongoDb();

    const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req,res}) => {
        return {req};
    }
    });
    await server.listen({port:4000}); 
    console.log("Funciona GraphQL")
};

start().catch((err=>console.error(err)));