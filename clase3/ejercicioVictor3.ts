import axios from "axios"
import express from "express"
import cors from "cors"


const app = express()
const port = 3000;

app.use(cors())
app.use(express.json())

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

// const valorInicial : number[] = [];
// const a = teams.reduce((acc,n)=>{
//    acc.push(n.id);
//    return acc;
// },valorInicial)

app.get("/teams", (req,res) =>{

    res.json(teams);

})
app.get("/teams/:id", (req, res)=>{
    const realID : number = Number(req.params.id); 
    const team = teams.filter((n) => realID === n.id)
    team ? res.status(200).json(team) : res.status(404).json({
        message: "Equipo no encontrado"
    })

})
app.post("/teams", (req,res)=>{
    const newID = Date.now();
    const newName = req.body.name;
    const newCity = req.body.city;
    const newTitles = Number(req.body.titles);

    if(typeof(newName) !== "string" || typeof(newCity) !== "string" || typeof(newTitles) !== "number" )
    {
        res.status(404).json({message: "Alguno de los valores del body no es correcto"})
    }
    
    const newTeam : Team = {
        id: newID,
        name: newName,
        city: newCity,
        titles: newTitles
    }

    teams.push(newTeam);
    res.status(201).json(newTeam);
})

app.put("/teams/:id", (req,res) =>{
    const idTeam = Number(req.params.id);
    const nameTeam = req.body.name
    const cityTeam = req.body.city
    const titleTeam = Number(req.body.titles)

    const seguir = teams.some((n) => idTeam === n.id) 

    if((typeof(nameTeam) !== "string" && typeof(cityTeam) !== "string" && typeof(titleTeam) !== "number") || !seguir)
    {
        res.status(404).json({message: "Alguno de los valores del body no es correcto"})
    }
    
    teams = teams.map((n)=>{
        if(n.id === idTeam){
           n = {
                ...n, ...req.body
           } 
        
        }
        return n;
        
    })
    res.status(202).json(teams);
})

app.delete("/teams/:id", (req, res)=>{
    const realID : number = Number(req.params.id); 
    const team = teams.some((n) => realID === n.id) // en team se guardara el que queremos borrar
    if(!team){
        res.status(404).json({
            message: "No hay inngun equipo con ese id"
        })
    }
    
    teams = teams.filter((n) => realID != n.id) // cogeremos todos los que NO sean team, y los guardamos en el mismo array
    res.status(203).json(teams)
})
//   const teaEliminado = teams.filter((n)=> realID === n.id)
    // teams = teams.filter((n) => realID != n.id) // cogeremos todos los que NO sean team, y los guardamos en el mismo array
    // res.status(203).json({equipoEliminado: teaEliminado, equiposActuales: teams})


app.listen(port, () => console.log("Servidor en http://localhost:3000"));


const testAPI = async()=>{

    const miPromesa = (await(axios.get<Team[]>("http://localhost:3000/teams"))).data
    console.log(miPromesa);

    

    const crear : Team = {
        id: 0,
        name: "atleti",
        city: "madrid",
        titles: 1
    }
    const miEquipo : Team = {
        id: 3,
        name: "Rayo",
        city: "madrid",
        titles: 1
    }

    axios.post("http://localhost:3000/teams", crear);

    const miPromesa2 = (await(axios.get<Team[]>("http://localhost:3000/teams"))).data
    console.log(miPromesa2);

    const team : Team | undefined= miPromesa2.find((n)=> crear.name === n.name && crear.city === n.city && crear.titles === n.titles)

    let idComprobar : number = 0;
    team ? idComprobar = team.id : console.log("No se ha encontrado el id del equipo creado");

    axios.delete(`http://localhost:3000/teams/${idComprobar}`)

    axios.put(`http://localhost:3000/teams/1`,{name:"Bulls",city:"Chicago", titles:6})//miEquipo )

    const miPromesa3 = (await(axios.get<Team[]>("http://localhost:3000/teams"))).data
    console.log(miPromesa3);



}


setTimeout((testAPI), 1000);