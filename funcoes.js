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
                html += "<td><span id='bloco"+auxLinhas+"'></span></td>";
            }else{
                html += "<td><span id='bloco"+auxLinhas+"'></span><span class='conj'>Conjunto "+i+"</span></td>";
            }
            
            html += "</tr>";
            arrayAux.push(auxLinhas);
            arrayAuxiliarValores.push(-1);
            auxLinhas++;
        }
        arrayBlocos.push(arrayAux);
    }

    return $("#conteudo").html(html);
}

function alimenta_bloco(sequencia){
    if(sequencia != ""){
        var metodo = $("input[name='fcc']:checked").val();
        var conjuntos = $('#n').val();
        var numero_posicoes = $('#linha').val();
        sequencia = parseFloat(sequencia);
        conjuntos = parseFloat(conjuntos);
        numero_posicoes = parseFloat(numero_posicoes);

        if(metodo == "fifo"){
            resultado = sequencia % conjuntos;
            var stringLog = sequencia+"%"+conjuntos+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);


        var aux = arrayBlocos[resultado].length;
        var i = 0;
        while(aux != arrayBlocos[resultado].length + numero_posicoes){
            if(arrayAuxiliarValores[arrayBlocos[resultado][i]] == -1){
                arrayAuxiliarValores[arrayBlocos[resultado][i]] = sequencia;
                // alert(arrayAuxiliarValores[arrayBlocos[resultado][i]]);
                // $("#bloco"+arrayAuxiliarValores[arrayBlocos[resultado][i]]).text(sequencia);
                for(var j = 0; j < arrayAuxiliarValores.length; j++){
                    if(arrayAuxiliarValores[j] != -1)
                        $("#bloco"+j).text(arrayAuxiliarValores[j]);
                }
                break;
            }
            i++;
            aux++;
        }
        
        arrayBlocos[resultado]

        

        }else if(metodo == "lru"){
            
        }else if(metodo == "lfu"){

        }
    }else{
        alert("Preencha a sequência!");
    }
}