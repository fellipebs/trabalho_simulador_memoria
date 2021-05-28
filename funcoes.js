function gera_bloco(numero_posicoes, conjuntos){

    var html = "";
    auxLinhas = 0;
    numero_posicoes = parseFloat(numero_posicoes);
    conjuntos = parseFloat(conjuntos);

    tamanhoconjuntos = conjuntos/2;


    for (var i = 0; i < conjuntos; i++){
        var arrayAux = [];
        for(j = 0; j < numero_posicoes; j++){
            html += "<tr>";
            html += "<td>Linha "+auxLinhas+"</td>";
            if(j != 0){
                html += "<td></td>";
            }else{
                html += "<td><span class='conj'>Conjunto "+i+"</span></td>";
            }
            
            html += "</tr>";
            auxLinhas++;
            arrayAux.push(auxLinhas);
        }
        arrayBlocos.push(arrayAux);
    }

    return $("#conteudo").html(html);
}