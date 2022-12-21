
export let capitalizaString = (texto) => {
    let textoSeparado;
    let textoFinal = '';
    texto = texto.toLowerCase();
    textoSeparado = texto.split(' ');
    if(textoSeparado.length > 1){
        for(let i = 0;i < textoSeparado.length;i++){
            if(textoSeparado[i] !== "de" && textoSeparado[i] !== "da" && textoSeparado[i] !== "do"
                && textoSeparado[i] !== "dos" && textoSeparado[i] !== "das"){
                textoSeparado[i] = textoSeparado[i].charAt(0).toUpperCase() + textoSeparado[i].slice(1);
            }
            if(textoSeparado[i].substring(0, 2) === "D'" || textoSeparado[i].substring(0, 2) === "d'"){
                textoSeparado[i] = "d'" + textoSeparado[i].charAt(2).toUpperCase() + textoSeparado[i].slice(3);
            }
            textoFinal = i !== textoSeparado.length - 1 ? textoFinal + textoSeparado[i] + ' ' : textoFinal + textoSeparado[i];
        }
    } else {
        textoFinal = texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    return textoFinal;
}