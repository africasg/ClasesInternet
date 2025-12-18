import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { CLOTHES_COLLECTION, USER_COLLECTION } from "../utils";
import { getRopitaPorID } from "./ropita";
import { ObjectId } from "mongodb";



export const createUser = async(email:string,password:string)=>{
    const db= getDB();
     const passEncripta = await bcrypt.hash(password,10);

    const result = await db.collection(USER_COLLECTION).insertOne({
        email,
        password: passEncripta,
        clothes:[]
        //Lo iniciamos con array vaacio ya que tenenos puesto quedebe devolver un array 100%
    });
    return result.insertedId.toString()
};

export const validateUser =async (email:string, password:string) =>{
    const db = getDB();
    const user = await db.collection(USER_COLLECTION).findOne({email});
    if(!user)return null;
    const comparamosContraseñas = await bcrypt.compare(password,user.password);
    if(!comparamosContraseñas)return null; 
    return user; 
}
export const buyRopita = async (idDeRopa:string, userId:string) => {
    const db = getDB();
    const ropitaAnadir = await getRopitaPorID(idDeRopa);
    if(!ropitaAnadir) throw new Error ("Esta ropa no existe");
    await db.collection(CLOTHES_COLLECTION).updateOne({_id:new ObjectId(userId)},{
        $addToSet:{clothes:idDeRopa}
    });
    const updatedUser = await db.collection(USER_COLLECTION).findOne({_id:new ObjectId(userId)})
    return updatedUser;
}

