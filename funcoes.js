function gera_bloco(numero_posicoes, conjuntos){
    var memoria = $('#memoria').val();
    var bloco = $('#bloco').val();
    var linha = $('#linha').val();
    var n = $('#n').val();
    if(memoria != "" && bloco != "" && linha != "" && n != ""){
        //travando campos

        $('#memoria').attr("disabled", true);
        $('#bloco').attr("disabled", true);
        $('#linha').attr("disabled", true);
        $('#n').attr("disabled", true);

        $('#controlador').val(1); // Variavel auxiliar para controlar inserções antes do carregamento.
        $('#maximoBlocos').val(parseFloat(memoria)/parseFloat(bloco)); // Variavel auxiliar para controlar inserções antes do carregamento.
        
        var metodo = $("input[name='fcc']:checked").val(); // Controlando o disable dos buttons 

        if(metodo == "fifo"){
            $('#lru').attr("disabled", true);
            $('#lfu').attr("disabled", true);
        }else if(metodo == "lru"){
            $('#fifo').attr("disabled", true);
            $('#lfu').attr("disabled", true);
        }else if(metodo == "lfu"){
            $('#lru').attr("disabled", true);
            $('#fifo').attr("disabled", true);
        }


        var html = "";
        auxLinhas = 0;
        numero_posicoes = parseFloat(numero_posicoes); // número de linhas 
        conjuntos = parseFloat(conjuntos); // número de conjuntos

        var tamanho = numero_posicoes/conjuntos;
        for (var i = 0; i < tamanho; i++){
            var arrayAux = [];
            for(j = 0; j < conjuntos; j++){
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


        for(var i = 0; i < tamanho; i++) // Alimentando arrayAuxiliarFIFO
            arrayMarcadorFIFO[i] = 0;

        return $("#conteudo").html(html);
    }else{
        alert("Preencha todos os campos corretamente!");
    }
}

function alimenta_bloco(sequencia){

    var tamanhoMemoria = parseFloat($('#memoria').val());
    var tamanhoBloco = parseFloat($('#bloco').val());

    var tamanhoMaximoBloco = parseFloat($('#maximoBlocos').val()) - 1;

    if(sequencia != "" && $('#controlador').val() == "1" && (sequencia <= tamanhoMaximoBloco && sequencia > -1)){
        var metodo = $("input[name='fcc']:checked").val(); // Pega o método selecionado no radio button
        var conjuntos = $('#n').val(); 
        var numero_posicoes = $('#linha').val();
        var tamanho = Math.round(numero_posicoes/conjuntos);
        sequencia = parseFloat(sequencia); // forçando parseFloat para entender como decimal
        conjuntos = parseFloat(conjuntos); // forçando parseFloat para entender como decimal
        var n = conjuntos;
        numero_posicoes = parseFloat(numero_posicoes); // forçando parseFloat para entender como decimal

        if(metodo == "fifo"){ // Implementação FIFO

            // Inicio validação local aonde entrará
            resultado = sequencia % tamanho;
            var stringLog = sequencia+"%"+tamanho+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);
            //Fim validação


            var aux = arrayBlocos[resultado].length; // Array com o número de posições do conjunto
            var i = 0; // variavel de controle
            while(aux != arrayBlocos[resultado].length + n){
                if(arrayAuxiliarValores[arrayBlocos[resultado][i]] == -1 && !arrayAuxiliarValores.includes(sequencia)){ // Validação para existência do valor
                    arrayAuxiliarValores[arrayBlocos[resultado][i]] = sequencia;
                    for(var j = 0; j < arrayAuxiliarValores.length; j++){
                        if(arrayAuxiliarValores[j] != -1)
                            $("#bloco"+j).text(arrayAuxiliarValores[j]); // Remanejando blocos
                    }
                    break;
                }
                i++;
                aux++;
            }

            if(aux == arrayBlocos[resultado].length + n  && !arrayAuxiliarValores.includes(sequencia)){ // Ele entrará aqui caso o conjunto esteja todo preenchido
                var aux = arrayMarcadorFIFO[resultado]; // Pegando proxima posição
                if(aux < n){
                    //inicio do conjunto 
                    var aux2 = 0
                    for (var i = resultado * n; i < (resultado * n) + n; i++){ // validação para saber o exato numero do bloco (vetor de valores)
                        if(i == (aux + resultado * n)){
                            arrayMarcadorFIFO[resultado] = aux2;
                            arrayAuxiliarValores[i] = sequencia;
                            $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        }
                        aux2++;
                    }
                }else{
                    //Caso o número seja maior que a ultima posição, ocorre essa validação para voltar com o mesmo para 0
                    arrayMarcadorFIFO[resultado] = 0;
                    arrayAuxiliarValores[resultado * n] = sequencia;
                    $("#bloco"+resultado * n).text(arrayAuxiliarValores[resultado * n]);
                }
                arrayMarcadorFIFO[resultado]++;
        }
               
        }else if(metodo == "lru"){ // Implementação LRU
            marcaUsoLRU++; // Variavel para controlar o ultimo utilizado

            // Inicio validação local aonde entrará
            resultado = sequencia % tamanho;
            var stringLog = sequencia+"%"+tamanho+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);
            //Fim validação

            var aux = arrayBlocos[resultado].length;
            var i = 0;

            //Validação para quando o conjunto ainda não está lotado.
            while(aux != arrayBlocos[resultado].length + n){
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

            // Para quando o conjunto está lotado
            if(aux == arrayBlocos[resultado].length + n && !arrayAuxiliarValores.includes(sequencia)){
                var arraymenor = []; // Declaração de um vetor auxiliar, para sabermos o menor valor.
                for (var i = resultado * n; i < (resultado * n) + n; i++){
                    arraymenor.push(arrayMarcadorLRU[arrayAuxiliarValores[i]]);
                }

                // percorrendo o conjunto
                for (var i = resultado * n; i < (resultado * n) + n; i++){
                    if(arrayMarcadorLRU[arrayAuxiliarValores[i]] == Math.min.apply(Math, arraymenor)){ // caso o valor encontrado seja o menor, faço a substituição
                        arrayAuxiliarValores[i] = sequencia;
                        $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        arrayMarcadorLRU[sequencia] = marcaUsoLRU;
                    }
                }

            }
            
        }else if(metodo == "lfu"){ // Implementação LFU
            // Inicio validação local aonde entrará
            resultado = sequencia % tamanho;
            var stringLog = sequencia+"%"+tamanho+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);
            //Fim validação

            var aux = arrayBlocos[resultado].length;
            var i = 0;
            var auxInsert = 0;

            //Validação para quando o conjunto ainda não está lotado.
            while(aux != arrayBlocos[resultado].length + n){
                if(arrayAuxiliarValores[arrayBlocos[resultado][i]] == -1 && !arrayAuxiliarValores.includes(sequencia)){
                    arrayAuxiliarValores[arrayBlocos[resultado][i]] = sequencia;

                    for(var j = 0; j < arrayAuxiliarValores.length; j++){
                        if(arrayAuxiliarValores[j] != -1){
                            $("#bloco"+j).text(arrayAuxiliarValores[j]);
                            arrayMarcadorLFU[sequencia] = 1;
                        }
                    }
                    break;
                }else if(arrayAuxiliarValores.includes(sequencia) && auxInsert == 0){
                    arrayMarcadorLFU[sequencia] += 1;
                    auxInsert++;
                }
                i++;
                aux++;
            }

            auxInsert = 0;

            // Para quando o conjunto está lotado
            if(aux == arrayBlocos[resultado].length + n && !arrayAuxiliarValores.includes(sequencia)){
                var arraymenor = []; // Declaração de um vetor auxiliar, para sabermos o menor valor.
                for (var i = resultado * n; i < (resultado * n) + n; i++){
                    arraymenor.push(arrayMarcadorLFU[arrayAuxiliarValores[i]]);
                }

                // percorrendo o conjunto
                for (var i = resultado * n; i < (resultado * n) + n; i++){
                    if(arrayMarcadorLFU[arrayAuxiliarValores[i]] == Math.min.apply(Math, arraymenor)){ // caso o valor encontrado seja o menor, faço a substituição
                        arrayAuxiliarValores[i] = sequencia;
                        $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        arrayMarcadorLFU[sequencia] = 1;
                        break;
                    }
                }

            }
        }
    }else if(sequencia == ""){
        alert("Preencha a sequência!");
    }else if($('#controlador').val() == "0"){
        alert("Favor carregue a memória antes de inserir blocos!");
    }else if((sequencia > tamanhoMaximoBloco || sequencia < 0)){
        alert("Favor digitar blocos entre 0 e "+tamanhoMaximoBloco+"!");
    }
}
