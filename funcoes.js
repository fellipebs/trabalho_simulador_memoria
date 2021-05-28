function gera_bloco(numero_posicoes, conjuntos){

    var html = "";
    auxLinhas = 0;
    for (var i = 0; i <= conjuntos; i++){
        for(j = 0; i <= numero_posicoes; j++){
            html += "<br>"+auxLinhas;
            auxLinhas++;
        }
    }

    return html;
}