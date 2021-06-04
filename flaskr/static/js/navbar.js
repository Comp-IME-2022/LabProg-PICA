$(function() {
    console.log("Navbar Component!");
    var modalContainer = $("#modalContainer");
    var logoutBtn = $("#logoutBtn");
    var addUserBtn = $("#addUserBtn");
    var loginForm = $("#loginForm");
    var addDocBtn = $("#addDocBtn");
    var backupBtn = $("#backupBtn");

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
            url : '/document/backupw',
            success : (listFiles) => {
                data = new Date();
                dia = data.getDate().toString()
                mes = (data.getMonth()+1).toString()
                mes = (mes.length == 1) ? '0'+mes : mes
                ano = data.getFullYear().toString();
                hora = data.getHours().toString();
                min = data.getMinutes().toString();
                var blob = new Blob([listFiles], {
                    type: 'application/json'
                  });

                var link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link.download=`backup_${dia}/${mes}/${ano}_${hora}h${min}.JSON`;
                link.click();
            },
            error : function (err) {
                window.alert("Falha no backup: " + err);
            }
        })
    });

    $("#retrieveBtn2").on("click", function(){
        openModal(modalContainer, "/modal", "Realizar restauração", "/restoration");
    });

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