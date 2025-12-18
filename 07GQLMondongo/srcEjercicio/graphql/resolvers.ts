
import { IResolvers } from "@graphql-tools/utils"
import { buyRopita, createUser, validateUser } from "../collections/users"
import { signToken } from "../auth"
import { createRopita, getRopasFromIDs, getRopita, getRopitaPorID } from "../collections/ropita"
import { getDB } from "../db/mongo"



export const resolvers:IResolvers={
    Query:{
        clothes: async (_, { page, size }) => {
            return await getRopita(page, size);
        },
        clothing: async (_, { id }) => {
            return await getRopitaPorID(id);
        },
        me: async (_, __, {user}) => {
            if(!user) return null;
            return {
                _id: user._id.toString(),
                ...user
            }
        }
    },
    User:{
        clothes: async(parent) =>{
            return await getRopasFromIDs(parent.clothes)
        }
    },
    Mutation:{
        register: async(_,{email,password})=>{
           const idDeClienteCreado =  await createUser(email,password)   
           return signToken(idDeClienteCreado);
        },
        login: async(_,{email,password})=>{
            const user = await validateUser(email,password);
            if(!user) throw new Error("Bad credentials");
            return signToken(user._id.toString());
            
        },
        addClothing: async(_,{name,size,color,price},{user})=>{
            if(!user) throw new Error ("Tienes que estar logada")
            const result = await createRopita(name,size,color,price);
            return result;
        },
        buyClothing : async(_, {clothingId}, {user})=>{
            if(!user) throw new Error ("Tienes que estar logada")
                return await buyRopita(clothingId,user._id);
        }


    }
}