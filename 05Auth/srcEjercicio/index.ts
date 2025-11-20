import { connectToMongoDb } from "./mongo";
import express from "express";
import rutasAuth from "./routes/auth"
import rutasProductos from "./routes/products"
import {Db, MongoClient} from "mongodb";


let client: MongoClient;
let db: Db;

connectToMongoDb();
const app = express();
app.use(express.json())

app.use("/api/auth", rutasAuth);
app.use("/api/products",rutasProductos);



app.listen(3000, ()=>{console.log("esto funciona y esta en el puerto 3000")})

