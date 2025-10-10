import axios from "axios";

type Character = {
    id: number,
    name: string;
    status: 'Alive' | 'Dead' | 'unknown',
    species: string,
    type: string,
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown',
    origin: {
      name: string,
      url: string,
    };
    location: {
      name: string,
      url: string,
    };
    image: string,
    episode: string[],
    url: string,
    created: string,
};
type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[]; 
  url: string;
  created: string;
};
type Resultado ={
    Hombres : number,
    Feminas :number,
    otros:number
}

//te paso el id de un episodio y me dices la cantidad de hombres mujeres y otros que hay

const getGeneros = async(id:number) =>{
    const episodio : Episode = (await axios.get<Episode>(`https://rickandmortyapi.com/api/episode/${id}`)).data;
       const arrayPersonajes = episodio.characters.map(async (n)=>{
            const personaje = ((await axios.get<Character>(n)).data)
                return personaje.gender;
       })
       const arrayGeneros = (await Promise.allSettled(arrayPersonajes));
          const contador : Resultado = {
                        Hombres : 0,
                        Feminas:0,
                        otros : 0
                    };
       const resultado = arrayGeneros.filter((elem)=>elem.status==="fulfilled")
             resultado.map((elem)=>{
                if(elem.value === 'Female'){
                    contador.Feminas++
                }else if(elem.value === 'Male'){
                    contador.Hombres++
                }
                else {
                    contador.otros++
                }
                
            })
            return contador;

}  
const resultado = await getGeneros(1);
console.log("Resultado:", resultado);