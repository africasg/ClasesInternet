//lógica de lo que hemos hecho en el schema 
import { IResolvers } from "@graphql-tools/utils"


type Album = {
        id: string,
        title: string,
        artist: string,
        releaseDate: string,
        format?: string
}

const albumes : Album[] = [
    {
        id: '1',
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        releaseDate: '1973',
        format:'Vinyl'
    },
    {
        id: '2',
        title: 'Thriller',
        artist: 'Michael Jackson',
        releaseDate: '1985',
        format:'CD'
    }
];


export const resolvers: IResolvers = {
    Query: {
        getAlbums: ()=> albumes, //variable getAlbums  devolverá albumes
        getAlbum: (_, { id })=> albumes.find(x => x.id === id) //primer parámetro: opciones de graphql, no vamos a tocarlas así que le ponemos _ / undefined
    },
    Mutation: {
        addAlbum: (_,  {title, artist, releaseDate,format}) => { //es lo mismo que hacer params y definir un tipo en APIRest
            const newAlbum = {
                id: String(albumes.length+1),
                title,
                artist,
                releaseDate,
                format
            };
            albumes.push(newAlbum);
            return newAlbum //albumes.find(x => x.id === String(albumes.length))
        }
    }
}