import {Router} from "express";
import { JwtPayload, Product} from "./types";
import dotenv from "dotenv";
import { getDB } from "../mongo";
import { Users } from "./types";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";
import { ObjectId } from "mongodb";
dotenv.config();

const router = Router();

const coleccionProducts = () => getDB().collection<Product>("products");
const coleccionUsers = () => getDB().collection<Users>("usuarios");
type UserJwt = {
    id: string,
    email:string
}
        
router.get("/", async (req, res) => {
  try {
    //filterby none, name , description idCreator, idBuyer
    const query: any = {};

    const queryName = req.query?.name;
    const queryDesc = req.query?.description;

    if (queryName) query.name = queryName.toString();
    if (queryDesc) query.description = queryDesc.toString();

    if (req.query?.idCreator) {
      try { query.idCreatorUser = new ObjectId(req.query.idCreator.toString()); }
      catch { return res.status(400).json({message:"idCreator inválido"}) }
    }

    if (req.query?.idsBuyers) {
      try { query.idsBuyers = new ObjectId(req.query.idsBuyers.toString()); }
      catch { return res.status(400).json({message:"idsBuyers inválido"}) }
    }

    const productos = await coleccionProducts().find(query).toArray();

    if (productos.length === 0) {
      return res.status(200).json({ message: "No se encontró ningún producto con esos filtros" });
    }

    res.json(productos);

  } catch (err) {
    res.status(500).json({ error: "Algo ha fallado"})};
  });
//     //try {
//     const { name, description, idCreator, idBuyer } = req.query;

//     const query: any = {};

//     if (name) query.name = name;
//     if (description) query.description = description;

//     if (idCreator) query.idCreator = new ObjectId(idCreator as string);

//     if (idBuyer) query.idsBuyers = new ObjectId(idBuyer as string);

//     const productos = await coleccionProducts().find(query).toArray();

//     if (productos.length === 0) {
//       return res.status(404).json({ message: "No se encontró ningún producto con esos filtros" });
//     }

//     res.json(productos);

//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });
//   }

router.post("/add",verifyToken, async (req:AuthRequest,res)=>{
    try{
        const usuario = req.user as UserJwt
        const userID = new ObjectId(usuario.id)
        const {name, description,} = req.body as Product;
        
        if(!name || typeof name !== "string" || name.trim().length === 0){
            return res.status(400).json({message: "El campo 'name' es obligatorio"});
        }

       
        const productoAInsertar : Product ={
            idCreatorUser: userID,
            idsBuyers: [],
            name,
            description: typeof description === "string" ? description.trim() : "",
            
        }

        const resultado = await coleccionProducts().insertOne(productoAInsertar);
        const creado = await coleccionProducts().findOne({_id: resultado.insertedId});

        res.status(201).json({message:"Producto creado guay", creado});

    }catch(err){
        console.log("POST add/api/products error",err);
        res.status(500).json({message:"error interno"});
    }

})
router.put("/edit/:name2",verifyToken, async (req:AuthRequest,res)=>{ 
    try{
    const name1 = req.params.name2
    const queryDescription = (req.query?.description )|| "No hay descripción aún"
   // await coleccionProducts().updateOne({name : name1},{$set: {description:req.body.description}})  // si es por el body

    if (typeof queryDescription !== "string") {
        return res.status(400).json({message:"description debe ser string"});
    }

    const resultado = await coleccionProducts().updateOne(
        {name: name1},
        {$set: {description: queryDescription.toString()}}
    );

    if (resultado.matchedCount === 0){
        return res.status(404).json({message:"No existe un producto con ese nombre"});
    }

    res.status(201).json(resultado);
    }catch(err){
         console.log("PUT /edit error", err);
        res.status(500).json({message:"error interno"});
    }
})
router.delete("/delete/:name2",verifyToken, async (req:AuthRequest,res)=>{ 
    try{
    const name1 = req.params.name2
    const result=  await coleccionProducts().deleteOne({name: name1})

    if(result.deletedCount === 0){
        return res.status(404).json({message:"No existe producto con ese nombre"});
    }

    res.status(201).json(result)
    }catch(err){
        console.log("DELETE /api/products error", err);
        res.status(500).json({message:"error interno"});
    }
})
router.put("/buy/:name2",verifyToken, async (req:AuthRequest,res)=>{ 
    try {
        const name1 = req.params.name2
        const usuario = req.user as UserJwt
        const userID = new ObjectId(usuario.id)

        const producto = await coleccionProducts().findOne({name:name1})

        if(!producto){
            return res.status(404).json({message:"No existe ese producto"});
        }

        const existe= producto.idsBuyers.some((n)=> n.equals(userID))
    
        if(producto.idCreatorUser.equals(userID)){
            return res.status(404).json({message:"Eres el creador del producto, no puedes comprar mi rey"})
        }
        else if(!existe){
            const miArray = producto.idsBuyers;
            miArray.push(userID)
            const productosActualizados = await coleccionProducts().updateOne({name:name1},{$set: {idsBuyers: miArray}})
            return res.status(200).json({message:"Productos actualizados", result: productosActualizados})
        }
    
        res.status(200).json({message: "Te ha gustado tanto que no es la primera vez que lo compras"})
        
    } catch (err) {
        console.log("PUT /api/products error", err);
        res.status(500).json({message:"error interno"});
    }
})
export default router;
