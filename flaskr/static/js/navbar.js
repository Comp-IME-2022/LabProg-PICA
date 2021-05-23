$(function() {
    console.log("Navbar Component!");
    var modalContainer = $("#modalContainer");
    var logoutBtn = $("#logoutBtn");
    var addUserBtn = $("#addUserBtn");
    var loginForm = $("#loginForm");
    var addDocBtn = $("#addDocBtn");
    var backupBtn = $("#backupBtn");
    var retrieveBtn = $("#retrieveBtn");

    logoutBtn.on("click", function(){
        $.ajax({
            type: "GET",
            url: "/auth/logout",
            success: () => location.reload()
        })
    });

    addUserBtn.on("click", function(){
        openModal(modalContainer, "/modal", "Cadastrar Usuário", "/create-user");
    });


    addDocBtn.on("click", function(){
        openModal(modalContainer, "/modal", "Adicionar Documento", "/create-document");
    });

    backupBtn.on("click", function(){
        $.ajax({
            type : 'GET',
            url : '/document/backup',
            success : () => {
                window.alert("Backup feito com sucesso!");
                console.log("Sucesso pra fazer o backup!");
            },
            error : function (err) {
                window.alert("Falha no backup: " + err);
            }
        })
    });

    retrieveBtn.on("click", function(){
        $.ajax({
            type : 'GET',
            url : '/document/retrieve',
            contentType: false,
            processData: false,
            success :() => {
             window.alert("Recuperação feita com sucesso!");
        },
            error: function (err) {
                window.alert("Falha na recuperação: " + err);
            }
        })
    })


    loginForm.on("submit", function(e){
        e.preventDefault()
        var loginInput = $("#loginInput")
        var passwordInput = $("#passwordInput")

        var btn = $("#submitBtn")
        btn.addClass("disabled")

        var formData = {
            login: $("#loginInput").val(),
            senha: $("#passwordInput").val()
        }

        $.ajax({
            type : 'POST',
            url : '/auth/login',
            data: formData,
            dataType: "json",
            encode: true,
            success : () => location.reload(),
            error : function (err) {
                var errMsg = err.responseJSON["error"]
                if(errMsg == "username") {
                    loginInput.addClass("is-invalid")
                    passwordInput.removeClass("is-invalid")
                }else if(errMsg == "password") {
                    passwordInput.addClass("is-invalid")
                    loginInput.removeClass("is-invalid")
                }
                btn.removeClass("disabled")
            }
        })

        return false
    })
});