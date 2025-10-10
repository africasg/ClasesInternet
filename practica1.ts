import axios from "axios"


async function obtenerTitulosDePosts(): Promise<string[]>{
       const Promesa1 = axios.get("https://jsonplaceholder.typicode.com/posts") ;
        Promesa1.then((res)=>{
            
       })
}


