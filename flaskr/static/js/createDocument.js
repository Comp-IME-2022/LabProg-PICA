$(function() {
var file = $('#myfile');
var modalContainer = $('#modalContainer')
var createDocumentForm = $("#createDocumentForm");

file.bind('change', function() {
    if (this.files[0].size > 20971520){
        alert("O tamanho máximo é 20MB!")
    }
    //Cria um formdata com o documento a ser enviado
    var fileData = new FormData();
    var files = file[0].files[0]
    fileData.append('file', files)
    //requisicao para enviar o pdf
    $.ajax({
        type : 'POST',
        url : '/document/upload-pfc-file',
        data: fileData,
        contentType: false,
        processData: false,
        success :() =>   $.ajax({
            type : 'GET',
            url : `/document/get-pdf-data?filename=${this.files[0].name}`,
            contentType: false,
            processData: false,
            success :(response) => {
                $('#titulo').val(response['titulo']),
                $('#autores').val(response['autores']),
                $('#orientadores').val(response['orientadores']),
                $('#keyword').val(response['palavras_chave']),
                $('#resumo').val(response['resumo']),
                $('#tipo').val(response['tipo'])
            }
        }),
        error: (e) => console.log(e)
    })
});

createDocumentForm.on("submit", function(e){
    e.preventDefault()
    
    //Retorna a data de hoje
    data = new Date()
    dia = data.getDate().toString()
    mes = (data.getMonth()+1).toString()
    mes = (mes.length == 1) ? '0'+mes : mes
    ano = data.getFullYear().toString()

    //Formdata com os metadados do arquivo
    var  metadataData = {
        titulo: $('#titulo').val(),
        autores: $('#autores').val(),
        orientadores: $('#orientadores').val(),
        InstEns: $('#InstEns').val(),
        tipo: $('#tipo').val(),
        keyword:  $('#keyword').val(),
        resumo: $('#resumo').val(),
        data : `${dia}/${mes}/${ano}`,
        filename: files.name
    };

    //requisicao para salvar os metadados
    $.ajax({
        type : 'POST',
        url : '/document/upload-pfc',
        data: metadataData,
        dataType: "json",
        encode: true,
        success :() => modalContainer.modal("hide"),
        error: (e) => console.log(e)
    })

    return false
});

});