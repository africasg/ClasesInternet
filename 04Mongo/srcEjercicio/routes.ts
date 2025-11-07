import {Router} from "express";
import { getDB } from "./mongo";
import { ObjectId, WithId } from "mongodb";

const router = Router();
const coleccion = () => getDB().collection("Ejercicio");

type Resultado = {
  buenos: Libro[],
  malos: ObjectId[]
};

type Libro = {
  _id?: ObjectId,
  titulo: string,
  autor: string,
  paginas: number
};


const comprobarObjeto = (miObjeto: any) => {
  if ((miObjeto.titulo && miObjeto.autor && miObjeto.paginas) && miObjeto.paginas > 0) {
    return true;
  }else{return false;}
  
};
//GET
router.get("/", async (req, res) => {
  try {

  const resultado1 : Resultado ={ buenos:[], malos:[] }
    const queryPages = req.query?.paginas;
    //paginacion
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    //
    

    const resultados = await coleccion().find(queryPages? {paginas:{$gt:queryPages}}:{}).sort({pages:1}).skip(skip).limit(limit).toArray();
    const comprobados: Resultado = resultados.reduce<Resultado>((acc, elem) => {
       const comprobacion = comprobarObjeto(elem)
       if (comprobacion){
        const nuevoLibro : Libro = {
          _id: elem._id,
          titulo: elem.titulo,
          autor: elem.autor,
          paginas: elem.paginas
        }
        acc.buenos.push(nuevoLibro);
       }
       else{
        acc.malos.push(elem._id);
       }
     
      return acc;

    }, resultado1 );

      res.json({
      info:{
        limite: limit,
        pagina:page
      },
      results:comprobados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OH HELL NAH" });
  }
});
router.get("/:id", async(req,res)=>{
  try{
  const libro = await coleccion().findOne({_id: new ObjectId(req.params.id)}) 
    libro? res.status(201).json(libro) :  res.status(404).json({error: "No existe libro con ese id"})
  
}catch(err){
  res.status(404).json({error: "la pifiaste mi broder"})
}
})
//

router.post("/",async (req,res )=>{
try{
  const comprobar = comprobarObjeto(req.body);
  if(comprobar){
    const result = await coleccion().insertOne(req.body);
    const idCreado = result.insertedId;
     const resultObject = await coleccion().findOne({_id : idCreado}) 
     res.status(201).json({
      mongoAck: result,
       mongoObject : resultObject }
      );
  }else{
    res.status(404).json({error: "Entraste por el catch de post "})
  }
  
}catch(err){
  res.status(404).json({error: "Entraste por el catch de post "})
}
});

router.post("/many" , async(req,res)=>{
  try{
    let resultado2: Resultado ={ buenos:[], malos:[] };
    const miArray : any [] = req.body.libros;
    const comprobados: Resultado = miArray.reduce<Resultado>((acc, elem) => {
       let comprobacion = comprobarObjeto(elem)
       if (comprobacion){
        console.log("conseguimos entrar")
          const nuevoLibro : Libro = {
            
            titulo: elem.titulo,
            autor: elem.autor,
            paginas: elem.paginas
          }
          acc.buenos.push(nuevoLibro);
       }
       else{
        
       }
      
      return acc;

    }, resultado2 );
      resultado2 = {buenos:[],malos:[]}
      console.log(comprobados)
     const result = await coleccion().insertMany(comprobados.buenos)
     res.status(201).json({resultado:result});

  }catch(err){
        res.status(404).json({error: "No se han insertado todas"})
  }
})



// //put 
// router.put("/:id",async (peticion,respuesta )=>{
//   try{
//       const result = await coleccion().updateOne(//Recibe el filtro y despues el objeto a actualizar
//         {_id : new ObjectId((peticion.params.id))}, // te acepta id, una sola cosa y muy concreta. La otra opcion, findone&update te deja ver muchos mas filtros
//         {$set :peticion.body}
//       );
//       respuesta.json(result);
      
//   }catch(err){
//     respuesta.status(404).json({error: "no se actualizo"})
//   }
// })




// router.delete("/:id", async (req,res) =>{
//   try{
//       const result = await coleccion().deleteOne(
//         {_id : new ObjectId((req.params.id))})
//        result && res.status(400).send({ message: `Objeto con id ${req.params.id} eliminado correctamente` })
//   }catch(err){
//     res.status(404).json({error: "No se elimino na"})
//   }
// })

export default router;