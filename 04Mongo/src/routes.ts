import {Router} from "express";
import { getDB } from "./mongo";
import { ObjectId } from "mongodb";


const router = Router();
const coleccion = () => getDB().collection("Clase1");

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1; //hay que marcar que es number, si no puede que sea string
    const limit = Number(req.query?.limit) || 25;
    const skip = (page-1) * limit 
    const albums = await coleccion().find().sort({year:1}).skip(skip).limit(limit).toArray();
    res.json({
      info:{
        limite: limit,
        pagina:page
      },
      results:albums
    });
    res.status(200).json(albums);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "OH HELL NAH" });
  }
});
// router.get("/", async (req, res) => {
//   try {
//     const newer = req.query.newer ? Number(req.query.newer) : null;
//     const filter = newer ? { year: { $gt: newer } } : {};
//     const albums = await coleccion().find(filter).toArray();

//     // if (!albums || albums.length === 0) {
//     //   return res.status(404).json({ message: "No hay álbumes que cumplan el criterio" });
//     // }

//     res.status(200).json(albums);
//   } catch (error) {
//     console.error("Error en GET /:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const queryYear = req.query?.year;
//             const albums = await coleccion().find(queryYear? {year:queryYear}:{}).toArray(); //se tiene que meter modo string
//              res.status(200).json(albums);
//   } catch (error) {
//     console.error(error);
//     res.status(404).json({ error: "OH HELL NAH" });
//   }
// }
// );
// router.get("/", async (req, res) => {
//   try {
//     const publicationCountry = req?.query.country;

//     const albums =  await coleccion().find(publicationCountry ? {publicationCountries: {$in:[publicationCountry]}}: {}).toArray();
//     res.json(albums);
//   } catch (error) {
//     console.error(error);
//     res.status(404).json({ error: "OH HELL NAH" });
//   }
// });
//get
router.post("/",async (req,res )=>{
try{
  const result = await coleccion().insertOne(req.body);
  const idCreado = result.insertedId;
  const resultObject = await coleccion().findOne({_id : idCreado}) //find como si fuese filter, y findOne es find. FindOne puede llamar directamente a un id
  // mongo hace id como _id de forma automatica. El _id no es un string directamente
  //mongo tiene como tipo document(por ello find devuelve un document)
  res.status(201).json(resultObject)
}catch(err){
  res.status(404).json({error: "No hay na"})
}
});

router.post("/many" , async(req,res)=>{
  try{
     const result = await coleccion().insertMany(req.body.albums)
     res.status(201).json(result)

  }catch(err){
        res.status(404).json({error: "No has creado na"})
  }
})

router.get("/:id", async(req,res)=>{
  try{
  const album = await coleccion().findOne({_id: new ObjectId(req.params.id)}) //cuando buscas un find que no es nada, irá al catch. Es un undefined pero saltaría a catch sin ser correctamente un buen catch
    album? res.status(201).json(album) :  res.status(404).json({error: "No existe album con ese id"})
  
}catch(err){
  res.status(404).json({error: "la pifiaste mi broder"})
}
})

//put 
router.put("/:id",async (peticion,respuesta )=>{
  try{
      const result = await coleccion().updateOne(//Recibe el filtro y despues el objeto a actualizar
        {_id : new ObjectId((peticion.params.id))}, // te acepta id, una sola cosa y muy concreta. La otra opcion, findone&update te deja ver muchos mas filtros
        {$set :peticion.body}
      );
      respuesta.json(result);
      
  }catch(err){
    respuesta.status(404).json({error: "no se actualizo"})
  }
})




router.delete("/:id", async (req,res) =>{
  try{
      const result = await coleccion().deleteOne(
        {_id : new ObjectId((req.params.id))})
       result && res.status(400).send({ message: `Objeto con id ${req.params.id} eliminado correctamente` })
  }catch(err){
    res.status(404).json({error: "No se elimino na"})
  }
})

export default router;