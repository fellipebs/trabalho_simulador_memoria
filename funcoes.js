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
                html += "<td><span id='bloco"+auxLinhas+"'></span><span class='conj' id='conj'>Conjunto "+i+"</span></td>";
            }
            
            html += "</tr>";
            arrayAux.push(auxLinhas);
            arrayAuxiliarValores.push(-1);
            auxLinhas++;
        }
        arrayBlocos.push(arrayAux);
    }


    for(var i = 0; i < conjuntos; i++)
        arrayMarcadorFIFO[i] = 0;

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
                if(arrayAuxiliarValores[arrayBlocos[resultado][i]] == -1 && !arrayAuxiliarValores.includes(sequencia)){
                    arrayAuxiliarValores[arrayBlocos[resultado][i]] = sequencia;
                    for(var j = 0; j < arrayAuxiliarValores.length; j++){
                        if(arrayAuxiliarValores[j] != -1)
                            $("#bloco"+j).text(arrayAuxiliarValores[j]);
                    }
                    break;
                }
                i++;
                aux++;
            }

            if(aux == arrayBlocos[resultado].length + numero_posicoes  && !arrayAuxiliarValores.includes(sequencia)){
                var aux = arrayMarcadorFIFO[resultado];
                if(aux < numero_posicoes){
                    //inicio do conjunto 
                    var aux2 = 0
                    for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){
                        if(i == (aux + resultado * numero_posicoes)){
                            arrayMarcadorFIFO[resultado] = aux2;
                            arrayAuxiliarValores[i] = sequencia;
                            $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        }
                        aux2++;
                    }
                }else{
                    arrayMarcadorFIFO[resultado] = 0;
                    arrayAuxiliarValores[resultado * numero_posicoes] = sequencia;
                    $("#bloco"+resultado * numero_posicoes).text(arrayAuxiliarValores[resultado * numero_posicoes]);
                }
                arrayMarcadorFIFO[resultado]++;
        }
               
        }else if(metodo == "lru"){
            marcaUsoLRU++;
            resultado = sequencia % conjuntos;
            var stringLog = sequencia+"%"+conjuntos+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);


            var aux = arrayBlocos[resultado].length;
            var i = 0;
            while(aux != arrayBlocos[resultado].length + numero_posicoes){
                if(arrayAuxiliarValores[arrayBlocos[resultado][i]] == -1 && !arrayAuxiliarValores.includes(sequencia)){
                    arrayAuxiliarValores[arrayBlocos[resultado][i]] = sequencia;

                    for(var j = 0; j < arrayAuxiliarValores.length; j++){
                        if(arrayAuxiliarValores[j] != -1){
                            $("#bloco"+j).text(arrayAuxiliarValores[j]);
                            arrayMarcadorLRU[sequencia] = marcaUsoLRU;
                        }
                    }
                    break;
                }else if(arrayAuxiliarValores.includes(sequencia)){
                    arrayMarcadorLRU[sequencia] = marcaUsoLRU;
                }
                i++;
                aux++;
            }

            if(aux == arrayBlocos[resultado].length + numero_posicoes && !arrayAuxiliarValores.includes(sequencia)){
                var arraymenor = [];
                for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){
                    arraymenor.push(arrayMarcadorLRU[arrayAuxiliarValores[i]]);
                }

                for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){
                    if(arrayMarcadorLRU[arrayAuxiliarValores[i]] == Math.min.apply(Math, arraymenor)){
                        arrayAuxiliarValores[i] = sequencia;
                        $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        arrayMarcadorLRU[sequencia] = marcaUsoLRU;
                    }
                }

            }
            
        }else if(metodo == "lfu"){

        }
    }else{
        alert("Preencha a sequência!");
    }
}
