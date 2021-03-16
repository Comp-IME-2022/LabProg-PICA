$(function() {
    console.log("Navbar Component!");

    var modalContainer = $("#modalContainer");

    var loginForm = $("#loginForm");
    var logoutBtn = $("#logoutBtn");
    var addUserBtn = $("#addUserBtn");
    var userOptions = $("#userOptions");

    if(checkAuth()){
        loginForm.removeClass("d-flex");
        loginForm.hide();

        userOptions.removeClass("d-none");
    };
    
    loginForm.submit(function(e){
        e.preventDefault();
        if($("#loginInput").val() && $("#passwordInput").val()){
            setCookie($("#loginInput").val() && $("#passwordInput").val());
            location.reload();
        };
    });

    logoutBtn.on("click", function(){
        setCookie(false);
        location.reload();
    });

    addUserBtn.on("click", function(){
        openModal(modalContainer, "components/modal/modal.html", "Cadastrar Usuário", "user/create/createUser.html");
    });
});