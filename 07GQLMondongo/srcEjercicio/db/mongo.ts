import {Db, MongoClient} from "mongodb";
import dotenv from "dotenv"; //*
import { dbName } from "../utils";

dotenv.config(); //inicialización HAY QUE IMPORTARLO (*)

let client : MongoClient
let db : Db

export const connectToMongoDb = async (): Promise<void>=>{
    try{
        const urlMongo = process.env.MONGO_URL;
        //hacer lo de la url en el .env
        if(!urlMongo) throw new Error ("No has metido la URL bobaina")
        client = new MongoClient(urlMongo);
        await client.connect(); // si da cualquier error irña al catch directamente
        db = client.db(dbName);
            console.log("Conectado a Mongo my g");


    } catch(error){
        console.error("Error al conectar a Mongo",error);
        process.exit(1); //mata el proceso y que ese hilo deje de ejecutar
    }
  
} 
export const getDB=(): Db => db; //no acceder a esto antes de haberte conectado