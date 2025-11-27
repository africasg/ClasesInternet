import { IResolvers } from "@graphql-tools/utils"
import { getDB } from "../db/mongo"
import { ObjectId } from "mongodb";
const collectionV = "Videogames"

// const coleccionVideojuegos = ()=> get.DB().collection("videojuegos")
export const resolvers: IResolvers = {
    Query: {
        getVideoGames: async ()=> {
        const db =getDB(); 
        return db.collection(collectionV).find().toArray() //Aquí lo hemos hecho en cada sitio, pero es mejor hacerlo aquí *
    },
        getVideoGame: async (_,{_id}:{_id:string})=>{
        const db =getDB(); 
        return db.collection(collectionV).findOne({_id:new ObjectId(_id)});
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
            
        }
    }
}