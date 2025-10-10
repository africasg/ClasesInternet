import axios from "axios"

type Resultado = {
    nombres : Array<String>
};
//type Personaje ={} como lo tipamos bien?
    

const valorInicial : Resultado ={
    nombres: []
};

const Promesa1 = axios
.get("https://rickandmortyapi.com/api/character/1");
const Promesa2 = axios
.get("https://rickandmortyapi.com/api/character/2");
const Promesa3= axios
.get("https://rickandmortyapi.com/api/character/3");
const Promesa4= axios
.get("https://rickandmortyapi.com/api/character/4");

Promesa1
.then((res1)=>{
    Promesa2
    .then((res2)=>{
        Promesa3
        .then((res3)=>{
            Promesa4
            .then((res4)=>{

                const ArrayNombres : Array<any> = [res1,res2,res3,res4];
                const ArrayResultado = ArrayNombres.reduce((acc:Resultado ,res)=>{
                    return {
                        nombres:[...acc.nombres,res.data.name]//Con esto queriamos entrar a la documentación del AP]
                    }
                
                
                }, valorInicial);
                console.log(ArrayResultado);
                
            })

        })

    })
})
.catch((err)=>{
    console.error("CAGASTE WEY",err.message);

})
