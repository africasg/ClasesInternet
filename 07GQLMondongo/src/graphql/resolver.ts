import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo"
import { ObjectId } from "mongodb";
const collectionV = "Videogames"
import { createUser,validateUser } from "../collections/users";
import { signToken } from "../auth";
// const colecionVideojuegos = ()=> get.DB().collection("videojuegos")
export const resolvers: IResolvers = {
    Query: {
        getVideoGames: async ()=> {
        const db =getDB(); 
        return db.collection(collectionV).find().toArray() //Aquí lo hemos hecho en cada sitio, pero es mejor hacerlo aquí *
    },
        getVideoGame: async (_,{_id}:{_id:string})=>{
        const db =getDB(); 
        return db.collection(collectionV).findOne({_id:new ObjectId(_id)});
    },
    me : async (__,_, {user})=>{//en el parentesis se pone (gql,argumentos,contexto); en la parte donde pone user, se puede poner ctx.user
     if(!user) return null;
     return {
        id:user._id.toString(),
        email:user.email
     }
    }

},

    Mutation: {
        addVideogame: async (_,  {name, releaseYear, platform}:{name:string, releaseYear:number,platform:string}) => { 
                const db= getDB();
                const result = await db.collection(collectionV).insertOne({
                    name,
                    releaseYear,
                    platform
                });
                return{
                    _id: result.insertedId,
                    name,
                    releaseYear,
                    platform
                }
            
        },
        register: async(_,{email,password}: {email:string, password:string})=>{
            const userId = await createUser(email,password)
            return signToken(userId)
        },
        login: async(_,{email,password}: {email:string, password:string})=>{
            const user = await validateUser(email,password)
            if(!user) throw new Error ("Esos credenciales no son correctos mi vida");
             return signToken(user._id.toString());
        }
    }
}