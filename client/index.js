$(function() {
    var body = $("#bodyContainer");
    var navbar = $("#navbarContainer");
    var footer = $("#footerContainer");
    
    body.load("./document/search/search.html");
    navbar.load("./components/navbar/navbar.html");
    footer.load("./components/footer/footer.html");
});

var openModal = function modalService(div, url, title, bodyURL){
    div.load(url, function() {
        $("#modalTitle").text(title);
        $("#modalBody").load(bodyURL);
        div.modal("show");
    });
}
