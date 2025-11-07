
import express from "express"; //esto hay que escribirlo a mano, el resto de imports van solos 
import rutillas from "./routes";
import { connectToMongoDb } from "./mongo";

connectToMongoDb(); //la conexión a Mongo va a tardar más ya que hay que llamar a un servidor externo, es una mala práctica pero todo el mujndo lo hace así
const app= express();
app.use(express.json());

app.use("/api/albums", rutillas);

app.listen(3000, ()=>(console.log("El API comenzó en el puerto 3000")));
