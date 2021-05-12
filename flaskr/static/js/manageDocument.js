$(function(){
    var sendBtn = $("#sendBtn");
    var manageDocumentForm = $('#manageDocumentForm');
    var modalContainer = $('#modalContainer');

    manageDocumentForm.on("submit", function(e){
        e.preventDefault()
    
        //Formdata com os metadados do arquivo
        var  metadataData = {
            titulo: $('#titulo').val(),
            autores: $('#autores').val(),
            orientadores: $('#orientadores').val(),
            InstEns: $('#InstEns').val(),
            tipo: $('#tipo').val(),
            keyword:  $('#keyword').val(),
            resumo: $('#resumo').val(),
            id: $('#id').val(),
        };
    
        //requisicao para salvar os metadados
        $.ajax({
            type : 'POST',
            url : '/document/manage-pfc',
            data: metadataData,
            dataType: "json",
            encode: true,
            success :() => modalContainer.modal("hide")
        })
    
        return false
    });
    
    
});