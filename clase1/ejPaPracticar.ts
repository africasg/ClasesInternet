import axios from "axios";

type Results = {
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
    created: string,// ISO date string
  
};

const miPromesa = axios.get(`https://rickandmortyapi.com/api/character/?page=1`);
const numerito : number = 8;
const arrayPersonajes : Array<string> = [];

miPromesa.then((res)=>{
   
const miArray2 : Array<Results> = res.data.results;

const resultado = miArray2.reduce((acc: Array<string>, n : Results)=>{

    if(n.id >= 1 && n.id <=10){
        if(n.name.charAt(0) === "M"){

            
            return [...acc, n.name];
        }
        else{
            return acc;
        }
        
    }
    else{
        return acc;
    }
    


},arrayPersonajes)

console.log(resultado)



}).catch((err)=> {

    console.error("La has cagado chaval", err.message)

})


