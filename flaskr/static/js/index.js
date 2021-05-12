$(function() {
    var body = $("#bodyContainer");
    var navbar = $("#navbarContainer");
    var footer = $("#footerContainer");
    
    body.load("/search");
    navbar.load("/navbar");
    footer.load("/footer");
});

var openModal = function modalService(div, url, title, bodyURL){
    div.load(url, function() {
        $("#modalTitle").text(title);
        $("#modalBody").load(bodyURL);
        div.modal("show");
    });
}
