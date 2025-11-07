
import express from "express"; 
import rutillas from "./routes";
import { connectToMongoDb } from "./mongo";

connectToMongoDb(); 
const app= express();
app.use(express.json());

app.use("/api/albums", rutillas);

app.listen(3000, ()=>(console.log("El API comenzó en el puerto 3000")));
