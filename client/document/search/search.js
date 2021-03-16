$(function() {
    console.log("Search Component!");
    
    var docsTable = $("#docsTable");
    var modalContainer = $("#modalContainer");
    var addBtn = $("#addBtn");
    var searchBtn = $("#searchBtn");

    if(!checkAuth()){
        addBtn.hide();
    }

    addBtn.on("click", function(){
        openModal(modalContainer, "components/modal/modal.html", "Adicionar Documento", "document/create/createDocument.html");
    });

    docsTable.on('click', 'tbody tr', function() {
        let current = $(this);
        let name = current.find("td").eq(0).html();
        openModal(modalContainer, "components/modal/modal.html", `${name}`, "document/manage/manageDocument.html");
    });
});