import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { getDB } from "./db/mongo";
import { USER_COLLECTION } from "./utils";
import { ObjectId } from "mongodb";

dotenv.config()

type TokenPayload ={
    userId:string
}
 const SUPER_SECRET = process.env.SUPER_SECRET

export const signToken = (userId: string) =>{
   
    if(!SUPER_SECRET) throw new Error("No creaste el secreto")
       return jwt.sign({userId}, SUPER_SECRET!,{ expiresIn: "1h"})
};
export const verifyToken = (token:string) : TokenPayload|null =>{
    try {
        if(!SUPER_SECRET) throw new Error ("No secret to decode token")
           return jwt.verify(token,SUPER_SECRET) as TokenPayload;   
    } catch (error) {
        return null;
    }
};
export const getUserFromToken = async (token:string) =>{
 const payload = verifyToken(token);
 if(!payload) return null;
 const db = getDB();
 return await db.collection(USER_COLLECTION).findOne({
    _id: new ObjectId(payload.userId)
 })

}