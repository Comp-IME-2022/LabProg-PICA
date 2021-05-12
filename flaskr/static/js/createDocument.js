$(function() {
var file = $('#myfile');
var modalContainer = $('#modalContainer')
console.log(modalContainer[0])
var createDocumentForm = $("#createDocumentForm");

file.bind('change', function() {
    if (this.files[0].size > 20971520){
        alert("O tamanho máximo é 20MB!")
    }
});

createDocumentForm.on("submit", function(e){
    e.preventDefault()

    //Cria um formdata com o documento a ser enviado
    var fileData = new FormData();
    var files = file[0].files[0]
    fileData.append('file', files)

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
        data : `${dia}/${mes}/${ano}`
    };
    
    //requisicao para enviar o pdf
    $.ajax({
        type : 'POST',
        url : '/document/upload-pfc-file',
        data: fileData,
        contentType: false,
        processData: false,
        success :() => modalContainer.modal("hide")
    })

    //requisicao para salvar os metadados
    $.ajax({
        type : 'POST',
        url : '/document/upload-pfc',
        data: metadataData,
        dataType: "json",
        encode: true
    })

    return false
});

});