import express from "express";
import cors from "cors";
import axios from "axios";


const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())



type Team = {
 id: number
 name: string
 city: string
 titles: number

}
let teams: Team[] = [
 { id: 1, name: "Lakers", city: "Los Angeles", titles: 17 },
 { id: 2, name: "Celtics", city: "Boston", titles: 17 },
];

app.get("/teams",(req,res)=>{
    res.json(teams);
})
app.get("/teams/:id",(req,res)=>{
    const idEquipo = Number(req.params.id);
        const resultado = teams.find((elem)=>{
            elem.id==idEquipo;
        })

    resultado ? res.json(resultado) : res.status(404).send("Equipo no encontrado");
});
app.post("/teams",(req,res)=>{
    const ultimoId = Date.now(); //me gusta mas con id unico creado por nosotros
    //console.log(req.body);
    const nuevoName = req.body?.name;
    const nuevaCity = req.body?.city;
    const nuevosTitles = req.body?.titles;
     if(typeof(nuevoName) == "string" && typeof (nuevaCity) == "string" && typeof (nuevosTitles) == "number" ){
        const newEquipo: Team={
                id: ultimoId,
                name: nuevoName,
                city: nuevaCity,
                titles: nuevosTitles
         } 
         teams.push(newEquipo);
         res.status(201).send(newEquipo) //mejor json 
     }else{
        res.status(404).send("Has introducido mal un parámetro")
     }
     
       
})

app.delete("/teams/:id",(req,res)=>{   

const existe=teams.some((elem)=>{
    if(elem.id== Number( req.params.id)){
        return true
    }else{
        return false
    }

})
 if(existe){
  teams=teams.filter((elem) => elem.id !== Number(req.params.id))
    res.status(203).send("Team eliminado")  
 }else{
    res.status(404).send("No existe ese team")
 }

})

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));


const testAPI= async() => {
  const equipos = (await axios.get("http://localhost:3000/teams")).data
  console.log(equipos);

  axios.post("http://localhost:3000/teams/", {id: Date.now(), name:"Bulls",city:"Chicago", titles:6});

  const nuevosEquipos = (await(axios.get<Team[]>("http://localhost:3000/teams"))).data
    console.log(nuevosEquipos);

    const miId: Team|undefined = nuevosEquipos.find((elem:Team)=>{
        if(elem.name=="Bulls"&&elem.city=="Chicago"){
            return elem
        }
    })
    const minuevoID = miId?.id;
    const miTeamID = Number(minuevoID);
  await (axios.delete(`http://localhost:3000/teams/${miTeamID}`));

    const FINAL = (await (axios.get("http://localhost:3000/teams"))).data
    console.log(FINAL);
    
    return FINAL;
  }
 setTimeout(() => {testAPI()}, 1000);


