$(function() {
    console.log("Search Component!");
    
    var modalBtn = $("#modalBtn");
    var modalContainer = $("#modalContainer");
    var docsTable = $("#docsTable");

    modalBtn.on("click", function(){
        openModal(modalContainer, "components/modal/modal.html", "Editar", "document/manage/manage.html");
    });

    docsTable.on('click', 'tbody tr', function() {
        /**
        select_stock(symbol);
        * 
        */
        let current = $(this);
        let symbol = current.find("td").eq(0).html();
        console.log("Hi", symbol);
    });
});