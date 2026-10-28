interface EstadoNodo{
    url: string;
    saludable: boolean;
    detalle?: any;
}

async function verificarNodo(url: string): Promise<EstadoNodo>{
    try{
        const respuesta = await fetch(`${url}/health`,{
            signal: AbortSignal.timeout(3000) //2 seg max no responde lo da como malo
        });
        if(!respuesta.ok) return { url, saludable: false };
        const detalle = await respuesta.json();

        return { url, saludable: true, detalle };
    }catch{
        return { url, saludable: false};
    }
}

async function verificarCluster(nodos: string[]){
    //promise.all ejecuta todas las verificaciones en paralelo
    const resultados = await Promise.all(nodos.map(verificarNodo));

    for(const r of resultados){
        //Si se cumple la condicion ===> condicion ? SI : NO;
        const icono = r.saludable ? "OK" : "FAILED";
        console.log(`[${icono}]-----${r.url}`);
    }

    const health = resultados.filter((r)=> r.saludable).length;
    console.log(`${health} de ${resultados.length} nodos saludables`);
}

verificarCluster(["http://localhost:9000"])