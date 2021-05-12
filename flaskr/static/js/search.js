$(function() {
    console.log("Search Component!");
    
    var docsTable = $("#docsTable");
    var modalContainer = $("#modalContainer");

    tableRendered =  docsTable.DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese.json"
        },
        "ajax": "/document/get-pfc",
        "columns": [
            { "data": "titulo" },
            { "data": "tipo" },
            { "data": "autores" },
            { "data": "data" },
        ]
    });

    docsTable.on('click', 'tr', function() {
        //Dados do documento
        let index = tableRendered.row( this ).index()
        let titulo = tableRendered.row(index).data()["titulo"]
        console.log(titulo)
        let autores = tableRendered.row(index).data()["autores"]
        let orientadores = tableRendered.row(index).data()["orientadores"]
        let InstEns = tableRendered.row(index).data()["InstEns"]
        let keyword = tableRendered.row(index).data()["keyword"]
        let resumo = tableRendered.row(index).data()["resumo"]
        let id = tableRendered.row(index).data()["_id"]
        let url = "/manage-document?titulo="+titulo+"&autores="+autores+"&orientadores="+orientadores+"&InstEns="+InstEns+"&keyword="+keyword+"&resumo="+resumo+"&id="+id
        //Corrigir url para retirar espaços em branco
        let urlSanitized = url.replace(/\s/g , "%20")
        console.log(urlSanitized)
        openModal(modalContainer, "/modal", `${titulo}`, urlSanitized);
    });
});


function updateData(){
    $.ajax({
        type : 'GET',
        url : '/document/get-pfc',
        success : (response) => renderTable(JSON.parse(response)),
        error : (err) => console.log(err)
        
    })
}

function searchData(){
    let text = $("#searchInput").val();
    $.ajax({
        type : 'POST',
        url : '/document/search-pfc',
        data: {"search": text},
        dataType: 'json',
        success : (response) => renderTable(response),
        error : (err) => console.log(err)
    })
}

function renderTable(contentArray){
    var tableBody = $("#tableBody");
    tableBody.empty();
    for (let content of contentArray){
        if(content['nome']!=null && content['data']!=null){
            tableBody.append(renderElement(content['titulo'], content['data']));
        }
    }
}

function renderElement(titulo, date){  
   return `
    <tr>
            <td>${titulo}</td>
            <td>${date}</td>
    </tr>
   `
}