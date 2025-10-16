import express from "express";
import cors from "cors";

// Definición del servidor
const app = express();
const port = 3000; // Típico puerto de pruebas

type Person = {
  id: number;
  name: string;
  lastName: string;
};

let personas: Person[] = [ //que se pueda cambiar
  {
    id: 1,
    name: "Paco",
    lastName: "Sanchez"
  },
  {
    id: 2,
    name: "Paca",
    lastName: "Alpaca"
  }
];

app.use(cors());
app.use(express.json());

// Definimos la ruta raíz
app.get("/", (req, res) => {
  res.send("Ey, te has conectao, esto funciona ");
});

// Endpoint para obtener todas las personas
app.get("/personas", (req, res) => {
  res.json(personas);
});

// Endpoint para obtener una persona por ID
app.get("/personas/:id", (req, res) => {
  const idParams = req.params.id;
  const realId = Number(idParams);
  const buscao = personas.find((elem) => elem.id === realId);

  if (buscao) {
    res.json(buscao); // Si encontramos la persona, la devolvemos
  } else {
    res.status(404).json({ error: "Dicha PERSONA no existe" }); // Si no se encuentra, devolvemos un error
  }
});
//el nombre puede ser igual pero las llamadas serán diferentes
// app.post("/personas/:name/:lastname",(req,res)=>{
//forma cutre
// })
app.post("/personas", (req, res) => {

  //at(-1) es la ultima pos del array, el array es como un circulo, si tienes 5 y pones 6, será el primero
  const lastId = personas.at(-1)?.id;
  const newId = lastId ? lastId + 1 : 1; // Asegúrate de no usar 0 como ID para la primera persona

  //hay que comprobar uno a uno si existe, si no se va TODO a la mierda
  const newName = req.body.name;
  const newLastName = req.body.lastName;
  const newPersona: Person = {
    id: newId,
    name: newName,
    lastName: newLastName
  };

  // const nuevaPersona = {
  //     id:newId //el id SIEMPRE lo creamos, nunca de devolución, siempre lo gestionamos nostos
  //     ... req.body
  // }
  if (newName && newLastName && newLastName.length) { //ASi comprobamos si es string
    personas.push(newPersona);
    res.status(201).json(newPersona); //le pasas lo que se ha creado 
  } else {
    res.status(400).send("Wrong body for person created"); // Cambié 404 por 400 ya que es un error de petición
  }
  //Este control sigue mal, puede ser que recibamos algo pero no sabemos si lo que recibimos es correcto
  //ES MUY IMPORTANTE a la hora de crear solo coger lo que nos interesa, si se pone de más solo querremos coger ciertas cosas 
})

app.put("/personas/:id",(req,res)=>{
    const id = Number(req.params.id);
    personas = personas.map((elem)=>id == elem.id? {...elem, ...req.body}:elem); //Explicacion audio dia 16/10 min 51
    res.status(202).send("Personaje modificado")
});

app.delete("/personas/:id",(req,res)=>{
    personas=personas.filter((elem)=>elem.id != Number(req.params.id));
    res.status(204).send("Personaje Eliminado");
})
// Escucha en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

//tengo que hacer npm run start cada vez? sí
