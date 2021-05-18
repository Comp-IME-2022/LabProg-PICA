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
    
    $("#downBtn").click(function(e){
        e.preventDefault();
        var title = $('#titulo').val();
        console.log("entrou no click");
        console.log(title);
        $.ajax({
            method : "GET",
            url : `/document/download/${title}`,
            xhrFields: {
                responseType: 'blob'
              },
            success : function(blob){
                data = new Date();
                dia = data.getDate().toString()
                mes = (data.getMonth()+1).toString()
                mes = (mes.length == 1) ? '0'+mes : mes
                ano = data.getFullYear().toString();
                hora = data.getHours().toString();
                min = data.getMinutes().toString();
                var link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link.download=`${title}_${dia}/${mes}/${ano}_${hora}h${min}`;
                link.click();
            }
        })
    });
});