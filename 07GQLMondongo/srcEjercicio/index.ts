import { ApolloServer } from "apollo-server";
import { connectToMongoDb } from "./db/mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./auth";






const start = async() => {
    await connectToMongoDb();

    const server = new ApolloServer({
    typeDefs, //schema
    resolvers,
    context: async ({req}) =>{
        const token = req.headers.authorization || "";
        const user = token ? await getUserFromToken(token as string):null;
        return {user};

    },
});
await server.listen({port:4000})
console.log("gql funcionando aaa")
}

start().catch(err=>console.error(err))
