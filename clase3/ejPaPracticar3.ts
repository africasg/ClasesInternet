import express from "express";
import cors from "cors";


const app = express()
const port = 3000;



app.use(cors()) //preguntar para que sirve el cors
app.use(express.json())

type Persona = {
    id:number,
    name:string,
    lastName:string,
}
type Error = {
    error: string,
    body_error: Persona
} //se crea un tipo error para que a la hora de devolver un error, también devuelve el json que has introducido

let miArray : Persona[] = [{id:1, name: "juan", lastName: "jose"}, {id:2, name: "jose", lastName: "perez"}, {id:3, name: "jose", lastName: "perez"}]

app.get("/personas", (req, res) =>{

    res.json(miArray);
})


app.get("/", (req, res) =>{
    res.status(200).send("Estas conectado chaval");

})

app.get("/personas/:id", (req, res) =>{
    const id = Number(req.params.id);

    const resultado = miArray.filter((n) => n.id === id)

    resultado ? res.json(resultado) : res.status(404).send("no hay ninguna persona con ese id")

})


app.post("/personas", (req, res) =>{
    const ultimoId = miArray.at(-1)?.id; //forzarlo a que siempre va a ser un id 
    const nuevoId = ultimoId ? ultimoId +1 : 0;
    const nuevoNombre = req.body.name;
    const nuevolastName = req.body.lastName;

    const nuevaPersona : Persona = {
        id: nuevoId,
        name: nuevoNombre,
        lastName: nuevolastName
    }
    if(typeof(nuevoNombre) === "string" && typeof(nuevolastName) === "string"){
        miArray.push(nuevaPersona);
        res.status(201).json(nuevaPersona);
    }
    else{
        const miErrorcito = {
            error: "La has cagado chaval, porque uno de los campos de nombro o apellido no es un string o no esta rellenado",
            body_error: nuevaPersona
        }
        res.status(404).json(nuevaPersona) // crear tipo para representar el error correctamente
    }

})


app.put("/persona/:id", (req,res)=>{
    const idParams = Number(req.params.id);
    
    const seguir = miArray.some((n) => n.id === idParams)
    if(!seguir || typeof(req.body.name) !== "string" || typeof(req.body.lastName) !== "string"){
        res.status(404).send("no podemos cambiar eso chaval, no existe nada con ese id, o has escrito mal el body")
    }

    miArray = miArray.map((elem)=> idParams == elem.id ? {...elem, ...req.body} : elem) // preguntar porque deconstruir elem

    res.status(201).json(miArray)

})
app.delete("/persona/:id", (req, res) =>{
    const idParams = Number(req.params.id);
    
    const seguir = miArray.some((n) => n.id === idParams)
    if(!seguir){
        res.status(404).send("no podemos eliminar eso chaval")
    }
    miArray = miArray.filter((elem) => elem.id !== Number(req.body.id))
    res.status(201).send("Personaje eliminado");
})

app.listen(port, ()=>{console.log("esto funciona y esta en el puerto 3000")})