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

const getCharacterwithEpisodes = async (id:number)=>{
        const personaje = (await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`)).data;

        const nuevoArrayEpisodios = personaje.episode.map(async (url)=>{
            const episodio = (await axios.get<Episode>(url)).data
            return episodio;
        })

        const arrayFinal = (await Promise.allSettled(nuevoArrayEpisodios)).filter(elem=>elem.status==="fulfilled").map(elem=>elem.value);

        return {...personaje,
            episode:arrayFinal
        }



}


console.log(await getCharacterwithEpisodes(1));