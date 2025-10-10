import axios from "axios";
type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

// const getCharactersProper = async (ids : number[]) =>{
    
//     const Personajes = ids.map(async(n)=>{
//         const personaje = (await axios.get(`https://rickandmortyapi.com/api/character/ ${n}`)).data           
//         return personaje;
//     })

//     const resultado = await Promise.allSettled(Personajes)
    

//     const devuelta =  resultado.forEach((n, index)=>{
//         if(n.status === "fulfilled"){
//             return n.value[index]
//         }
//         else{
//             console.error(`El personaje en la posicion ${index} da el siguiente error`)
//         }
//     })
//     return devuelta;
        
    
// }

// const graficar = await getCharactersProper([1,2,3,4,5])
// console.log(graficar);
const getCharactersReallyReallyProper = async (ids:number[])=>{


try{
    const ArrayDePromesa = ids.map(async (elem)=>{
       return (await axios.get<Character>(`https://rickandmortyapi.com/api/character/${elem}`)).data;//ya sabe que es tipo character
    });
    return await Promise.allSettled(ArrayDePromesa)
}catch(err){
    if(axios.isAxiosError(err)){
        console.log("Error en la petición"+ err.message);
    }else{
        console.log("error general"+err)
         }
    }
}
console.log(await getCharactersReallyReallyProper([1,999999999]));