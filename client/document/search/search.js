$(function() {
    console.log("Search Component!");
    
    var modalBtn = $("#modalBtn");
    var modalContainer = $("#modalContainer");
    var docsTable = $("#docsTable");

    modalBtn.on("click", function(){
    });

    docsTable.on('click', 'tbody tr', function() {
        let current = $(this);
        let name = current.find("td").eq(0).html();
        openModal(modalContainer, "components/modal/modal.html", `${name}`, "document/create/createDocument.html");
    });
});