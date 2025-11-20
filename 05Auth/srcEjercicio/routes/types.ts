import { ObjectId } from "mongodb";

export type Users = {
    email: string,
    _id?: ObjectId,
    username: string,
    password: string //hash bcrypt
};
export type Product = {
    _id?: ObjectId,
    idCreatorUser: ObjectId, 
    idsBuyers: ObjectId[]
    name: string, 
    description: string,
};
export type JwtPayload = {
    id: string,
    email:string
}
