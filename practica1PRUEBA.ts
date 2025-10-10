/*Escribe una función recursiva llamada sumaRecursiva que 
tome un array de números como argumento y devuelva la suma total de todos sus elementos. 
No puedes utilizar bucles (for, while).

function sumaRecursiva(arr: number[]): number {

}
 
// Ejemplo de uso:
const numeros = [1, 2, 3, 4, 5];
const resultadoSuma = sumaRecursiva(numeros);
console.log(La suma recursiva es: ${resultadoSuma}); // Debería imprimir 15

*/

const sumaRecursiva = (arr: number[]): number =>{
    
    if(arr.length == 0){
        return 0;
    }

    const ult : number = arr.pop() as number;

    return ult + sumaRecursiva(arr);

}
/*
const numeros = [1, 2, 3, 4, 5];
const resultadoSuma = sumaRecursiva(numeros);
console.log(`La suma recursiva es: ` + resultadoSuma); // Debería imprimir 15
*/



/*
Escribe una función llamada procesarUsuarios que tome un array de objetos representando usuarios (con propiedades como id, name, username, email) y realice las siguientes operaciones utilizando el método reduce:
Filtrar: Elimina los usuarios cuyo id sea mayor a 5.
Transformar: Convierte cada objeto usuario en un string con el formato "Nombre: [name], Username: [username]".
Reducir: Concatena todos los strings resultantes en un único string, separados por una coma y un espacio.

interface Usuario {
  id: number;
  name: string;
  username: string;
  email: string;
}
 
function procesarUsuarios(usuarios: Usuario[]): string {
  // Tu código aquí
}
 
// Ejemplo de uso (puedes crear un array de usuarios de prueba):
const usuariosDePrueba = [
    { id: 1, name: 'Juan', username: 'juanito', email: 'juan@example.com' },
    { id: 2, name: 'Maria', username: 'mariita', email: 'maria@example.com' },
    { id: 6, name: 'Pedro', username: 'pedrito', email: 'pedro@example.com' }
];
const resultadoProcesado = procesarUsuarios(usuariosDePrueba);
console.log(Resultado procesado: ${resultadoProcesado}); // Debería imprimir "Nombre: Juan, Username: juanito, Nombre: Maria, Username: mariita"
*/
interface Usuario {
  id: number;
  name: string;
  username: string;
  email: string;
}
const valorInicial : string = '';

 
const procesarUsuarios = (usuarios: Usuario[]): string => {
  const resultado  = usuarios.reduce((acc: string, n: Usuario) => {
    if(n.id <= 5){

        return acc.concat(`Nombre: ${n.name}, Username: ${n.username}, `)
    }
    return acc;


  }, valorInicial)
  return resultado;
}
 
// Ejemplo de uso (puedes crear un array de usuarios de prueba):
const usuariosDePrueba = [
    { id: 1, name: 'Juan', username: 'juanito', email: 'juan@example.com' },
    { id: 2, name: 'Maria', username: 'mariita', email: 'maria@example.com' },
    { id: 6, name: 'Pedro', username: 'pedrito', email: 'pedro@example.com' }
];

//console.log(procesarUsuarios(usuariosDePrueba));

//Ejercicio 3

/*
async function obtenerTitulosDePosts(): Promise<string[]> {
  // Tu código aquí
}
 
// Ejemplo de uso:
obtenerTitulosDePosts()
  .then(titulos => {
    console.log(`Títulos de los posts: ${titulos}`);
  })
  .catch(error => {
    console.error(`Error al obtener los títulos: ${error}`);
  });
 
// Ejemplo con async/await (opcional, para practicar):
async function ejecutarObtenerTitulos() {
  try {
    const titulos = await obtenerTitulosDePosts();
    console.log(`Títulos de los posts (con async/await): ${titulos}`);
  } catch (error) {
    console.error(`Error al obtener los títulos (con async/await): ${error}`);
  }
}
 
ejecutarObtenerTitulos();
*/

async function obtenerTitulosDePosts(): Promise<string[]> {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const posts: Array<{ title: string }> = await respuesta.json();
    return posts.map(post => post.title);
  } catch (error) {
    console.error(`Error al obtener los títulos: ${error}`);
    return [];
  }
}

obtenerTitulosDePosts()
  .then(titulos => {
    console.log(`Títulos de los posts: ${titulos}`);
  })

async function ejecutarObtenerTitulos() {
  try {
    const titulos = await obtenerTitulosDePosts();
    console.log(`Títulos de los posts (con async/await): ${titulos}`);
  } catch (error) {
    console.error(`Error al obtener los títulos (con async/await): ${error}`);
  }
}

ejecutarObtenerTitulos();