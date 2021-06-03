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
    }else{
        alert("Preencha todos os campos corretamente!");
    }
}

function alimenta_bloco(sequencia){

    var tamanhoMemoria = parseFloat($('#memoria').val());
    var tamanhoBloco = parseFloat($('#bloco').val());
    
    if(sequencia != "" && $('#controlador').val() == "1"){
        var metodo = $("input[name='fcc']:checked").val(); // Pega o método selecionado no radio button
        var conjuntos = $('#n').val(); 
        var numero_posicoes = $('#linha').val();
        sequencia = parseFloat(sequencia); // forçando parseFloat para entender como decimal
        conjuntos = parseFloat(conjuntos); // forçando parseFloat para entender como decimal
        numero_posicoes = parseFloat(numero_posicoes); // forçando parseFloat para entender como decimal

        if(metodo == "fifo"){ // Implementação FIFO

            // Inicio validação local aonde entrará
            resultado = sequencia % conjuntos;
            var stringLog = sequencia+"%"+conjuntos+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);
            //Fim validação


            var aux = arrayBlocos[resultado].length; // Array com o número de posições do conjunto
            var i = 0; // variavel de controle
            while(aux != arrayBlocos[resultado].length + numero_posicoes){
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

            if(aux == arrayBlocos[resultado].length + numero_posicoes  && !arrayAuxiliarValores.includes(sequencia)){ // Ele entrará aqui caso o conjunto esteja todo preenchido
                var aux = arrayMarcadorFIFO[resultado]; // Pegando proxima posição
                if(aux < numero_posicoes){
                    //inicio do conjunto 
                    var aux2 = 0
                    for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){ // validação para saber o exato numero do bloco (vetor de valores)
                        if(i == (aux + resultado * numero_posicoes)){
                            arrayMarcadorFIFO[resultado] = aux2;
                            arrayAuxiliarValores[i] = sequencia;
                            $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        }
                        aux2++;
                    }
                }else{
                    //Caso o número seja maior que a ultima posição, ocorre essa validação para voltar com o mesmo para 0
                    arrayMarcadorFIFO[resultado] = 0;
                    arrayAuxiliarValores[resultado * numero_posicoes] = sequencia;
                    $("#bloco"+resultado * numero_posicoes).text(arrayAuxiliarValores[resultado * numero_posicoes]);
                }
                arrayMarcadorFIFO[resultado]++;
        }
               
        }else if(metodo == "lru"){ // Implementação LRU
            marcaUsoLRU++; // Variavel para controlar o ultimo utilizado

            // Inicio validação local aonde entrará
            resultado = sequencia % conjuntos;
            var stringLog = sequencia+"%"+conjuntos+" = "+resultado;

            if($('#logs').html() != "")
                $('#logs').html($('#logs').html()+"\n"+stringLog);
            else
                $('#logs').html(stringLog);
            //Fim validação

            var aux = arrayBlocos[resultado].length;
            var i = 0;

            //Validação para quando o conjunto ainda não está lotado.
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

            // Para quando o conjunto está lotado
            if(aux == arrayBlocos[resultado].length + numero_posicoes && !arrayAuxiliarValores.includes(sequencia)){
                var arraymenor = []; // Declaração de um vetor auxiliar, para sabermos o menor valor.
                for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){
                    arraymenor.push(arrayMarcadorLRU[arrayAuxiliarValores[i]]);
                }

                // percorrendo o conjunto
                for (var i = resultado * numero_posicoes; i < (resultado * numero_posicoes) + numero_posicoes; i++){
                    if(arrayMarcadorLRU[arrayAuxiliarValores[i]] == Math.min.apply(Math, arraymenor)){ // caso o valor encontrado seja o menor, faço a substituição
                        arrayAuxiliarValores[i] = sequencia;
                        $("#bloco"+i).text(arrayAuxiliarValores[i]);
                        arrayMarcadorLRU[sequencia] = marcaUsoLRU;
                    }
                }

            }
            
        }else if(metodo == "lfu"){ // Implementação LFU

        }
    }else if(sequencia == ""){
        alert("Preencha a sequência!");
    }else if($('#controlador').val() == "0"){
        alert("Favor carregue a memória antes de inserir blocos!");
    }
}
