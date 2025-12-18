import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { CLOTHES_COLLECTION } from "../utils";


export const getRopita = async(page?:number,size?:number) =>{
    const db = getDB();
   page= page || 1; //atajo de código 
   size = size || 10; 
   return await db.collection(CLOTHES_COLLECTION).find().skip((page-1)*size).limit(size).toArray();

};

export const getRopitaPorID = async (id:string) =>{
    const db = getDB();
    return await db.collection(CLOTHES_COLLECTION).findOne({_id:new ObjectId(id)});
} 
export const createRopita = async (name:string, size:string, color: string, price:number)=>{
    const db= getDB();
    const result = await db.collection(CLOTHES_COLLECTION).insertOne({
        name,
        size,
        color, 
        price
    });
    const newClothing = await getRopitaPorID(result.insertedId.toString())
    return newClothing
}
export const getRopasFromIDs = async(ids: Array<string>)=>{
    const db= getDB();
    const idsParaMongo = ids.map(x=>new ObjectId(x));
    return db.collection(CLOTHES_COLLECTION).find({
        _id: {$in: idsParaMongo}
    }).toArray();
}