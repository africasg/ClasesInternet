import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo"
import { ObjectId } from "mongodb";
const collectionV = "Videogames";
const collection_users = "users";
import { createUser,validateUser } from "../collections/users";
import { signToken } from "../auth";
import { UserVideoGame } from "../types/UserVideoGame";
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
        email:user.email,
        listOfMyGames: user.listOfMyGames || [],
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
        },
         addVideogameToMyList: async (_,{VideoGameID}:{VideoGameID:string},{user}) =>{
            if(!user) throw new Error ("Logueate amiga <3");
            const db= getDB();
        
                const videogameToAdd = await db.collection(collectionV).findOne({_id: new ObjectId(VideoGameID)});
              //  console.log(videogameToAdd)
                if (!videogameToAdd) throw new Error("Te has marcado un GTAVI (no existe)");
            await db.collection(collection_users).updateOne(
        { _id: new ObjectId(user._id) },
        { $addToSet: { listOfMyGames: VideoGameID }}
      );
       const updateUser = await db.collection(collection_users).findOne({
        _id: new ObjectId(user._id),
      });
      console.log("User del monog", updateUser);
      if(!updateUser) throw new Error ("No existes ")
        return {
            id:updateUser._id.toString(),
            ...updateUser
        }
    }
},

User:{
    listOfMyGames : async (parent: UserVideoGame) => {
            const db = getDB();
            const listOfVideogameIDs = parent.listOfMyGames as Array<string> || [];
            const objectsID = listOfVideogameIDs.map((id)=> new ObjectId(id))
            return db.collection(collectionV).find({_id:{ $in: objectsID}}).toArray();
        }
    }
}
