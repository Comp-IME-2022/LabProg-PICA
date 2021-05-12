var server = "http://127.0.0.1:5000";
var modalContainer = $("#modalContainer");


$( function() {
  $("#registerForm").submit(function(e) {
    e.preventDefault();

    var formData = {
      "nome": $("#nome").val(),
      "sobrenome": $("#sobrenome").val(),
      "nascimento": $("#nascimento").val(),
      "login": $("#login").val(),
      "senha": $("#senha").val(),
      "admin": $("#admin").prop('checked')
    }

    console.log(formData);
    // $.ajax({
    //     type: "POST",
    //     url: "/auth/register",
    //     data: formData,
    //     dataType: 'json',
    //     success: () => modalContainer.modal("hide")
    // })
  })
  
});
