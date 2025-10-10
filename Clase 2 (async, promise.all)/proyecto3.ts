import axios from "axios";

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};
axios.get("https://rickandmortyapi.com/api/character/3").then((res)=>{
    console.log(res.data);
})
//funcion asincrona es una promesa, es un codigo que se va a ejecutar por otro lado 
const getCharacter = async (id: number)=>{
    const res = await axios.get("https://rickandmortyapi.com/api/character/$(id)");
    return res.data;
}
const getCharacterClassic = async (id: number) => {
  const res = await axios
    .get(`https://rickandmortyapi.com/api/character/${id}`)
    .then((res) => {
      return res.data;
    });
  return res;
};
// getCharacterClassic(1).then((char)=>{
//console.log(char);
//})
//esto con el await se hace súper facil, si no serían un monton de thens anidados, el await espera directamente a que termine el de arriba
console.log(await getCharacterClassic(1));
//console.log(await getCharacter(1))

const getCharactersProper = async (ids:number[])=>{
    try{
        const chars = ids.map(async(id)=>{
            const personaje=  (await axios.get<Character>("https://rickandmortyapi.com/api/character/$(id)")).data;  //el character da mal pq no está tipado (coger el tipo del API)
            return personaje //Arrayde promesas
        });
          return await Promise.all(chars);//esto te devolverá los personajes que le pidas, ya que es un array de promesas y con ese await se 
    }catch(err){
        if(axios.isAxiosError(err)){
            console.log("Error en la petición: " + err.message) //Error que te lo ha generado axios
        } else{
            console.log("Error general: " + err) //Error de la propia api
        }
    }
};
console.log(await getCharactersProper([1,2,3]));